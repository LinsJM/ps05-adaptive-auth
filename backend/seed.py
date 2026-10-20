import json
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
import models
import security
from database import engine, SessionLocal, Base


def _utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def seed_database(db: Session, wipe: bool = False):
    """
    Seeds the SQLite database with 35+ realistic enterprise & personal user accounts,
    associated known devices, realistic historical login event audit trails,
    and threat intelligence flagged IP records.
    """
    if wipe:
        db.query(models.LoginEvent).delete()
        db.query(models.KnownDevice).delete()
        db.query(models.FlaggedIP).delete()
        db.query(models.User).delete()
        db.commit()

    # Re-seed if fewer than 15 users exist
    current_user_count = db.query(models.User).count()
    if current_user_count >= 15 and not wipe:
        return

    # If already partially seeded with old minimal seed, wipe to replace cleanly
    if current_user_count > 0 and not wipe:
        db.query(models.LoginEvent).delete()
        db.query(models.KnownDevice).delete()
        db.query(models.FlaggedIP).delete()
        db.query(models.User).delete()
        db.commit()

    now = _utcnow()
    # Compute password hash once for maximum seeding performance
    default_pw_hash = security.hash_password("Password123!")

    # =========================================================================
    # 1. CORE DEMO USERS (Must exist for automated tests and live scenarios)
    # =========================================================================
    core_users_data = [
        # (email, is_locked, primary_city, primary_country, ip_prefix, device_id, ua)
        ("alice@example.com", False, "Delhi", "IN", "103.21.244.0/24", "dev-alice-laptop", "Chrome / Windows 11"),
        ("bob@bank.com", False, "Mumbai", "IN", "103.25.172.0/24", "dev-bob-mobile", "Safari / iOS 17.4"),
    ]

    # =========================================================================
    # 2. EXTENSIVE REALISTIC USER DIRECTORY (35+ Accounts)
    # =========================================================================
    extended_users_data = [
        # --- Corporate Financial & Banking Users (Apex Bank) ---
        ("carol.smith@apexbank.com", False, "London", "GB", "82.165.197.0/24", "dev-carol-macbook", "Safari / macOS Sonoma"),
        ("david.kumar@apexcapital.in", False, "Mumbai", "IN", "115.114.88.0/24", "dev-david-thinkpad", "Edge / Windows 11"),
        ("elena.rostova@globalfin.ch", False, "Zurich", "CH", "178.209.48.0/24", "dev-elena-dell", "Chrome / Windows 11"),
        ("frank.miller@wallstreet-advisory.com", False, "New York", "US", "64.233.160.0/24", "dev-frank-macbook", "Chrome / macOS Sonoma"),
        ("priya.sharma@hdfc-gateway.in", False, "Bengaluru", "IN", "182.72.68.0/24", "dev-priya-pixel", "Chrome / Android 14"),
        ("vikram.mehta@mumbaicapital.com", False, "Mumbai", "IN", "122.170.12.0/24", "dev-vikram-xps", "Chrome / Windows 11"),
        ("sara.connor@cyberdyne-sec.com", False, "San Francisco", "US", "199.16.156.0/24", "dev-sara-thinkpad", "Firefox / Linux Ubuntu"),
        ("alex.chen@singaporefintech.sg", False, "Singapore", "SG", "103.28.248.0/24", "dev-alex-macbook", "Safari / macOS Sonoma"),
        ("mohammed.almansoor@emiratesbank.ae", False, "Dubai", "AE", "94.200.12.0/24", "dev-mohammed-iphone", "Safari / iOS 17.5"),
        ("rachel.green@apexretail.com", False, "Chicago", "US", "12.186.200.0/24", "dev-rachel-macbook", "Chrome / macOS Sonoma"),
        ("johan.lindqvist@nordictrade.se", False, "Stockholm", "SE", "85.24.160.0/24", "dev-johan-thinkpad", "Edge / Windows 11"),
        ("ananya.deshmukh@hyderabadtech.in", False, "Hyderabad", "IN", "14.141.173.0/24", "dev-ananya-galaxy", "Chrome / Android 14"),
        ("tariq.aziz@qatarfin.qa", False, "Doha", "QA", "89.211.0.0/24", "dev-tariq-ipad", "Safari / iPadOS 17"),
        ("mateo.silva@saopauloinvest.br", False, "Sao Paulo", "BR", "177.136.250.0/24", "dev-mateo-dell", "Chrome / Windows 11"),
        ("liam.o.connor@dublindata.ie", False, "Dublin", "IE", "89.100.32.0/24", "dev-liam-macbook", "Safari / macOS Sonoma"),
        ("natalia.kovacs@budapestfin.hu", False, "Budapest", "HU", "195.228.0.0/24", "dev-natalia-thinkpad", "Firefox / Windows 11"),

        # --- Social, Media & Creator Users (Pulse Social) ---
        ("marcus.vance@pulsenet.io", False, "Austin", "US", "66.249.64.0/24", "dev-marcus-pixel", "Chrome / Android 14"),
        ("sophia.rodriguez@creatorshub.net", False, "Madrid", "ES", "213.0.0.0/24", "dev-sophia-iphone", "Safari / iOS 17"),
        ("chloe.bennett@streamwave.tv", False, "Toronto", "CA", "142.250.0.0/24", "dev-chloe-macbook", "Chrome / macOS Sonoma"),
        ("hassan.raza@techblog.co", False, "London", "GB", "80.0.0.0/24", "dev-hassan-dell", "Edge / Windows 11"),
        ("lucas.dubois@parismedia.fr", False, "Paris", "FR", "195.154.0.0/24", "dev-lucas-macbook", "Safari / macOS Sonoma"),
        ("emma.watson@oxfordalumni.org.uk", False, "Oxford", "GB", "163.1.0.0/24", "dev-emma-ipad", "Safari / iPadOS 17"),
        ("kenji.sato@tokyodigital.jp", False, "Tokyo", "JP", "133.242.0.0/24", "dev-kenji-thinkpad", "Chrome / Linux Ubuntu"),
        ("olivia.brown@melbournestudio.au", False, "Melbourne", "AU", "139.130.0.0/24", "dev-olivia-macbook", "Safari / macOS Sonoma"),
        ("arjun.nambiar@kochicreative.in", False, "Kochi", "IN", "117.200.0.0/24", "dev-arjun-galaxy", "Chrome / Android 14"),
        ("fatima.zahra@casablancamedia.ma", False, "Casablanca", "MA", "105.154.0.0/24", "dev-fatima-iphone", "Safari / iOS 17"),

        # --- Infrastructure, Executive & SOC Analysts ---
        ("devops-lead@infrastructure.internal", False, "Frankfurt", "DE", "80.150.0.0/24", "dev-devops-workstation", "Chrome / Linux Fedora"),
        ("security-operations@sentinel-defense.org", False, "Amsterdam", "NL", "82.94.0.0/24", "dev-soc-terminal", "Firefox / Linux Debian"),
        ("audit-team@compliance-cloud.net", False, "New York", "US", "74.125.0.0/24", "dev-audit-laptop", "Edge / Windows 11"),
        ("ceo-office@enterprise-global.com", False, "London", "GB", "51.140.0.0/24", "dev-ceo-iphone", "Safari / iOS 17.5"),
        ("ciso@apexbank.com", False, "New York", "US", "108.160.0.0/24", "dev-ciso-macbook", "Safari / macOS Sonoma"),
        ("judge@hackathon.com", False, "Delhi", "IN", "103.21.244.0/24", "judge-primary-phone", "Safari / iOS 17.5 (iPhone 15 Pro)"),

        # --- Targeted Accounts & Decoys ---
        ("backup_admin", False, "Unknown", "XX", "0.0.0.0/0", "dev-scanner-agent", "Go-http-client/1.1"),
        ("contractor-finance2026@temp.org", True, "Moscow", "RU", "194.26.29.0/24", "dev-unauthorized-tor", "Python-requests/2.31"),
    ]

    all_users_meta = core_users_data + extended_users_data

    # Map for easy lookup during event seeding
    seeded_users = {}

    for email, is_locked, city, country, prefix, dev_id, ua in all_users_meta:
        user = models.User(
            email=email.strip().lower(),
            password_hash=default_pw_hash,
            is_locked=is_locked,
            locked_reason="Compromised account lock" if is_locked else None,
            created_at=now - timedelta(days=random.randint(14, 90)),
        )
        db.add(user)
        db.flush()  # Populates user.id
        seeded_users[email.strip().lower()] = (user, city, country, prefix, dev_id, ua)

        # Register primary trusted device for legitimate users
        if not email.startswith("backup_") and not email.startswith("contractor-"):
            db.add(models.KnownDevice(
                user_id=user.id,
                device_id=dev_id,
                ua_summary=ua,
                trusted=True,
                first_seen_at=now - timedelta(days=random.randint(10, 60)),
                last_seen_at=now - timedelta(hours=random.randint(1, 48)),
            ))

    # =========================================================================
    # 3. REALISTIC HISTORICAL LOGIN EVENTS (120+ Events across 14 Days)
    # =========================================================================
    apps = ["bank", "social"]

    # A. Seed Alice's Baseline History (Crucial for Baseline Tests & Demo Scenario 1)
    alice_user, a_city, a_country, a_prefix, a_dev, a_ua = seeded_users["alice@example.com"]
    for i in range(1, 10):
        event_time = (now - timedelta(days=i)).replace(hour=9 + (i % 3), minute=random.randint(10, 45))
        db.add(models.LoginEvent(
            app_id="bank",
            user_id=alice_user.id,
            email_attempted="alice@example.com",
            ip_prefix=a_prefix,
            ip_address=f"103.21.244.{10 + i}",
            ua_summary=a_ua,
            device_id=a_dev,
            city="Delhi",
            country="IN",
            is_vpn=False,
            risk_score=0,
            decision="allow",
            action="allow",
            reasons_json='[{"signal": "baseline_match", "points": 0, "detail": "Trusted device and familiar location"}]',
            success=True,
            latency_ms=round(random.uniform(4.2, 9.8), 2),
            created_at=event_time,
        ))

    # B. Seed Bob's Baseline History (Crucial for Cross-App & Impossible Travel)
    bob_user, b_city, b_country, b_prefix, b_dev, b_ua = seeded_users["bob@bank.com"]
    for i in range(1, 8):
        event_time = (now - timedelta(days=i)).replace(hour=10 + (i % 4), minute=random.randint(5, 55))
        db.add(models.LoginEvent(
            app_id="bank" if i % 2 == 0 else "social",
            user_id=bob_user.id,
            email_attempted="bob@bank.com",
            ip_prefix=b_prefix,
            ip_address=f"103.25.172.{20 + i}",
            ua_summary=b_ua,
            device_id=b_dev,
            city="Mumbai",
            country="IN",
            is_vpn=False,
            risk_score=0,
            decision="allow",
            action="allow",
            reasons_json='[{"signal": "baseline_match", "points": 0, "detail": "Known hardware signature verified"}]',
            success=True,
            latency_ms=round(random.uniform(4.5, 8.5), 2),
            created_at=event_time,
        ))

    # C. Seed Extended Global Corporate Traffic (100+ Realistic Normal & Challenge Events)
    for email, (user, city, country, prefix, dev_id, ua) in seeded_users.items():
        if email in ["alice@example.com", "bob@bank.com", "backup_admin", "contractor-finance2026@temp.org"]:
            continue

        # 3 to 6 events per user across the last 14 days
        num_events = random.randint(3, 6)
        for j in range(num_events):
            days_ago = random.randint(0, 13)
            hour_of_day = random.randint(8, 20)
            event_time = (now - timedelta(days=days_ago)).replace(hour=hour_of_day, minute=random.randint(0, 59))
            chosen_app = "bank" if "bank" in email or "fin" in email or "capital" in email else "social"

            # 90% Clean Allows, 6% Contextual Step-up, 4% Anomaly/CAPTCHA
            rand_roll = random.random()
            if rand_roll < 0.88:
                score = 0
                decision = "allow"
                action = "allow"
                reasons = [{"signal": "baseline_match", "points": 0, "detail": f"Familiar {city}, {country} corporate IP"}]
                success = True
                fail_reason = None
            elif rand_roll < 0.95:
                # Tier 3: First-time hardware OTP
                score = 45
                decision = "step_up"
                action = "email_otp"
                reasons = [{"signal": "new_device", "points": 45, "detail": "Hardware fingerprint not previously seen"}]
                success = True
                fail_reason = None
            else:
                # Tier 2: Turnstile CAPTCHA due to password typo
                score = 30
                decision = "restrict"
                action = "captcha"
                reasons = [{"signal": "repeated_failures", "points": 30, "detail": "2 rapid password retries within 5m"}]
                success = False
                fail_reason = "Turnstile CAPTCHA required after retry"

            db.add(models.LoginEvent(
                app_id=chosen_app,
                user_id=user.id,
                email_attempted=email,
                ip_prefix=prefix,
                ip_address=f"{prefix.split('/')[0][:-1]}{random.randint(2, 250)}",
                ua_summary=ua,
                device_id=dev_id,
                city=city,
                country=country,
                is_vpn=False,
                risk_score=score,
                decision=decision,
                action=action,
                reasons_json=json.dumps(reasons),
                success=success,
                failure_reason=fail_reason,
                latency_ms=round(random.uniform(4.0, 14.5), 2),
                created_at=event_time,
            ))

    # D. Seed Realistic Flagged Security Incidents for SOC Ledger
    # Incident 1: Honeytoken Attack (backup_admin)
    db.add(models.LoginEvent(
        app_id="bank",
        user_id=seeded_users["backup_admin"][0].id,
        email_attempted="backup_admin",
        ip_prefix="45.154.255.0/24",
        ip_address="45.154.255.88",
        ua_summary="Python-requests / Linux",
        device_id="dev-scanner-botnet",
        city="Amsterdam",
        country="NL",
        is_vpn=True,
        risk_score=100,
        decision="restrict",
        action="block",
        reasons_json=json.dumps([
            {"signal": "honeytoken", "points": 100, "detail": "Honeytoken account 'backup_admin' targeted by automated scanner. Source IP blacklisted."}
        ]),
        success=False,
        failure_reason="Honeytoken trap triggered. Access blocked.",
        latency_ms=6.8,
        created_at=now - timedelta(hours=4, minutes=12),
    ))

    # Incident 2: Credential Stuffing Attack on Carol Smith via Tor
    db.add(models.LoginEvent(
        app_id="bank",
        user_id=seeded_users["carol.smith@apexbank.com"][0].id,
        email_attempted="carol.smith@apexbank.com",
        ip_prefix="185.220.101.0/24",
        ip_address="185.220.101.5",
        ua_summary="Firefox / Tor Browser",
        device_id="dev-unknown-tor-node",
        city="Frankfurt",
        country="DE",
        is_vpn=True,
        risk_score=95,
        decision="restrict",
        action="block",
        reasons_json=json.dumps([
            {"signal": "new_device", "points": 45, "detail": "Device has not been verified for this account"},
            {"signal": "vpn_tor_proxy", "points": 25, "detail": "Traffic routed through anonymizing Tor exit relay"},
            {"signal": "unusual_hour", "points": 10, "detail": "Login attempt at 03:22 UTC outside regular working hours"},
            {"signal": "abrupt_change", "points": 15, "detail": "Unrecognized hardware and anonymous proxy combination"}
        ]),
        success=False,
        failure_reason="High-risk anomaly detected. Account takeover prevented.",
        latency_ms=7.1,
        created_at=now - timedelta(hours=8, minutes=45),
    ))

    # Incident 3: Impossible Velocity Travel on David Kumar (Mumbai -> New York in 20 mins)
    db.add(models.LoginEvent(
        app_id="bank",
        user_id=seeded_users["david.kumar@apexcapital.in"][0].id,
        email_attempted="david.kumar@apexcapital.in",
        ip_prefix="162.243.0.0/24",
        ip_address="162.243.14.92",
        ua_summary="Chrome / Windows 11",
        device_id="dev-unrecognized-ny",
        city="New York",
        country="US",
        is_vpn=False,
        risk_score=70,
        decision="step_up",
        action="quarantine_verify",
        reasons_json=json.dumps([
            {"signal": "new_country", "points": 25, "detail": "Login from US; earlier successful logins were from IN"},
            {"signal": "impossible_travel", "points": 45, "detail": "Impossible travel: Jump from Mumbai, IN to New York, US in 20 mins"}
        ]),
        success=False,
        failure_reason="Session isolated in security quarantine.",
        latency_ms=5.4,
        created_at=now - timedelta(hours=14, minutes=30),
    ))

    # =========================================================================
    # 4. THREAT INTELLIGENCE: FLAGGED MALICIOUS IPs
    # =========================================================================
    threat_ips = [
        ("198.51.100.42", "Known Tor exit node observed in credential stuffing campaign", 2),
        ("185.220.101.5", "Active Tor exit relay indexed in Tor Project Directory", 1),
        ("45.154.255.88", "Bulletproof hosting provider used in automated scanner attacks", 3),
        ("194.26.29.112", "Commercial VPN node associated with repeated brute-force dictionaries", 5),
        ("103.145.13.20", "Compromised residential proxy network used in credential stuffing", 7),
        ("89.248.165.74", "Known automated vulnerability scanner probing admin interfaces", 4),
    ]

    for ip_addr, reason, days_ago in threat_ips:
        db.add(models.FlaggedIP(
            ip_address=ip_addr,
            reason=reason,
            flagged_at=now - timedelta(days=days_ago),
        ))

    db.commit()
    print(f"Database successfully seeded with {len(all_users_meta)} users, devices, and full SOC history.")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_database(session, wipe=True)
    finally:
        session.close()
