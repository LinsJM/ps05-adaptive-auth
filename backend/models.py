from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=utcnow)


class LoginEvent(Base):
    __tablename__ = "login_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null if email doesn't exist
    email_attempted = Column(String, nullable=False)
    ip_address = Column(String)
    user_agent = Column(String)
    device_id = Column(String)
    country = Column(String)
    city = Column(String)
    success = Column(Boolean, nullable=False)
    failure_reason = Column(String)
    risk_score = Column(Integer)      # filled on Day 2
    decision = Column(String)         # allow / step_up / block, Day 2
    reasons_json = Column(Text)       # Day 2
    created_at = Column(DateTime, default=utcnow, index=True)


class KnownDevice(Base):
    __tablename__ = "known_devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_id = Column(String, nullable=False)
    user_agent = Column(String)
    first_seen_at = Column(DateTime, default=utcnow)
    last_seen_at = Column(DateTime, default=utcnow)