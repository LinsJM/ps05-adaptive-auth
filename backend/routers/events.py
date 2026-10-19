from typing import List, Optional

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

import models
import schemas
import security
from database import get_db

import privacy 

router = APIRouter(prefix="/api/events", tags=["events"])


def record_login_event(
    db: Session,
    request: Request,
    email_attempted: str,
    success: bool,
    user_id: Optional[int] = None,
    device_id: Optional[str] = None,
    failure_reason: Optional[str] = None,
    app_id: str = "bank",
    risk_score: int = 0,
    decision: str = "allow",
    action: str = "allow",
    reasons_json: str = "[]",
    latency_ms: float = 0.0,
    city: Optional[str] = None,
    is_vpn: bool = False,
    ip_address: Optional[str] = None,
) -> models.LoginEvent:
    client_ip = ip_address or privacy.get_client_ip(request)
    event = models.LoginEvent(
        app_id=app_id,
        user_id=user_id,
        email_attempted=email_attempted,
        ip_prefix=privacy.truncate_ip(client_ip),
        ip_address=client_ip,
        ua_summary=privacy.summarize_ua(request.headers.get("user-agent")),
        device_id=device_id or "dev-unknown",
        city=city,
        country=privacy.get_country(request),
        is_vpn=is_vpn,
        success=success,
        failure_reason=failure_reason,
        risk_score=risk_score,
        decision=decision,
        action=action,
        reasons_json=reasons_json,
        latency_ms=latency_ms,
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