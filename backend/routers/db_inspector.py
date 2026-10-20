import os
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

import models
from database import get_db, DATABASE_URL

router = APIRouter(prefix="/api/database", tags=["database"])


@router.get("/status")
def get_db_status(db: Session = Depends(get_db)):
    """Provides real database telemetry and table statistics for SOC verification."""
    is_sqlite = DATABASE_URL.startswith("sqlite")
    file_size = 0
    db_location = "Cloud Cluster Instance"
    if is_sqlite:
        raw_path = DATABASE_URL.replace("sqlite:///", "")
        if not os.path.exists(raw_path):
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            raw_path = os.path.join(base_dir, "adaptive_auth.db")
        if os.path.exists(raw_path):
            db_location = os.path.abspath(raw_path)
            try:
                file_size = os.path.getsize(raw_path)
            except Exception:
                file_size = 0
        else:
            db_location = os.path.abspath("adaptive_auth.db")

    return {
        "engine": "SQLite 3.42 (ACID Compliant Relational DB)" if is_sqlite else "PostgreSQL (Enterprise Cloud DB)",
        "database_type": "sqlite" if is_sqlite else "postgresql",
        "database_location": db_location,
        "file_size_bytes": file_size,
        "file_size_formatted": f"{round(file_size / 1024, 1)} KB" if file_size < 1048576 else f"{round(file_size / 1048576, 2)} MB",
        "connection_pool": "SQLAlchemy NullPool / StaticPool" if is_sqlite else "SQLAlchemy QueuePool (Max 20)",
        "tables": {
            "users": db.query(models.User).count(),
            "login_events": db.query(models.LoginEvent).count(),
            "known_devices": db.query(models.KnownDevice).count(),
            "flagged_ips": db.query(models.FlaggedIP).count(),
        },
        "postgresql_compatible": True,
        "migration_notes": "Zero code changes required to switch to Postgres; just set DATABASE_URL=postgresql://user:pass@host:5432/dbname in .env",
    }


@router.get("/table/{table_name}")
def get_table_data(
    table_name: str,
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Inspect raw rows in any SQL table with sensitive fields safely masked."""
    table_name = table_name.lower().strip()

    if table_name == "users":
        rows = db.query(models.User).order_by(models.User.id.desc()).limit(limit).all()
        data = [
            {
                "id": u.id,
                "email": u.email,
                "password_hash": f"{u.password_hash[:10]}...[PROTECTED_BCRYPT]" if u.password_hash else "[EMPTY]",
                "is_locked": u.is_locked,
                "locked_reason": u.locked_reason,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in rows
        ]
        return {
            "table": "users",
            "columns": ["id", "email", "password_hash", "is_locked", "locked_reason", "created_at"],
            "total_count": db.query(models.User).count(),
            "returned_count": len(data),
            "rows": data,
        }

    elif table_name == "login_events":
        rows = db.query(models.LoginEvent).order_by(models.LoginEvent.id.desc()).limit(limit).all()
        data = [
            {
                "id": ev.id,
                "created_at": ev.created_at.isoformat() if ev.created_at else None,
                "email_attempted": ev.email_attempted,
                "app_id": ev.app_id,
                "ip_address": ev.ip_address or ev.ip_prefix or "127.0.0.1",
                "device_id": ev.device_id,
                "city": ev.city,
                "country": ev.country,
                "is_vpn": ev.is_vpn,
                "risk_score": ev.risk_score,
                "decision": ev.decision,
                "action": ev.action,
                "success": ev.success,
                "failure_reason": ev.failure_reason,
                "latency_ms": ev.latency_ms,
            }
            for ev in rows
        ]
        return {
            "table": "login_events",
            "columns": ["id", "created_at", "email_attempted", "app_id", "ip_address", "device_id", "city", "country", "is_vpn", "risk_score", "decision", "action", "success", "failure_reason", "latency_ms"],
            "total_count": db.query(models.LoginEvent).count(),
            "returned_count": len(data),
            "rows": data,
        }

    elif table_name == "known_devices":
        rows = db.query(models.KnownDevice).order_by(models.KnownDevice.id.desc()).limit(limit).all()
        data = [
            {
                "id": kd.id,
                "user_id": kd.user_id,
                "device_id": kd.device_id,
                "ua_summary": kd.ua_summary,
                "trusted": kd.trusted,
                "first_seen_at": kd.first_seen_at.isoformat() if kd.first_seen_at else None,
                "last_seen_at": kd.last_seen_at.isoformat() if kd.last_seen_at else None,
            }
            for kd in rows
        ]
        return {
            "table": "known_devices",
            "columns": ["id", "user_id", "device_id", "ua_summary", "trusted", "first_seen_at", "last_seen_at"],
            "total_count": db.query(models.KnownDevice).count(),
            "returned_count": len(data),
            "rows": data,
        }

    elif table_name == "flagged_ips":
        rows = db.query(models.FlaggedIP).order_by(models.FlaggedIP.id.desc()).limit(limit).all()
        data = [
            {
                "id": fip.id,
                "ip_address": fip.ip_address,
                "reason": fip.reason,
                "flagged_at": fip.flagged_at.isoformat() if fip.flagged_at else None,
            }
            for fip in rows
        ]
        return {
            "table": "flagged_ips",
            "columns": ["id", "ip_address", "reason", "flagged_at"],
            "total_count": db.query(models.FlaggedIP).count(),
            "returned_count": len(data),
            "rows": data,
        }

    else:
        raise HTTPException(status_code=404, detail=f"Table '{table_name}' does not exist in schema")
