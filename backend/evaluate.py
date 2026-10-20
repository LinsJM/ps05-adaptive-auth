import random
from collections import defaultdict
from datetime import datetime, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import models
import risk
from database import Base

random.seed(42)  # same numbers every run

# Throwaway in-memory database: your real database is never touched
engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
db = sessionmaker(bind=engine)()

NOW = datetime(2026, 10, 18, 12, 0)
COUNTRIES = ["IN", "US", "GB", "DE", "SG", "AU"]
N_LEGIT = 1000
N_ATTACK = 400
ATTACK_RATE = 0.01          # assumed share of real-world logins that are attacks
THRESHOLDS = [10, 20, 30, 40, 50, 60, 70]

# Assumed behaviour mixes (percent). Edit these to test other assumptions.
LEGIT_MIX = [("routine", 70), ("typo", 6), ("new_device", 10),
             ("travel", 7), ("odd_hour", 5), ("new_phone_abroad", 2)]
ATTACK_MIX = [("stuffing_abroad", 35), ("targeted_same_country", 25),
              ("vpn_odd_hour", 15), ("guessing", 25)]


def pick(mix):
    kinds, weights = zip(*mix)
    return random.choices(kinds, weights=weights)[0]


def other_country(home):
    return random.choice([c for c in COUNTRIES if c != home])


def make_user(i):
    """A user with a realistic history: one home country, a usual 6-hour window,
    one or two trusted devices. About 15% are brand-new accounts with little history."""
    home = random.choice(COUNTRIES)
    start = random.randint(0, 17)
    window = [(start + k) % 24 for k in range(6)]
    devices = [f"dev-{i}-a"] + ([f"dev-{i}-b"] if random.random() < 0.3 else [])
    n_past = random.randint(1, 4) if random.random() < 0.15 else random.randint(6, 25)

    user = models.User(email=f"u{i}@x.com", password_hash="x")
    db.add(user)
    db.commit()
    for d in devices:
        db.add(models.KnownDevice(user_id=user.id, device_id=d, trusted=True))
    for _ in range(n_past):
        when = (NOW - timedelta(days=random.randint(1, 30))).replace(
            hour=random.choice(window), minute=0)
        db.add(models.LoginEvent(
            user_id=user.id, email_attempted=user.email, success=True,
            country=home, device_id=random.choice(devices), created_at=when))
    db.commit()
    return user, {"home": home, "window": window,
                  "odd": (start + 3 + 12) % 24, "devices": devices}


def legit_case(kind, p, i):
    new_dev = f"dev-{i}-new"
    usual_hour = random.choice(p["window"])
    trusted = random.choice(p["devices"])
    if kind == "routine":
        return trusted, p["home"], usual_hour, 0
    if kind == "typo":
        return trusted, p["home"], usual_hour, random.randint(1, 2)
    if kind == "new_device":
        return new_dev, p["home"], usual_hour, 0
    if kind == "travel":
        # Travelling often shifts the UTC hour of "usual" login times too
        hour = usual_hour
        if random.random() < 0.5:
            hour = (usual_hour + random.choice([-8, -5, 5, 8])) % 24
        return trusted, other_country(p["home"]), hour, 0
    if kind == "odd_hour":
        return trusted, p["home"], p["odd"], 0
    if kind == "new_phone_abroad":
        return new_dev, other_country(p["home"]), usual_hour, 0


def attack_case(kind, p, i):
    evil = f"dev-{i}-evil"
    if kind == "stuffing_abroad":
        return evil, other_country(p["home"]), random.randint(0, 23), 0
    if kind == "targeted_same_country":
        return evil, p["home"], random.choice(p["window"]), 0
    if kind == "vpn_odd_hour":
        return evil, p["home"], p["odd"], 0
    if kind == "guessing":
        return evil, other_country(p["home"]), random.randint(0, 23), random.randint(3, 6)


def evaluate_case(user, device, country, hour, failures):
    for m in range(failures):
        db.add(models.LoginEvent(
            user_id=user.id, email_attempted=user.email, success=False,
            failure_reason="wrong_password", created_at=NOW - timedelta(minutes=m + 1)))
    db.commit()
    r = risk.evaluate(db, email=user.email, user=user, device_id=device,
                      country=country, ip_prefix=None, hour=hour, now=NOW)
    return r.score, r.decision == "restrict"


results = []  # (label, kind, score, restricted)
idx = 0
for _ in range(N_LEGIT):
    idx += 1
    kind = pick(LEGIT_MIX)
    user, p = make_user(idx)
    score, restricted = evaluate_case(user, *legit_case(kind, p, idx))
    results.append(("legit", kind, score, restricted))
for _ in range(N_ATTACK):
    idx += 1
    kind = pick(ATTACK_MIX)
    user, p = make_user(idx)
    score, restricted = evaluate_case(user, *attack_case(kind, p, idx))
    results.append(("attack", kind, score, restricted))


def flagged(score, restricted, t):
    return restricted or score >= t


def pct(rows, t):
    return 100 * sum(flagged(s, r, t) for _, _, s, r in rows) / len(rows) if rows else 0.0


legit = [r for r in results if r[0] == "legit"]
attack = [r for r in results if r[0] == "attack"]

print(f"\nSynthetic evaluation: {len(legit)} legitimate logins, {len(attack)} attacks")
print(f"Current weights: {risk.WEIGHTS}")
print(f"Current step-up threshold: {risk.STEP_UP_THRESHOLD}\n")
print(f"{'Threshold':<10}{'Legit challenged':<20}{'Attacks stopped':<18}{'Attacks among all challenges*'}")
for t in THRESHOLDS:
    fpr = pct(legit, t) / 100
    tpr = pct(attack, t) / 100
    denom = ATTACK_RATE * tpr + (1 - ATTACK_RATE) * fpr
    precision = 100 * ATTACK_RATE * tpr / denom if denom else 0.0
    mark = "  <- current" if t == risk.STEP_UP_THRESHOLD else ""
    print(f"{t:<10}{fpr * 100:>6.1f}%{'':<13}{tpr * 100:>6.1f}%{'':<11}{precision:>6.1f}%{mark}")
print(f"* assuming {ATTACK_RATE:.0%} of real logins are attacks\n")

T = risk.STEP_UP_THRESHOLD
for label, rows in (("LEGITIMATE", legit), ("ATTACK", attack)):
    print(f"{label} logins by type, at threshold {T}:")
    groups = defaultdict(list)
    for r in rows:
        groups[r[1]].append(r)
    for kind, g in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        word = "challenged" if label == "LEGITIMATE" else "stopped"
        avg = sum(s for _, _, s, _ in g) / len(g)
        print(f"  {kind:<24} n={len(g):<5} {word} {pct(g, T):>5.1f}%   avg score {avg:>5.1f}")
    print()