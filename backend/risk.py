import json
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import List

from sqlalchemy import or_
from sqlalchemy.orm import Session

import models

# ---- Tunable settings (we will tune these on Day 4 using the evaluation) ----
WEIGHTS = {
    "new_device": 35,
    "new_country": 25,
    "unusual_hour": 10,
    "abrupt_change": 15,        # new device AND new country together
    "credential_stuffing": 20,  # many different accounts failing from one network
}
FAILURE_POINTS = [(5, 30), (3, 15), (1, 5)]  # (minimum failures, points)
STEP_UP_THRESHOLD = 30
ENFORCE_STEP_UP = True
RESTRICT_AFTER_FAILURES = 5
FAILURE_WINDOW_MINUTES = 15
STUFFING_DISTINCT_EMAILS = 5
MIN_LOGINS_FOR_HOUR = 5     # cold-start rule: need history before judging hours
HOUR_TOLERANCE = 3          # hours either side of a usual login time
NON_FAILURE_REASONS = ["restricted", "step_up_required"]


@dataclass
class RiskResult:
    score: int
    decision: str  # allow / step_up / restrict
    reasons: List[dict] = field(default_factory=list)

    def reasons_json(self) -> str:
        return json.dumps(self.reasons)


def _utcnow() -> datetime:
    # Naive UTC, because SQLite returns naive datetimes
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _hour_distance(a: int, b: int) -> int:
    d = abs(a - b) % 24
    return min(d, 24 - d)


def _recent_failures(db: Session, email: str, window_start: datetime) -> int:
    """Failed attempts for this email in the window, since its last successful login.
    Keyed by the email typed (not the user), so unknown emails behave identically."""
    last_success = (
        db.query(models.LoginEvent.created_at)
        .filter(
            models.LoginEvent.email_attempted == email,
            models.LoginEvent.success.is_(True),
            models.LoginEvent.created_at >= window_start,
        )
        .order_by(models.LoginEvent.created_at.desc())
        .first()
    )
    since = last_success[0] if last_success else window_start
    return (
            db.query(models.LoginEvent)
        .filter(
            models.LoginEvent.email_attempted == email,
            models.LoginEvent.success.is_(False),
            models.LoginEvent.created_at > since,
            or_(models.LoginEvent.failure_reason.is_(None),
                models.LoginEvent.failure_reason.notin_(NON_FAILURE_REASONS)),
        )
        .count()
    )


def evaluate(
    db: Session,
    *,
    email: str,
    user,
    device_id,
    country,
    ip_prefix,
    hour,
    now=None,
) -> RiskResult:
    """Score one login attempt using this user's history. Call BEFORE recording the attempt."""
    now = now or _utcnow()
    window_start = now - timedelta(minutes=FAILURE_WINDOW_MINUTES)
    reasons: List[dict] = []

    def add(signal: str, points: int, detail: str):
        reasons.append({"signal": signal, "points": points, "detail": detail})

    # Signal: repeated failures on this account
    failures = _recent_failures(db, email, window_start)
    for minimum, points in FAILURE_POINTS:
        if failures >= minimum:
            add("repeated_failures", points,
                f"{failures} failed attempt(s) in the last {FAILURE_WINDOW_MINUTES} minutes")
            break

    # Signal: many different accounts failing from the same network
    if ip_prefix:
        distinct = (
            db.query(models.LoginEvent.email_attempted)
            .filter(
                models.LoginEvent.ip_prefix == ip_prefix,
                models.LoginEvent.success.is_(False),
                models.LoginEvent.created_at >= window_start,
                or_(models.LoginEvent.failure_reason.is_(None),
                    models.LoginEvent.failure_reason != "restricted"),
            )
            .distinct()
            .count()
        )
        if distinct >= STUFFING_DISTINCT_EMAILS:
            add("credential_stuffing", WEIGHTS["credential_stuffing"],
                f"{distinct} different accounts failed from this network recently")

    # Signals that need this user's history
    new_device = False
    new_country = False
    if user is not None:
        # Device: the first device on an account is the baseline (no signal)
        has_any_device = (
            db.query(models.KnownDevice).filter_by(user_id=user.id).first() is not None
        )
        if has_any_device:
            trusted = False
            if device_id:
                trusted = (
                    db.query(models.KnownDevice)
                    .filter(
                        models.KnownDevice.user_id == user.id,
                        models.KnownDevice.device_id == device_id,
                        models.KnownDevice.trusted.is_(True),
                    )
                    .first()
                    is not None
                )
            if not trusted:
                new_device = True
                add("new_device", WEIGHTS["new_device"],
                    "No device identifier sent" if not device_id
                    else "Device has not been verified for this account")

        successes = (
            db.query(models.LoginEvent.country, models.LoginEvent.created_at)
            .filter(
                models.LoginEvent.user_id == user.id,
                models.LoginEvent.success.is_(True),
            )
            .all()
        )

        # Country: needs at least one past login to compare against
        if country and successes:
            known = {c for c, _ in successes if c}
            if known and country not in known:
                new_country = True
                add("new_country", WEIGHTS["new_country"],
                    f"Login from {country}; earlier successful logins were from "
                    f"{', '.join(sorted(known))}")

        # Hour: needs enough history, and is only compared in a familiar country,
        # because UTC hours are not comparable across time zones
        if hour is not None and len(successes) >= MIN_LOGINS_FOR_HOUR and not new_country:
            nearest = min(_hour_distance(hour, t.hour) for _, t in successes)
            if nearest > HOUR_TOLERANCE:
                add("unusual_hour", WEIGHTS["unusual_hour"],
                    f"Login at {hour:02d}:00 UTC, more than {HOUR_TOLERANCE} hours "
                    f"from this account's usual login times")

    # Signal: abrupt change (several things changed at once)
    if new_device and new_country:
        add("abrupt_change", WEIGHTS["abrupt_change"],
            "New device and new country at the same time")

    score = min(sum(r["points"] for r in reasons), 100)

    if failures >= RESTRICT_AFTER_FAILURES:
        decision = "restrict"
    elif score >= STEP_UP_THRESHOLD:
        decision = "step_up"
    else:
        decision = "allow"

    return RiskResult(score=score, decision=decision, reasons=reasons)