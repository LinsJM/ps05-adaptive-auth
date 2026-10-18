from typing import List, Optional

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

import models
import schemas
import security
from database import get_db

router = APIRouter(prefix="/api/events", tags=["events"])


def record_login_event(
    db: Session,
    request: Request,
    email_attempted: str,
    success: bool,
    user_id: Optional[int] = None,
    device_id: Optional[str] = None,
    failure_reason: Optional[str] = None,
) -> models.LoginEvent:
    event = models.LoginEvent(
        user_id=user_id,
        email_attempted=email_attempted,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        device_id=device_id,
        success=success,
        failure_reason=failure_reason,
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