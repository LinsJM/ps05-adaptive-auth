from typing import List, Optional

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

import models
import schemas
import security
from database import get_db

import privacy

import json
from collections import Counter

router = APIRouter(prefix="/api/events", tags=["events"])


def record_login_event(
    db: Session,
    request: Request,
    email_attempted: str,
    success: bool,
    user_id: Optional[int] = None,
    device_id: Optional[str] = None,
    failure_reason: Optional[str] = None,
    risk_score: Optional[int] = None,
    decision: Optional[str] = None,
    reasons_json: Optional[str] = None,
) -> models.LoginEvent:
    event = models.LoginEvent(
        user_id=user_id,
        email_attempted=email_attempted,
        ip_prefix=privacy.truncate_ip(privacy.get_client_ip(request)),
        ua_summary=privacy.summarize_ua(request.headers.get("user-agent")),
        device_id=device_id,
        country=privacy.get_country(request),
        success=success,
        failure_reason=failure_reason,
        risk_score=risk_score,
        decision=decision,
        reasons_json=reasons_json,
    )
    db.add(event)
    db.commit()
    return event

@router.get("/recent", response_model=List[schemas.LoginEventOut])
def recent_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return (
        db.query(models.LoginEvent)
        .filter(models.LoginEvent.user_id == current_user.id)
        .order_by(models.LoginEvent.created_at.desc())
        .limit(20)
        .all()
    )

@router.get("/summary", response_model=schemas.SummaryOut)
def summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    events = (
        db.query(models.LoginEvent)
        .filter(models.LoginEvent.user_id == current_user.id)
        .all()
    )

    # A verified step-up completes an attempt that was already counted when challenged
    attempts = [e for e in events if e.decision != "verified"]

    decisions = Counter(
        e.decision for e in attempts if e.decision in ("allow", "step_up", "restrict")
    )

    signals = Counter()
    for e in attempts:
        try:
            for reason in json.loads(e.reasons_json or "[]"):
                signals[reason["signal"]] += 1
        except (ValueError, KeyError, TypeError):
            pass

    return {
        "total": len(attempts),
        "successful": sum(1 for e in events if e.success),
        "wrong_password": sum(1 for e in events if e.failure_reason == "wrong_password"),
        "challenged": sum(1 for e in events if e.failure_reason == "step_up_required"),
        "verified": sum(1 for e in events if e.decision == "verified"),
        "by_decision": {k: decisions.get(k, 0) for k in ("allow", "step_up", "restrict")},
        "top_signals": [
            {"signal": s, "count": c} for s, c in signals.most_common(5)
        ],
    }