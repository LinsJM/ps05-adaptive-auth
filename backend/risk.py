import json
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

import models

# ---- Tunable settings ----
WEIGHTS = {
    "new_device": 45,           # Unrecognized device / hardware (Tier 3: 45–59 pts)
    "new_country": 25,
    "unusual_hour": 10,
    "abrupt_change": 15,        # new device AND new country together
    "credential_stuffing": 20,  # many different accounts failing from one network
    "vpn_tor_proxy": 25,        # Tor exit node / VPN detected
    "impossible_travel": 45,    # Distance / time anomaly
    "cross_app_threat": 35,     # Attack on companion app (Bank/Social)
    "flagged_ip": 50,           # IP in threat watchlist
    "honeytoken": 100,          # backup_admin trap
}
FAILURE_POINTS = [(5, 30), (3, 15), (1, 5)]  # (minimum failures, points)
STEP_UP_THRESHOLD = 30
RESTRICT_AFTER_FAILURES = 5
FAILURE_WINDOW_MINUTES = 15
STUFFING_DISTINCT_EMAILS = 5
MIN_LOGINS_FOR_HOUR = 5     # cold-start rule: need history before judging hours
HOUR_TOLERANCE = 3          # hours either side of a usual login time


# 5 Distinct Threat Vectors in Login Security (Banking & Social Media)
THREAT_CATEGORIES = {
    # 1. Credential Replay & Leaks (Compromised Secrets)
    "honeytoken": "1. Credential Replay & Leaks",
    "breached_credential": "1. Credential Replay & Leaks",
    "account_locked": "1. Credential Replay & Leaks",

    # 2. Automated & High-Velocity Threats (Bots & Brute Force)
    "repeated_failures": "2. Automated & Bot Velocity",
    "credential_stuffing": "2. Automated & Bot Velocity",

    # 3. Device & Environment Posture Threats
    "new_device": "3. Device & Environment Posture",
    "untrusted_hardware": "3. Device & Environment Posture",

    # 4. Network & Geolocation Anomalies (Impossible Travel)
    "new_country": "4. Network & Location Anomalies",
    "impossible_travel": "4. Network & Location Anomalies",
    "vpn_tor_proxy": "4. Network & Location Anomalies",
    "flagged_ip": "4. Network & Location Anomalies",

    # 5. Behavioral Anomalies & Session Hijacking
    "unusual_hour": "5. Behavioral & Biometrics",
    "abrupt_change": "5. Behavioral & Biometrics",
    "cross_app_threat": "5. Behavioral & Biometrics",
}


@dataclass
class RiskResult:
    score: int
    decision: str  # allow / step_up / restrict (LinsJM backward compatibility)
    reasons: List[dict] = field(default_factory=list)
    action: str = "allow"  # allow / captcha / email_otp / otp_password_reset / block (Brief policy)
    requires_step_up: bool = False
    step_up_type: Optional[str] = None
    primary_threat_vector: Optional[str] = None
    app_policy: Optional[dict] = None

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
        )
        .count()
    )


def map_score_to_action(score: int) -> tuple[str, bool, Optional[str]]:
    """
    DIGNITAS 5-Tier Adaptive Threat Policy:
    0-29  : Allow (Frictionless pass in <10ms)
    30-44 : CAPTCHA (Cloudflare Turnstile)
    45-59 : Email OTP + Device Trust Enrollment
    60-79 : Session Quarantine & Out-of-Band Email Approval
    80-100: Block + SQLite IP Blacklist + Compromised Password Alert Email
    """
    if score >= 80:
        return "block", False, None
    elif score >= 60:
        return "quarantine_verify", True, "quarantine_verify"
    elif score >= 45:
        return "email_otp", True, "email_otp"
    elif score >= 30:
        return "captcha", True, "captcha"
    else:
        return "allow", False, None


def evaluate(
    db: Session,
    *,
    email: str,
    user=None,
    device_id: Optional[str] = None,
    country: Optional[str] = None,
    ip_prefix: Optional[str] = None,
    hour: Optional[int] = None,
    now=None,
    ip_address: Optional[str] = None,
    app_id: str = "bank",
    is_vpn: bool = False,
    mins_since_last_login: Optional[int] = None,
) -> RiskResult:
    """Score one login attempt using this user's history. Call BEFORE recording the attempt."""
    now = now or _utcnow()
    window_start = now - timedelta(minutes=FAILURE_WINDOW_MINUTES)
    reasons: List[dict] = []
    clean_email = email.strip().lower()

    def add(signal: str, points: int, detail: str):
        cat = THREAT_CATEGORIES.get(signal, "5. Behavioral & Biometrics")
        reasons.append({"signal": signal, "points": points, "detail": detail, "category": cat})

    if app_id == "bank":
        policy_info = {
            "profile": "Apex Bank Zero-Trust Policy",
            "risk_tolerance": "Low Friction Tolerance (Strict Fraud Prevention)",
            "primary_goal": "Prevent unauthorized financial loss, wire fraud, and regulatory breach",
            "fallback_action": "Hard block, freeze credentials, or out-of-band banking app prompt",
        }
    else:
        policy_info = {
            "profile": "Pulse Social Engagement-Preserving Policy",
            "risk_tolerance": "High Friction Tolerance (Optimizes Engagement & Rapid Access)",
            "primary_goal": "Prevent spam botnets, brand impersonation, and mass account theft",
            "fallback_action": "Step-up OTP challenge, self-service recovery, or invisible Turnstile CAPTCHA",
        }

    # 1. HONEYTOKEN TRAP: backup_admin
    if clean_email == "backup_admin":
        if ip_address:
            # Auto-flag the attacking IP
            flag_ip = db.query(models.FlaggedIP).filter(models.FlaggedIP.ip_address == ip_address).first()
            if not flag_ip:
                db.add(models.FlaggedIP(
                    ip_address=ip_address,
                    reason="Honeytoken account 'backup_admin' access attempt",
                    flagged_at=now
                ))
                db.commit()

        add("honeytoken", WEIGHTS["honeytoken"], "Honeytoken account 'backup_admin' targeted. Source IP flagged.")
        return RiskResult(
            score=100,
            decision="restrict",
            reasons=reasons,
            action="block",
            requires_step_up=False,
            step_up_type=None,
            primary_threat_vector="1. Credential Replay & Leaks",
            app_policy=policy_info,
        )

    # 2. ACCOUNT LOCKED STATUS
    if user is not None and getattr(user, "is_locked", False):
        add("account_locked", 100, f"Account is locked: {user.locked_reason or 'Security lockout'}")
        return RiskResult(
            score=100,
            decision="restrict",
            reasons=reasons,
            action="block",
            requires_step_up=False,
            step_up_type=None,
            primary_threat_vector="1. Credential Replay & Leaks",
            app_policy=policy_info,
        )

    # 3. FLAGGED IP CHECK
    if ip_address:
        is_flagged = db.query(models.FlaggedIP).filter(models.FlaggedIP.ip_address == ip_address).first()
        if is_flagged:
            add("flagged_ip", WEIGHTS["flagged_ip"], f"IP {ip_address} is listed on threat watchlist: {is_flagged.reason}")

    # 4. VPN / TOR / PROXY
    if is_vpn:
        add("vpn_tor_proxy", WEIGHTS["vpn_tor_proxy"], "Traffic routed through anonymizing VPN / Tor exit node")

    # 5. REPEATED FAILURES
    failures = _recent_failures(db, clean_email, window_start)
    for minimum, points in FAILURE_POINTS:
        if failures >= minimum:
            add("repeated_failures", points,
                f"{failures} failed attempt(s) in the last {FAILURE_WINDOW_MINUTES} minutes")
            break

    # 6. CREDENTIAL STUFFING FROM SAME NETWORK
    if ip_prefix:
        distinct = (
            db.query(models.LoginEvent.email_attempted)
            .filter(
                models.LoginEvent.ip_prefix == ip_prefix,
                models.LoginEvent.success.is_(False),
                models.LoginEvent.created_at >= window_start,
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
            .order_by(models.LoginEvent.created_at.desc())
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

            # Check Impossible Travel
            last_country, last_time = successes[0]
            mins_diff = mins_since_last_login
            if mins_diff is None and last_time:
                elapsed = (now - last_time).total_seconds() / 60.0
                mins_diff = max(1, int(elapsed))

            if last_country and country and last_country != country:
                if mins_diff is not None and mins_diff < 60:
                    add("impossible_travel", WEIGHTS["impossible_travel"],
                        f"Impossible travel: Jump from {last_country} to {country} in {mins_diff} mins")

        # Hour: cold-start rule, needs enough history first
        if hour is not None and len(successes) >= MIN_LOGINS_FOR_HOUR:
            nearest = min(_hour_distance(hour, t.hour) for _, t in successes)
            if nearest > HOUR_TOLERANCE:
                add("unusual_hour", WEIGHTS["unusual_hour"],
                    f"Login at {hour:02d}:00 UTC, more than {HOUR_TOLERANCE} hours "
                    f"from this account's usual login times")

    # Signal: abrupt change (several things changed at once)
    if new_device and new_country:
        add("abrupt_change", WEIGHTS["abrupt_change"],
            "New device and new country at the same time")

    # 7. CROSS-APP CORRELATION: Check other companion app
    companion_app = "social" if app_id == "bank" else "bank"
    recent_companion_attack = (
        db.query(models.LoginEvent)
        .filter(
            models.LoginEvent.email_attempted == clean_email,
            models.LoginEvent.app_id == companion_app,
            models.LoginEvent.created_at >= window_start,
            models.LoginEvent.risk_score >= 50,
        )
        .order_by(models.LoginEvent.created_at.desc())
        .first()
    )
    if recent_companion_attack:
        add("cross_app_threat", WEIGHTS["cross_app_threat"],
            f"Cross-app correlation: High-risk security event (Score {recent_companion_attack.risk_score}) on '{companion_app}' 5m ago")

    score = min(sum(r["points"] for r in reasons), 100)

    # 5-Tier Policy Action
    # 0–29  : Allow (Frictionless pass in <10ms)
    # 30–44 : CAPTCHA (Cloudflare Turnstile)
    # 45–59 : Email OTP + Device Trust Enrollment
    # 60–79 : Session Quarantine & Out-of-Band Email Approval
    # 80–100: Block + SQLite IP Blacklist + Compromised Password Alert Email
    action, requires_step_up, step_up_type = map_score_to_action(score)

    # LinsJM's decision backward compatibility (allow / step_up / restrict)
    if failures >= RESTRICT_AFTER_FAILURES or score >= 80:
        decision = "restrict"
    elif score >= STEP_UP_THRESHOLD:
        decision = "step_up"
    else:
        decision = "allow"

    # Calculate primary threat vector
    if reasons:
        category_sums = {}
        for r in reasons:
            c = r.get("category", "5. Behavioral & Biometrics")
            category_sums[c] = category_sums.get(c, 0) + r.get("points", 0)
        primary_threat = max(category_sums.items(), key=lambda x: x[1])[0]
    else:
        primary_threat = "Frictionless / Habitual Baseline"

    return RiskResult(
        score=score,
        decision=decision,
        reasons=reasons,
        action=action,
        requires_step_up=requires_step_up,
        step_up_type=step_up_type,
        primary_threat_vector=primary_threat,
        app_policy=policy_info,
    )