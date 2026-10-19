from datetime import datetime, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import models
import risk
from database import Base

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
db = sessionmaker(bind=engine)()

NOW = datetime(2026, 10, 18, 10, 0)

# An established user: 6 past logins from India, around 9-11 UTC, one trusted device
user = models.User(email="a@x.com", password_hash="x")
db.add(user)
db.commit()
for i in range(1, 7):
    db.add(models.LoginEvent(
        user_id=user.id, email_attempted="a@x.com", success=True,
        country="IN", device_id="dev-home", ip_prefix="203.0.113.0/24",
        created_at=(NOW - timedelta(days=i)).replace(hour=9 + i % 3),
    ))
db.add(models.KnownDevice(user_id=user.id, device_id="dev-home", trusted=True))

# A brand-new user with no history
newbie = models.User(email="b@x.com", password_hash="x")
db.add(newbie)
db.commit()


def check(name, who, email, expected_score, expected_decision, **ctx):
    r = risk.evaluate(db, email=email, user=who, now=NOW, ip_prefix=None, **ctx)
    ok = r.score == expected_score and r.decision == expected_decision
    print(f"{'PASS' if ok else 'FAIL'}  {name:<38} score={r.score:<3} decision={r.decision:<8} action={r.action}")
    for reason in r.reasons:
        print(f"        +{reason['points']:<3} {reason['signal']}: {reason['detail']}")
    return ok


print("\n--- RUNNING BASELINE TESTS ---")
check("1. Familiar login", user, "a@x.com", 0, "allow",
      device_id="dev-home", country="IN", hour=10)
check("2. First-time device", user, "a@x.com", 35, "step_up",
      device_id="dev-new", country="IN", hour=10)
check("3. Legitimate travel (known device)", user, "a@x.com", 25, "allow",
      device_id="dev-home", country="US", hour=10)
check("4. Possible account takeover", user, "a@x.com", 85, "step_up",
      device_id="dev-new", country="RU", hour=3)
check("5. Brand-new account (cold start)", newbie, "b@x.com", 0, "allow",
      device_id="dev-x", country="IN", hour=3)

# Repeated failures: 5 wrong passwords in the last few minutes
for m in range(1, 6):
    db.add(models.LoginEvent(
        user_id=user.id, email_attempted="a@x.com", success=False,
        failure_reason="wrong_password", created_at=NOW - timedelta(minutes=m),
    ))
db.commit()
check("6. Repeated failures", user, "a@x.com", 30, "restrict",
      device_id="dev-home", country="IN", hour=10)

print("\n--- RUNNING PS05 ENHANCED TESTS ---")
# 7. Honeytoken: backup_admin scores 100, restricts, and auto-flags IP
check("7. Honeytoken backup_admin trap", None, "backup_admin", 100, "restrict",
      ip_address="198.51.100.99")

# Verify IP was automatically added to FlaggedIP table
flagged = db.query(models.FlaggedIP).filter(models.FlaggedIP.ip_address == "198.51.100.99").first()
print(f"       [VERIFIED] Honeytoken source IP flagged in database: {flagged is not None}")

# 8. Cross-App correlation: Attack on Bank raises risk on Social
db.add(models.LoginEvent(
    app_id="bank",
    user_id=user.id,
    email_attempted="a@x.com",
    country="RU",
    risk_score=85,
    decision="restrict",
    success=False,
    created_at=NOW - timedelta(minutes=3),
))
db.commit()
check("8. Cross-App threat (Bank -> Social)", user, "a@x.com", 35, "step_up",
      app_id="social", device_id="dev-home", country="IN", hour=10)

# 9. Tor / VPN Detection
check("9. Tor / VPN Proxy flag (+25)", user, "a@x.com", 25, "allow",
      device_id="dev-home", country="IN", hour=10, is_vpn=True)

print("\n--- ALL TEST SUITES COMPLETE ---\n")