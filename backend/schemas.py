from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List, Any


class RegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=6, max_length=128)
    device_id: Optional[str] = None
    country: Optional[str] = "IN"


class RegisterResponse(BaseModel):
    message: str
    user_id: int


class LoginRequest(BaseModel):
    email: str
    password: str
    device_id: Optional[str] = None
    app_id: Optional[str] = "bank"
    ip_address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    is_vpn: Optional[bool] = False
    hour: Optional[int] = None
    minutes_since_last_login: Optional[int] = None


class UserOut(BaseModel):
    id: int
    email: str

    model_config = ConfigDict(from_attributes=True)


class LoginReasonItem(BaseModel):
    signal: str
    points: int
    detail: str


class LoginResponse(BaseModel):
    access_token: Optional[str] = None
    token_type: str = "bearer"
    user: Optional[UserOut] = None
    success: Optional[bool] = True
    score: Optional[int] = 0
    decision: Optional[str] = "allow"
    action: Optional[str] = "allow"
    reasons: Optional[List[Any]] = None
    requires_step_up: Optional[bool] = False
    step_up_type: Optional[str] = None
    prompt_details: Optional[Any] = None
    message: Optional[str] = "Authentication successful"
    latency_ms: Optional[float] = 0.0
    app_id: Optional[str] = "bank"


class StepUpVerifyRequest(BaseModel):
    email: str
    app_id: str = "bank"
    step_up_type: str  # 'captcha', 'email_otp', 'otp_password_reset', 'google_prompt'
    code: str
    device_id: str
    new_password: Optional[str] = None


class PromptVerifyRequest(BaseModel):
    email: str
    device_id: str
    app_id: str = "bank"
    approved: bool
    new_password: Optional[str] = None


class PasswordResetRequest(BaseModel):
    email: str
    new_password: str = Field(min_length=6, max_length=128)
    current_ip: Optional[str] = None
    reason: Optional[str] = "Compromised credential security alert"


class BlacklistIpRequest(BaseModel):
    ip_address: str
    reason: Optional[str] = "Suspicious login attempt"


class NotificationItem(BaseModel):
    id: str
    timestamp: str
    type: str  # 'new_device', 'threat_blocked', 'honeytoken_trap', 'verified'
    recipient: str
    subject: str
    app_id: str
    device: str
    location: str
    ip: str
    risk_score: int
    action: str
    reasons: List[str]
    preview_body: str



class LoginEventOut(BaseModel):
    id: int
    email_attempted: str
    ip_prefix: Optional[str] = None
    ip_address: Optional[str] = None
    ua_summary: Optional[str] = None
    device_id: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    is_vpn: Optional[bool] = False
    success: bool
    failure_reason: Optional[str] = None
    risk_score: Optional[int] = None
    decision: Optional[str] = None
    action: Optional[str] = None
    reasons_json: Optional[str] = None
    latency_ms: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardStatsResponse(BaseModel):
    total_events: int
    blocked_count: int
    challenged_count: int
    allowed_count: int
    detection_rate_pct: float
    false_positive_rate_pct: float
    average_latency_ms: float
    honeytoken_hits: int
    active_flagged_ips: int


class TargetEnrollRequest(BaseModel):
    email: str
    phone_device_name: Optional[str] = "Judge's Primary Phone (iOS/Android)"
    trusted_phone_id: Optional[str] = "judge-primary-phone"
    password: Optional[str] = "JudgePass2026!"


class TargetEnrollResponse(BaseModel):
    success: bool
    message: str
    email: str
    trusted_device_id: str
    trusted_device_name: str
    user_id: int


class SmtpConfigRequest(BaseModel):
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str
    smtp_pass: str
    smtp_from: Optional[str] = None


class TestEmailRequest(BaseModel):
    recipient: str

