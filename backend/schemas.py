from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from typing import Optional
from typing import List, Optional


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RegisterResponse(BaseModel):
    message: str
    user_id: int

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_id: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class RiskInfo(BaseModel):
    score: int
    decision: str
    reasons: List[dict]
    enforced: bool


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
    risk: RiskInfo


class LoginEventOut(BaseModel):
    id: int
    email_attempted: str
    ip_prefix: Optional[str] = None
    ua_summary: Optional[str] = None
    device_id: Optional[str] = None
    country: Optional[str] = None
    success: bool
    failure_reason: Optional[str] = None
    risk_score: Optional[int] = None
    decision: Optional[str] = None
    reasons_json: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)