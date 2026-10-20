import random
from datetime import datetime, timezone

import requests

BASE = "http://localhost:8000/api"
PASSWORD = "StrongPass123!"
email = f"demo{random.randint(1000, 9999)}@example.com"

# An hour far from "now", so the history looks unusual against it
current_hour = datetime.now(timezone.utc).hour
odd_hour = (current_hour + 12) % 24


def login(device, country="IN", hour=None, password=PASSWORD):
    headers = {"X-Demo-Country": country}
    if hour is not None:
        headers["X-Demo-Hour"] = str(hour)
    return requests.post(
        f"{BASE}/auth/login",
        json={"email": email, "password": password, "device_id": device},
        headers=headers,
    )


def report(name, r, want_score=None, want_decision=None):
    if r.status_code == 200:
        risk = r.json()["risk"]
        ok = risk["score"] == want_score and risk["decision"] == want_decision
        print(f"{'PASS' if ok else 'FAIL'}  {name:<34} score={risk['score']:<3} decision={risk['decision']}")
        for reason in risk["reasons"]:
            print(f"        +{reason['points']:<3} {reason['signal']}: {reason['detail']}")
    else:
        ok = want_decision == "restrict" and r.status_code == 429
        print(f"{'PASS' if ok else 'FAIL'}  {name:<34} HTTP {r.status_code}: {r.json().get('detail')}")


# Set up: register, then build a history of normal logins from one device
reg = requests.post(f"{BASE}/auth/register", json={"email": email, "password": PASSWORD})
assert reg.status_code == 201, reg.text
for _ in range(5):
    assert login("dev-home").status_code == 200
print(f"Using test account {email}\n")

report("1. Familiar login", login("dev-home"), 0, "allow")
report("2. First-time device", login("dev-second"), 35, "step_up")
report("3. Legitimate travel (known device)", login("dev-home", country="US"), 25, "allow")
report("4. Possible account takeover", login("dev-third", country="RU", hour=odd_hour), 75, "step_up")

print()
for i in range(1, 6):
    r = login("dev-home", password="WrongPassword!")
    print(f"      wrong password attempt {i}: HTTP {r.status_code}")
report("5. Repeated failures (6th attempt)", login("dev-home"), None, "restrict")