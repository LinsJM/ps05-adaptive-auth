# Second Look

**PS05: Adaptive authentication and suspicious login detection**

A login system that gives risky sign-ins a second look instead of a rejection. It scores the context of every login (device, country, time of day, recent failures) against the user's own history, then responds in proportion: no friction for familiar logins, a one-time code for unusual ones, and a short cooldown for repeated failures.

Landing page: https://claude.ai/artifact/JsFzXbZsNUD9aCM7hiYPPN

## Why

A correct password does not prove who is signing in. Real users buy new phones and travel; attackers with a stolen password look the same at the password prompt. Rejecting every unusual login punishes honest users, and trusting every correct password rewards attackers. Second Look weighs uncertain signals together and asks for proof only when the total justifies it.

## How it works

1. **Collect context.** Device ID, country, hour and recent failures. Only coarse data is kept.
2. **Score the signals.** Each signal adds points against this user's history. No single signal is proof.
3. **Decide in proportion.** Allow, step-up, or a temporary cooldown.
4. **Build trust.** A device becomes trusted only after verification, and trust can be withdrawn.

### Signals and weights

| Signal | Points | Notes |
|---|---|---|
| New device | +35 | The first device on an account is the trusted baseline and scores 0 |
| New country | +25 | Compared with this account's earlier successful logins |
| Unusual hour | +10 | Needs 5 or more earlier logins; ignored in a new country, because UTC hours are not comparable across time zones |
| Several things changed at once | +15 | New device and new country together |
| Failed attempts (last 15 min) | +5 / +15 / +30 | For 1–2, 3–4 and 5 or more |
| Many accounts failing from one network | +20 | The credential-stuffing signal |

### Decisions

| Result | Response |
|---|---|
| Score below 30 | **Allow** |
| Score 30 or more | **Step-up**: a one-time 6-digit code (10-minute expiry, 5 attempts, stored only as a hash) |
| 5 or more failures in 15 minutes | **Temporary cooldown**: sign-in pauses for about 15 minutes, then recovers. Never a permanent lockout |

After step-up, the user can tick **Trust this device**. A device is never trusted just because the password was right, and trust can be removed from the Trusted Devices panel.

### The five scenarios

| Scenario | Score | Response |
|---|---|---|
| Familiar login | 0 | Allow |
| First-time device | 35 | Step-up |
| Legitimate travel (trusted device, new country) | 25 | Allow, recorded |
| Repeated failures | 5+ failures | Cooldown |
| Possible takeover (new device and new country) | 75 | Step-up |

## Evaluation

We ran the real engine on 1,000 synthetic legitimate logins and 400 synthetic attacks (`backend/evaluate.py`).

| Threshold | Legit users challenged | Attacks stopped | Attacks among all challenges* |
|---|---|---|---|
| 10 | 23.5% | 100% | 4.1% |
| 20 | 19.1% | 100% | 5.0% |
| **30 (chosen)** | **11.9%** | **100%** | **7.8%** |
| 40 | 1.4% | 71.8% | 34.1% |
| 50 | 1.4% | 61.3% | 30.6% |

\* Assuming 1% of real logins are attacks.

**One fix, measured.** Legitimate travelers were challenged 29.2% of the time, because their usual login hours shift in UTC when they change time zones. Ignoring the unusual-hour signal abroad cut that to 0% and total friction from 14.0% to 11.9%, with no attack missed.

**The trade-off we accept.** An honest user on a new phone and an attacker on a new device both score 35. Raising the threshold would let that attacker through, so we keep it and make the challenge one-time and cheap, with "Trust this device" removing it next time.

**Limits.** The data is synthetic and built on stated assumptions. It shows how the engine behaves, not how real users behave. A real evaluation needs labeled login logs, and the credential-stuffing signal is excluded because it needs traffic from many accounts.

## Privacy by design

- The network is stored as a /24 prefix (/48 for IPv6), never the full IP address.
- Country only, no city. The browser is reduced to a summary such as "Chrome / Windows".
- The device ID is a random value generated in the browser. No hardware fingerprinting.
- Login events are deleted after 30 days.
- One-time codes are stored only as hashes.
- Wrong password and unknown email return the same error, and an unknown email takes the same time to process.
- Cooldowns always expire.

## Tech stack

- **Backend:** FastAPI, SQLAlchemy, SQLite, PyJWT, Argon2 (pwdlib)
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```
SECRET_KEY=<run: python -c "import secrets; print(secrets.token_hex(32))">
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEMO_MODE=true
```

`DEMO_MODE=true` lets the simulator send demo headers (`X-Demo-Country`, `X-Demo-Hour`, `X-Demo-IP`) to imitate other locations and times. It also returns the one-time code in the API response, because no email is sent. Leave it off for anything other than a local demo.

Run the API:

```bash
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** (use `localhost`, not `127.0.0.1`, because the backend's CORS setting allows only that origin).

## Try it

1. Register at `/register` and sign in. That first device becomes your trusted baseline.
2. Sign in again from an incognito window. A new device triggers the "Verify it's you" screen, and the demo code is shown on screen.
3. Open `/simulator` and click **Run all five scenarios**.
4. Back on the home page, look at the Security Summary, Login Activity and Trusted Devices.

## Scripts and tests

Run these from `backend/` with the virtual environment active:

| Command | What it does |
|---|---|
| `python test_risk.py` | Unit checks of the scoring engine (in-memory database) |
| `python demo_scenarios.py` | Plays the five scenarios against the running API (`pip install requests` first) |
| `python demo_stepup.py` | Tests the one-time code flow and device trust against the running API |
| `python evaluate.py` | Synthetic evaluation and threshold sweep |

If the database schema changes, delete `backend/adaptive_auth.db` and restart the server so it is rebuilt.

## API

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register` | Create an account |
| `POST /api/auth/login` | Check the password, score the attempt, then allow, challenge or restrict |
| `POST /api/auth/verify-step-up` | Complete a challenge with the one-time code |
| `GET /api/auth/me`, `POST /api/auth/logout` | Current user, sign out |
| `GET /api/events/recent` | Your latest login events with scores and reasons |
| `GET /api/events/summary` | Counts by decision and the most common signals |
| `GET /api/devices`, `POST /api/devices/{id}/revoke` | List devices, remove trust |

## Project structure

```
backend/
  main.py, database.py, models.py, schemas.py, security.py
  privacy.py        data minimisation helpers (IP prefix, UA summary, country)
  risk.py           signals, weights, scoring and decisions
  routers/          auth.py, events.py, devices.py
  evaluate.py, test_risk.py, demo_scenarios.py, demo_stepup.py
frontend/
  src/pages/        Login, Register, Home, Simulator
  src/components/   TrustedDevices, SecuritySummary
```

## Limitations and future work

- The one-time code is shown on screen in demo mode. A real deployment would send it by email or SMS.
- Country comes from a demo header. A real deployment would use an offline GeoIP lookup.
- The JWT is kept in `localStorage` for this local demo. Production systems should use secure, HTTP-only cookies.
- Add per-IP rate limiting, bind challenges more tightly to the requesting device, and consider a learned anomaly score alongside the rules.
- Weights and thresholds were tuned on synthetic data and need real login data to validate.

## Team

Niten · Lins · Avinash · Dev
