# DIGNITAS — PS05 Adaptive Authentication & Threat Intelligence Gateway

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20ACID-003B57.svg?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20Serverless-000000.svg?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Docker Ready](https://img.shields.io/badge/Container-Docker%20Compose-2496ED.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-12%2F12%20Passing%20(100%25)-16A34A.svg?style=flat)]()
[![Latency](https://img.shields.io/badge/Avg%20Latency-8.67ms-10B981.svg?style=flat)]()

> **DIGNITAS** is an explainable, sub-10ms Adaptive Authentication and Suspicious Login Detection Gateway engineered for **Problem Statement PS05**. It resolves the 2FA paradox: delivering **frictionless zero-step logins** for trusted baseline users while graduating malicious bots, credential stuffers, and account takeovers across a mathematical **5-Tier Threat Mitigation Hierarchy**.

---

## 🌟 Key Highlights & Architectural Innovations

1. **Sub-10ms Explainable Risk Engine:** Local, deterministic, in-memory contextual calculation (actual benchmark: **8.67ms**, SLA: <100ms) with itemized mathematical reasons.
2. **Graduated 5-Tier Threat Mitigation:**
   - **Tier 1 (0–29 pts):** Frictionless Allow (standard Argon2 password check, instant JWT).
   - **Tier 2 (30–44 pts):** Cloudflare Turnstile CAPTCHA (mitigates brute-force velocity without locking out humans).
   - **Tier 3 (45–59 pts):** Contextual MFA (6-Box Email OTP + 30-Day Device Trust enrollment).
   - **Tier 4 (60–79 pts):** High-Threat Session Quarantine (out-of-band verification for impossible travel).
   - **Tier 5 (80–100 pts):** Automated Hard Block + SQLite IP Blacklisting + Urgent Breach Alert Email with one-click password reset.
3. **Cross-Application Threat Correlation:** Unified threat intelligence shared across high-security banking (`Apex Bank`) and consumer social networks (`Pulse Social`).
4. **Security Operations Center (SOC) & ACID SQLite Inspector:** Real-time immutable audit ledger, live user lock/unlock kill-switches, and interactive relational table viewer.
5. **Pre-Seeded Enterprise Dataset:** 36 diverse enterprise users, 35 hardware profiles, and 160+ historical audit events spanning 14 days.

---

## 🛡️ 5-Tier Adaptive Policy Matrix

| Tier | Risk Score | Trigger Conditions | Mitigation Action | UX Impact & Rationale |
| :---: | :---: | :--- | :--- | :--- |
| **Tier 1** | **0 – 29 pts** | Trusted hardware, known IP subnet, typical working hours, familiar country. | **Frictionless Allow** | **Zero user friction.** Seamless entry for daily legitimate operations. |
| **Tier 2** | **30 – 44 pts** | Rapid retry burst (2–5 failed attempts), cross-app threat correlation (+35 pts). | **Turnstile CAPTCHA** | Blocks automated scripts without frustrating legitimate humans with OTP. |
| **Tier 3** | **45 – 59 pts** | Unrecognized hardware (+45 pts), mild time anomaly, unverified browser. | **Email OTP + Device Trust** | Verifies primary inbox; binds hardware for 30 days to prevent future friction. |
| **Tier 4** | **60 – 79 pts** | Impossible travel velocity (e.g. India $\to$ US in 15 mins), compound anomalies. | **Session Quarantine** | Freezes session from sensitive resources until authorized out-of-band. |
| **Tier 5** | **80 – 100 pts** | Honeytoken account probe (`backup_admin`), blacklisted IP, Tor ATO combo. | **Hard Block & Auto Blacklist** | Terminates connection, flags IP in SQLite, and sends urgent breach alert email. |

---

## 🕹️ Live Demo Scenarios & Keyboard Shortcuts

Press hotkeys **1 to 8** in the [Live Gateway](http://localhost:8000/dashboard/) to execute real-world attack scenarios:

| Key | Scenario Name | Target App | Score | Outcome & Enforcement |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Normal Familiar Baseline Login | `Apex Bank` | `0` | Frictionless Allow (JWT Issued in 4.5ms) |
| **2** | First-Time Device Mismatch | `Apex Bank` | `45` | Tier 3: 6-Box Email OTP + 30-Day Device Trust |
| **3** | Foreign Tor Attack at 3 AM | `Apex Bank` | `100` | Tier 5: Critical Hard Block & Account Protection |
| **4** | Rapid Brute-Force Password Burst | `Apex Bank` | `30` | Tier 2: Cloudflare Turnstile CAPTCHA Challenge |
| **5** | Cross-Application Threat Correlation | `Pulse Social` | `40` | Tier 2: Elevated Threat Challenge (+35 Cross-App) |
| **6** | Honeytoken Trap (`backup_admin`) | `Apex Bank` | `100` | Tier 5: Instant Block + Attacker IP Blacklisted in DB |
| **7** | Baseline Adaptation (Post-Enroll) | `Apex Bank` | `0` | Frictionless Allow for Enrolled Device |
| **8** | Impossible Velocity Travel (IN $\to$ US in 15m) | `Apex Bank` | `70` | Tier 4: Session Quarantine & Out-of-Band Verify |

---

## 🚀 Quick Start Guide

### 1. Local Development (Instant)
```bash
# 1. Clone repository
git clone https://github.com/nitenvarshan/adaptive-auth.git
cd adaptive-auth

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start Gateway Server (Port 8000)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
- **Overview Showcase:** [http://localhost:8000/landing/](http://localhost:8000/landing/)
- **Live Decision Gateway:** [http://localhost:8000/dashboard/](http://localhost:8000/dashboard/)
- **Security Operations Center (SOC):** [http://localhost:8000/dashboard/soc.html](http://localhost:8000/dashboard/soc.html)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Docker Deployment
```bash
docker compose up -d
```

### 3. Vercel Cloud Deployment
This repository is pre-configured with `vercel.json` and `api/index.py`:
1. Connect this repo to [Vercel](https://vercel.com/new).
2. Set Framework Preset to **Other**.
3. Deploy!

---

## 📋 Hackathon Presentation Playbook
A complete 4-speaker pitch script and Q&A defense guide is included:
- 📄 **Official PDF:** [DIGNITAS_JUDGE_PRESENTATION_PLAYBOOK.pdf](./DIGNITAS_JUDGE_PRESENTATION_PLAYBOOK.pdf)
- 📖 **Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 📊 **Audit Report:** [DEMO_REPORT.md](./DEMO_REPORT.md)

---

## 👥 Team Dignitas
Built with precision for Problem Statement PS05 (Adaptive Authentication & Suspicious Login Detection).
