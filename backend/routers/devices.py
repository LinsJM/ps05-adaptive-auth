from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
import security
from database import get_db

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.get("", response_model=List[schemas.DeviceOut])
def list_devices(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return (
        db.query(models.KnownDevice)
        .filter(models.KnownDevice.user_id == current_user.id)
        .order_by(models.KnownDevice.last_seen_at.desc())
        .all()
    )


@router.post("/{device_pk}/revoke", response_model=schemas.DeviceOut)
def revoke_trust(
    device_pk: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    # Filtering by user_id means you can only touch your own devices
    device = (
        db.query(models.KnownDevice)
        .filter(
            models.KnownDevice.id == device_pk,
            models.KnownDevice.user_id == current_user.id,
        )
        .first()
    )
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.trusted = False
    db.commit()
    db.refresh(device)
    return device