import random

import requests

BASE = "http://localhost:8000/api"
PASSWORD = "StrongPass123!"
email = f"otp{random.randint(1000, 9999)}@example.com"
HEADERS = {"X-Demo-Country": "IN"}


def login(device):
    r = requests.post(f"{BASE}/auth/login", headers=HEADERS,
                      json={"email": email, "password": PASSWORD, "device_id": device})
    return r.json()


def verify(challenge_id, code, trust):
    return requests.post(f"{BASE}/auth/verify-step-up", headers=HEADERS,
                         json={"challenge_id": challenge_id, "code": code, "trust_device": trust})


def check(name, ok):
    print(f"{'PASS' if ok else 'FAIL'}  {name}")


requests.post(f"{BASE}/auth/register", json={"email": email, "password": PASSWORD})
login("dev-home")
login("dev-home")  # builds a baseline: dev-home is the first, trusted device

r = login("dev-new")
check("1. New device is challenged and gets no token",
      r.get("step_up_required") is True and r.get("access_token") is None)
cid, code = r["challenge_id"], r["demo_code"]

wrong = "000000" if code != "000000" else "111111"
check("2. Wrong code is rejected", verify(cid, wrong, False).status_code == 400)

ok = verify(cid, code, True)
check("3. Right code issues a token", ok.status_code == 200 and bool(ok.json()["access_token"]))
check("4. A used code cannot be reused", verify(cid, code, True).status_code == 400)

r2 = login("dev-new")
check("5. Device trusted after verification is allowed",
      bool(r2.get("access_token")) and r2["risk"]["decision"] == "allow")

r3 = login("dev-other")
v = verify(r3["challenge_id"], r3["demo_code"], False)
check("6. Verified without trusting the device", v.status_code == 200)
r4 = login("dev-other")
check("7. Untrusted device is challenged again", r4.get("step_up_required") is True)