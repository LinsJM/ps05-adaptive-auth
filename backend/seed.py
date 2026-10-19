from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
import models
import security
from database import engine, SessionLocal, Base


def _utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def seed_database(db: Session, wipe: bool = False):
    if wipe:
        db.query(models.LoginEvent).delete()
        db.query(models.KnownDevice).delete()
        db.query(models.FlaggedIP).delete()
        db.query(models.User).delete()
        db.commit()

    # Check if already seeded
    existing_user = db.query(models.User).filter(models.User.email == "alice@example.com").first()
    if existing_user and not wipe:
        return

    now = _utcnow()

    # 1. Seed Alice (Primary Demo User)
    alice = models.User(
        email="alice@example.com",
        password_hash=security.hash_password("Password123!"),
        is_locked=False,
        created_at=now - timedelta(days=14),
    )
    db.add(alice)
    db.commit()
    db.refresh(alice)

    # Alice's trusted baseline device
    alice_dev = models.KnownDevice(
        user_id=alice.id,
        device_id="dev-alice-laptop",
        ua_summary="Chrome / Windows",
        trusted=True,
        first_seen_at=now - timedelta(days=14),
        last_seen_at=now - timedelta(hours=2),
    )
    db.add(alice_dev)

    # 2. Seed Alice's Historical Baseline (6 successful logins from India, 9-11 AM UTC)
    for i in range(1, 7):
        event_time = (now - timedelta(days=i)).replace(hour=9 + (i % 3), minute=15)
        db.add(models.LoginEvent(
            app_id="bank",
            user_id=alice.id,
            email_attempted="alice@example.com",
            ip_prefix="103.21.244.0/24",
            ip_address="103.21.244.2",
            ua_summary="Chrome / Windows",
            device_id="dev-alice-laptop",
            city="Delhi",
            country="IN",
            is_vpn=False,
            risk_score=0,
            decision="allow",
            action="allow",
            reasons_json='[{"signal": "baseline_match", "points": 0, "detail": "Trusted device and familiar location"}]',
            success=True,
            latency_ms=11.2,
            created_at=event_time,
        ))

    # 3. Seed Bob (Secondary User for Cross-App & Corporate Testing)
    bob = models.User(
        email="bob@bank.com",
        password_hash=security.hash_password("Password123!"),
        is_locked=False,
        created_at=now - timedelta(days=30),
    )
    db.add(bob)
    db.commit()
    db.refresh(bob)

    db.add(models.KnownDevice(
        user_id=bob.id,
        device_id="dev-bob-mobile",
        ua_summary="Safari / iOS",
        trusted=True,
        first_seen_at=now - timedelta(days=30),
        last_seen_at=now - timedelta(hours=5),
    ))

    # 4. Seed Known Malicious / Flagged IP
    db.add(models.FlaggedIP(
        ip_address="198.51.100.42",
        reason="Known Tor exit node observed in credential stuffing campaign",
        flagged_at=now - timedelta(days=2),
    ))

    db.commit()
    print("Database successfully seeded with clean baseline users and devices.")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_database(session, wipe=True)
    finally:
        session.close()
