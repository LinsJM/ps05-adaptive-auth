from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

import models
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


@router.post("/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest, request: Request, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        valid = security.verify_password(payload.password, user.password_hash)
    else:
        security.verify_password(payload.password, security.DUMMY_HASH)
        valid = False

    if not valid:
        record_login_event(
            db, request,
            email_attempted=email,
            success=False,
            user_id=user.id if user else None,
            device_id=payload.device_id,
            failure_reason="wrong_password" if user else "unknown_email",
        )
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    record_login_event(
        db, request,
        email_attempted=email,
        success=True,
        user_id=user.id,
        device_id=payload.device_id,
    )
    return {"access_token": security.create_access_token(user.id), "user": user}


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(security.get_current_user)):
    return current_user


@router.post("/logout")
def logout(current_user: models.User = Depends(security.get_current_user)):
    # JWTs are stateless: the client deletes the token. Endpoint exists for the API contract.
    return {"message": "Logged out"}