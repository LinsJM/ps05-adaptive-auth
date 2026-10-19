import os
from dotenv import load_dotenv
from pwdlib import PasswordHash

from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

import models
from database import get_db

import hashlib
import hmac
import secrets

load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is missing. Check backend/.env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# recommended() uses Argon2 because you installed pwdlib[argon2]
password_hasher = PasswordHash.recommended()

# Verified against when the email doesn't exist, so timing doesn't reveal valid emails
DUMMY_HASH = password_hasher.hash("dummy-password-for-timing")

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(plain_password: str) -> str:
    return password_hasher.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hasher.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    unauthorized = HTTPException(
        status_code=401,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],          # fixed, never taken from the token
            options={"require": ["exp", "sub"]},
        )
        user_id = int(payload["sub"])
    except (jwt.InvalidTokenError, ValueError):
        raise unauthorized

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise unauthorized
    return user


def generate_otp() -> str:
    return f"{secrets.randbelow(10**6):06d}"


def hash_otp(code: str) -> str:
    return hmac.new(SECRET_KEY.encode(), code.encode(), hashlib.sha256).hexdigest()


def verify_otp(code: str, code_hash: str) -> bool:
    return hmac.compare_digest(hash_otp(code), code_hash)