from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

import models
import privacy
import risk
import schemas
import security
from database import get_db
from routers.events import record_login_event

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=schemas.RegisterResponse,
             status_code=status.HTTP_201_CREATED)
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()

    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=email,
        password_hash=security.hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully", "user_id": user.id}

def update_known_device(db: Session, user, device_id, ua_summary):
    """The first device on an account is the trusted baseline. Later new devices are
    recorded as untrusted; on Day 3 they become trusted after passing step-up."""
    if not device_id:
        return
    device = (
        db.query(models.KnownDevice)
        .filter_by(user_id=user.id, device_id=device_id)
        .first()
    )
    if device:
        device.last_seen_at = models.utcnow()
    else:
        has_any = db.query(models.KnownDevice).filter_by(user_id=user.id).first() is not None
        db.add(models.KnownDevice(
            user_id=user.id, device_id=device_id,
            ua_summary=ua_summary, trusted=not has_any,
        ))
    db.commit()
    

@router.post("/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest, request: Request, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    # Judge the attempt BEFORE recording it, using the history so far
    result = risk.evaluate(
        db,
        email=email,
        user=user,
        device_id=payload.device_id,
        country=privacy.get_country(request),
        ip_prefix=privacy.truncate_ip(privacy.get_client_ip(request)),
        hour=privacy.get_hour(request),
    )

    def log(success, reason=None):
        record_login_event(
            db, request,
            email_attempted=email,
            success=success,
            user_id=user.id if user else None,
            device_id=payload.device_id,
            failure_reason=reason,
            risk_score=result.score,
            decision=result.decision,
            reasons_json=result.reasons_json(),
        )

    # Temporary cooldown after repeated failures: password isn't even checked.
    # Same response for real and non-existent accounts.
    if result.decision == "restrict":
        log(False, "restricted")
        raise HTTPException(
            status_code=429,
            detail="Too many failed attempts. Please try again later.",
            headers={"Retry-After": str(risk.FAILURE_WINDOW_MINUTES * 60)},
        )

    if user:
        valid = security.verify_password(payload.password, user.password_hash)
    else:
        security.verify_password(payload.password, security.DUMMY_HASH)
        valid = False

    if not valid:
        log(False, "wrong_password" if user else "unknown_email")
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    log(True)
    update_known_device(
        db, user, payload.device_id,
        privacy.summarize_ua(request.headers.get("user-agent")),
    )

    # Shadow mode: step_up is scored and reported but not yet enforced
    return {
        "access_token": security.create_access_token(user.id),
        "user": user,
        "risk": {
            "score": result.score,
            "decision": result.decision,
            "reasons": result.reasons,
            "enforced": risk.ENFORCE_STEP_UP,
        },
    }


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(security.get_current_user)):
    return current_user


@router.post("/logout")
def logout(current_user: models.User = Depends(security.get_current_user)):
    # JWTs are stateless: the client deletes the token. Endpoint exists for the API contract.
    return {"message": "Logged out"}