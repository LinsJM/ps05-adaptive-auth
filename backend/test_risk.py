import sys
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


def create_user_with_history(email):
    u = models.User(email=email, password_hash="x")
    db.add(u)
    db.commit()
    for i in range(1, 7):
        db.add(models.LoginEvent(
            app_id="bank",
            user_id=u.id,
            email_attempted=email,
            success=True,
            country="IN",
            device_id="dev-home",
            ip_prefix="203.0.113.0/24",
            created_at=(NOW - timedelta(days=i)).replace(hour=9 + i % 3),
        ))
    db.add(models.KnownDevice(user_id=u.id, device_id="dev-home", trusted=True))
    db.commit()
    return u


user_a = create_user_with_history("a@x.com")
newbie = models.User(email="newbie@x.com", password_hash="x")
db.add(newbie)
db.commit()

user_cross = create_user_with_history("cross@x.com")
user_vpn = create_user_with_history("vpn@x.com")
user_travel = create_user_with_history("travel@x.com")


def check(name, who, email, expected_score, expected_decision, **ctx):
    r = risk.evaluate(db, email=email, user=who, now=NOW, ip_prefix=None, **ctx)
    ok = r.score == expected_score and r.decision == expected_decision
    status_str = "PASS" if ok else "FAIL"
    print(f"[{status_str}] {name:<38} score={r.score:<3} decision={r.decision:<8} action={r.action}")
    for reason in r.reasons:
        print(f"       + {reason['points']:<3} {reason['signal']}: {reason['detail']}")
    return ok


all_passed = True

print("\n--- RUNNING BASELINE TESTS ---")
all_passed &= check("1. Familiar login", user_a, "a@x.com", 0, "allow",
                    device_id="dev-home", country="IN", hour=10)
all_passed &= check("2. First-time device", user_a, "a@x.com", 35, "step_up",
                    device_id="dev-new", country="IN", hour=10)
all_passed &= check("3. Legitimate travel (known device)", user_a, "a@x.com", 25, "allow",
                    device_id="dev-home", country="US", hour=10)
all_passed &= check("4. Possible account takeover", user_a, "a@x.com", 85, "step_up",
                    device_id="dev-new", country="RU", hour=3)
all_passed &= check("5. Brand-new account (cold start)", newbie, "newbie@x.com", 0, "allow",
                    device_id="dev-x", country="IN", hour=3)

# Repeated failures: 5 wrong passwords in the last few minutes on user_a
for m in range(1, 6):
    db.add(models.LoginEvent(
        app_id="bank",
        user_id=user_a.id,
        email_attempted="a@x.com",
        success=False,
        failure_reason="wrong_password",
        created_at=NOW - timedelta(minutes=m),
    ))
db.commit()
all_passed &= check("6. Repeated failures", user_a, "a@x.com", 30, "restrict",
                    device_id="dev-home", country="IN", hour=10)

print("\n--- RUNNING PS05 ENHANCED TESTS ---")
# 7. Honeytoken: backup_admin scores 100, restricts, and auto-flags IP
all_passed &= check("7. Honeytoken backup_admin trap", None, "backup_admin", 100, "restrict",
                    ip_address="198.51.100.99")

# Verify IP was automatically added to FlaggedIP table
flagged = db.query(models.FlaggedIP).filter(models.FlaggedIP.ip_address == "198.51.100.99").first()
print(f"       [VERIFIED] Honeytoken source IP flagged in database: {flagged is not None}")

# 8. Cross-App correlation: High risk event on Bank raises risk on Social
# User cross had a high risk attack on bank (which is 1 failure +5 and cross_app +35 = 40)
db.add(models.LoginEvent(
    app_id="bank",
    user_id=user_cross.id,
    email_attempted="cross@x.com",
    country="RU",
    risk_score=85,
    decision="restrict",
    success=False,
    created_at=NOW - timedelta(minutes=3),
))
db.commit()
all_passed &= check("8. Cross-App threat (Bank -> Social)", user_cross, "cross@x.com", 40, "step_up",
                    app_id="social", device_id="dev-home", country="IN", hour=10)

# 9. Tor / VPN Detection on user_vpn (+25 points)
all_passed &= check("9. Tor / VPN Proxy flag (+25)", user_vpn, "vpn@x.com", 25, "allow",
                    device_id="dev-home", country="IN", hour=10, is_vpn=True)

# 10. Impossible Travel Velocity on user_travel (+25 new country + 45 impossible travel = 70 points)
all_passed &= check("10. Impossible travel velocity (70)", user_travel, "travel@x.com", 70, "step_up",
                    device_id="dev-home", country="US", mins_since_last_login=15, hour=10)

print("\n=======================================================")
if all_passed:
    print("  [SUCCESS] ALL 10 TESTS PASSED WITH 100% ACCURACY!    ")
else:
    print("  [ERROR] SOME TESTS FAILED                             ")
print("=======================================================\n")

if not all_passed:
    sys.exit(1)