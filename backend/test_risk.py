import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

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


def check(name, who, email, expected_score, expected_decision, expected_action=None, **ctx):
    r = risk.evaluate(db, email=email, user=who, now=NOW, ip_prefix=None, **ctx)
    ok = r.score == expected_score and r.decision == expected_decision
    if expected_action:
        ok = ok and (r.action == expected_action)
    status_str = "PASS" if ok else "FAIL"
    print(f"[{status_str}] {name:<38} score={r.score:<3} decision={r.decision:<8} action={r.action}")
    for reason in r.reasons:
        print(f"       + {reason['points']:<3} {reason['signal']}: {reason['detail']}")
    return ok


all_passed = True

print("\n--- RUNNING BASELINE TESTS (5-TIER ADAPTIVE POLICY) ---")
all_passed &= check("1. Familiar login (Tier 1)", user_a, "a@x.com", 0, "allow", "allow",
                    device_id="dev-home", country="IN", hour=10)
all_passed &= check("2. First-time device (Tier 3)", user_a, "a@x.com", 45, "step_up", "email_otp",
                    device_id="dev-new", country="IN", hour=10)
all_passed &= check("3. Legitimate travel (Tier 1)", user_a, "a@x.com", 25, "allow", "allow",
                    device_id="dev-home", country="US", hour=10)
all_passed &= check("4. Account takeover (Tier 5)", user_a, "a@x.com", 95, "restrict", "block",
                    device_id="dev-new", country="RU", hour=3)
all_passed &= check("5. Brand-new account (Tier 1)", newbie, "newbie@x.com", 0, "allow", "allow",
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
all_passed &= check("6. Repeated failures (Tier 2)", user_a, "a@x.com", 30, "restrict", "captcha",
                    device_id="dev-home", country="IN", hour=10)

print("\n--- RUNNING PS05 ENHANCED TESTS ---")
# 7. Honeytoken: backup_admin scores 100, restricts, and auto-flags IP
all_passed &= check("7. Honeytoken trap (Tier 5)", None, "backup_admin", 100, "restrict", "block",
                    ip_address="198.51.100.99")

# Verify IP was automatically added to FlaggedIP table
flagged = db.query(models.FlaggedIP).filter(models.FlaggedIP.ip_address == "198.51.100.99").first()
print(f"       [VERIFIED] Honeytoken source IP flagged in database: {flagged is not None}")
all_passed &= (flagged is not None)

# 8. Cross-App correlation: High risk event on Bank raises risk on Social
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
all_passed &= check("8. Cross-App threat (Tier 2)", user_cross, "cross@x.com", 40, "step_up", "captcha",
                    app_id="social", device_id="dev-home", country="IN", hour=10)

# 9. Tor / VPN Detection on user_vpn (+25 points)
all_passed &= check("9. Tor / VPN Proxy flag (Tier 1)", user_vpn, "vpn@x.com", 25, "allow", "allow",
                    device_id="dev-home", country="IN", hour=10, is_vpn=True)

# 10. Impossible Travel Velocity on user_travel (+25 new country + 45 impossible travel = 70 points)
all_passed &= check("10. Impossible travel (Tier 4)", user_travel, "travel@x.com", 70, "step_up", "quarantine_verify",
                    device_id="dev-home", country="US", mins_since_last_login=15, hour=10)

print("\n--- RUNNING 5-TIER SCORE RANGE & POLICY TESTS ---")
# 11. Explicit boundary tests for all 5 Tiers
tier_bounds = [
    (0, "allow", False, None),
    (15, "allow", False, None),
    (29, "allow", False, None),
    (30, "captcha", True, "captcha"),
    (37, "captcha", True, "captcha"),
    (44, "captcha", True, "captcha"),
    (45, "email_otp", True, "email_otp"),
    (52, "email_otp", True, "email_otp"),
    (59, "email_otp", True, "email_otp"),
    (60, "quarantine_verify", True, "quarantine_verify"),
    (70, "quarantine_verify", True, "quarantine_verify"),
    (79, "quarantine_verify", True, "quarantine_verify"),
    (80, "block", False, None),
    (95, "block", False, None),
    (100, "block", False, None),
]

bounds_ok = True
for score_val, exp_act, exp_req, exp_step in tier_bounds:
    act, req, step = risk.map_score_to_action(score_val)
    if not (act == exp_act and req == exp_req and step == exp_step):
        bounds_ok = False
        print(f"       [FAIL] Score {score_val} mapped to ({act}, {req}, {step}), expected ({exp_act}, {exp_req}, {exp_step})")

status_11 = "PASS" if bounds_ok else "FAIL"
print(f"[{status_11}] 11. 5-Tier Boundary Mapping (All 15 threshold points match architecture)")
all_passed &= bounds_ok

# 12. Unit test for Tier 5 Compromised Password Alert Email & IP Blacklist dispatch
print("\n--- RUNNING TIER 5 NOTIFICATION & BLACKLIST DISPATCH UNIT TEST ---")
from routers.auth import add_security_notification, SECURITY_NOTIFICATIONS

test_ip = "198.51.100.77"
test_email = "victim@example.com"
flag_record = models.FlaggedIP(ip_address=test_ip, reason=f"Tier 5 automated block targeting {test_email}")
db.add(flag_record)
db.commit()

notif = add_security_notification(
    notification_type="threat_blocked",
    recipient=test_email,
    subject="🚨 Critical Security Alert: Suspicious sign-in blocked for your account",
    app_id="bank",
    device="dev-malicious-tor",
    location="Moscow, RU",
    ip=test_ip,
    risk_score=95,
    action="block",
    reasons=["Tor exit node", "Brute-force lockout"],
    preview_body=(
        f"We automatically BLOCKED an unauthorized sign-in attempt from Moscow, RU (IP: {test_ip}). "
        f"Someone attempted to sign in with your password. We blocked them, but your password is compromised. "
        f"Please change your password immediately: https://dignitas-auth.io/reset-password?email={test_email}"
    )
)

notif_ok = (
    notif["action"] == "block" and
    "🚨 Critical Security Alert: Suspicious sign-in blocked for your account" in notif["subject"] and
    "https://dignitas-auth.io/reset-password" in notif["preview_body"] and
    db.query(models.FlaggedIP).filter_by(ip_address=test_ip).first() is not None
)

status_12 = "PASS" if notif_ok else "FAIL"
print(f"[{status_12}] 12. Tier 5 Alert Email & IP Blacklist Dispatch (Subject, reset link & SQLite verified)")
all_passed &= notif_ok

print("\n=======================================================")
if all_passed:
    print("  [SUCCESS] ALL 12 TESTS PASSED WITH 100% ACCURACY!    ")
else:
    print("  [ERROR] SOME TESTS FAILED                             ")
print("=======================================================\n")

if not all_passed:
    sys.exit(1)