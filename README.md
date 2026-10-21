# DIGNITAS — PS05 Adaptive Authentication & Threat Intelligence Gateway

[![Live Demo](https://img.shields.io/badge/Live%20Demo-adaptive--auth--two.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://adaptive-auth-two.vercel.app/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20ACID-003B57.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Mobile Ready](https://img.shields.io/badge/Mobile-Touch%20Optimized%20%26%20Responsive-10B981.svg?style=for-the-badge&logo=apple&logoColor=white)](https://adaptive-auth-two.vercel.app/)
[![Avg Latency](https://img.shields.io/badge/Avg%20Latency-8.67ms-10B981.svg?style=for-the-badge)]()
[![Scenarios](https://img.shields.io/badge/Scenarios-8%2F8%20Passed%20(100%25)-16A34A.svg?style=for-the-badge)]()

> **DIGNITAS** is an explainable, sub-10ms Adaptive Authentication and Suspicious Login Detection Gateway engineered for **Problem Statement PS05**. It resolves the traditional 2FA paradox: delivering **frictionless zero-step logins** for trusted baseline users while graduating malicious bots, credential stuffers, and account takeovers across a mathematical **5-Tier Threat Mitigation Hierarchy**.

---

## 🌐 Live Prototype & Interactive Web Interfaces

DIGNITAS is live and accessible from any desktop laptop, tablet, or smartphone:

| Interface | Live URL | Purpose |
| :--- | :--- | :--- |
| **🚀 Solution Showcase & Problem Overview** | [adaptive-auth-two.vercel.app/](https://adaptive-auth-two.vercel.app/) | High-level problem statement breakdown, live interactive simulator, 5-tier architecture, and technical defense. |
| **🛡️ Interactive Gateway & Phone Simulator** | [adaptive-auth-two.vercel.app/dashboard/](https://adaptive-auth-two.vercel.app/dashboard/) | Split-screen login checkpoint with real-time risk gauge, itemized signals, and simulated iPhone 15 Pro. |
| **📊 Security Operations Center (SOC Feed)** | [adaptive-auth-two.vercel.app/dashboard/soc.html](https://adaptive-auth-two.vercel.app/dashboard/soc.html) | Live streaming telemetry, SQLite table explorer, and emergency account lock/unlock kill-switches. |
| **📖 Interactive Swagger API Documentation** | [adaptive-auth-two.vercel.app/docs](https://adaptive-auth-two.vercel.app/docs) | Interactive OpenAPI 3.0 specification for all authentication, telemetry, and threat endpoints. |
| **⚡ Gateway Healthcheck** | [adaptive-auth-two.vercel.app/api/health](https://adaptive-auth-two.vercel.app/api/health) | Sub-millisecond JSON health check endpoint (`{"status": "ok"}`). |

---

## 📱 Mobile Compatibility & Compilation

DIGNITAS is fully responsive and touch-optimized:
- **Mobile Browsers**: Judges can open `https://adaptive-auth-two.vercel.app/` directly on iPhone Safari, iPad, or Android Chrome.
- **Adaptive Touch Controls**: Scenario buttons (1–8) are sized with minimum 44×44px touch targets with horizontal scroll-snap.
- **Responsive Phone Sim**: On mobile screens ($\le 680\text{px}$), the iPhone 15 Pro simulator automatically converts into an elegant bottom-sheet modal drawer.
- **Vertical Stack Workspace**: The dual-column workspace seamlessly cascades vertically on smartphones for effortless thumb navigation.

---

## 🏆 Hackathon Evaluation Defense Matrix

This table maps directly to the three judging criteria:

### 1. 💻 Prototype Demonstration (Working Prototype & Features)
- **Live Interactive Gateway**: Judges can log in as `alice@example.com` or `bob@example.com` and observe instantaneous risk calculation.
- **8 Pre-Seeded Attack Scenarios**: One-click execution of real-world threats (brute force bursts, impossible travel, Tor exit nodes, honeytokens).
- **Dual-Mode Outbound Relay**:
  1. *Real Inboxes*: Authenticated TLS SMTP relay (`smtp.gmail.com:587`) dispatches live emails.
  2. *On-Screen Simulator*: Built-in iPhone 15 Pro with Dynamic Island, lock-screen push notifications, and Web Audio API chime.
- **SOC Threat Telemetry & Relational SQL Explorer**: Real-time inspection of `users`, `login_events`, `known_devices`, and `flagged_ips`.

### 2. 💡 Project Explanation (Approach, Implementation & Challenges Faced)
- **Explainable Heuristic Math vs Black-Box ML**:
  - *Why not black-box ML?* Neural networks cannot explain why a user was blocked under banking audit compliance (GDPR Article 22). DIGNITAS implements deterministic, transparent penalty math ($R = \sum w_i \cdot s_i$) returning human-readable justifications.
- **Technical Architecture**:
  - Python 3.12, FastAPI ASGI, Argon2id memory-hard hashing (64MB memory cost), SQLite in WAL mode.
- **Key Technical Challenges Faced & Overcome**:
  1. *Sub-100ms Latency Target*: Resolved via in-memory heuristic pipelines and indexed SQLite queries, achieving **8.67ms average latency** (11x faster than SLA).
  2. *Serverless Read-Only Filesystems*: SQLite requires write access. Resolved by implementing automatic `/tmp` transactional mirroring when deployed in Vercel Serverless Lambda.
  3. *Cross-Application Threat Correlation vs GDPR*: Banking (`Apex Bank`) and Social (`Pulse Social`) share threat intelligence via privacy-preserving cryptographic hashes without exposing PII.
  4. *Serverless ASGI Path Preservation*: Resolved via canonical Vercel `builds` + `routes` configuration proxying clean URLs.

### 3. 🏆 Evaluation & Feedback (Functionality, Innovation & Implementation)
- **Functionality**: 100% detection rate across all 8 threat vectors with **0% false positive rate** on familiar baseline logins.
- **Innovation**: Honeytoken decoy traps (`backup_admin`), impossible travel velocity calculation ($v = d / \Delta t > 900\text{ km/h}$), and interactive on-screen smartphone simulator.
- **Implementation Quality**: Self-contained zero-build deployment (~300KB total static assets, no node_modules required in production), containerized with Docker, and deployed serverless.

---

## 🛡️ 5-Tier Graduated Threat Mitigation Hierarchy

| Tier | Score Range | Anomaly Signals | Enforcement Action | User Experience Impact |
| :---: | :---: | :--- | :--- | :--- |
| **Tier 1** | **0 – 29 pts** | Trusted device, habitual baseline IP, normal working hours. | **Frictionless Allow** | **Zero friction.** Immediate JWT issuance in sub-10ms. |
| **Tier 2** | **30 – 44 pts** | Rapid retry burst (2–5 failed attempts), cross-app threat (+35 pts). | **Cloudflare Turnstile CAPTCHA** | Blocks automated scripts without frustrating humans with OTPs. |
| **Tier 3** | **45 – 59 pts** | First-time unrecognized hardware (+45 pts), unverified browser. | **6-Box Email OTP + Device Trust** | Verifies email ownership; enrolls device for 30 days. |
| **Tier 4** | **60 – 79 pts** | Impossible travel velocity ($>900\text{ km/h}$), severe anomaly combo. | **Session Quarantine** | Freezes session until out-of-band mobile confirmation. |
| **Tier 5** | **80 – 100 pts** | Honeytoken account probe (`backup_admin`), blacklisted Tor exit node. | **Hard Block & IP Blacklist** | 403 Forbidden, source IP added to `flagged_ips`, advisory email sent. |

---

## 🕹️ 8 Live Attack Scenarios Matrix

Press keyboard hotkeys **1 to 8** in the [Interactive Gateway](https://adaptive-auth-two.vercel.app/dashboard/):

| Key | Scenario Name | Target App | Score | Mitigation Action & Reason |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Normal Familiar Baseline Login | `Apex Bank` | `0` | **ALLOW** (Trusted device and habitual baseline match) |
| **2** | First-Time Unrecognized Device | `Apex Bank` | `45` | **EMAIL OTP** (Hardware signature mismatch, enrolls for 30 days) |
| **3** | Foreign Tor Exit Node at 3 AM | `Apex Bank` | `100` | **BLOCK** (Tor node listed on threat watchlist + off-hours ATO) |
| **4** | Rapid Password Brute-Force Burst | `Apex Bank` | `30` | **CAPTCHA** (5 rapid failures injected in <2 minutes) |
| **5** | Cross-App Threat Correlation | `Pulse Social` | `40` | **CAPTCHA** (+35 pts elevated threat inherited from Apex Bank) |
| **6** | Honeytoken Trap (`backup_admin`) | `Apex Bank` | `100` | **BLOCK & BLACKLIST** (Decoy account hit; IP flagged in DB) |
| **7** | Adapted Baseline (Post-OTP) | `Apex Bank` | `0` | **ALLOW** (Hardware now verified and trusted) |
| **8** | Impossible Travel Velocity | `Apex Bank` | `70` | **QUARANTINE** (Delhi $\to$ London in 15 mins, $v > 20,000\text{ km/h}$) |

---

## 👥 Team Dignitas — Project Authors & Roles

| Member | Official Role | Key Contributions |
| :--- | :--- | :--- |
| **S. Niten Varshan** | **Team Leader** | **Frontend, Backend, and Security Engine Architecture**<br>Architected the 5-tier threat heuristics, sub-10ms decision pipeline, interactive smartphone simulator, full-stack integration, and Vercel cloud deployment. |
| **Avinash** | **Tester / QA** | **Security Testing & Anomaly Validation**<br>Engineered attack vector test cases, boundary-tested Tor exit node detection, honeytoken trap validation, and false-positive auditing. |
| **Lins** | **Core Developer** | **Foundation & Backend Architecture**<br>Developed core FastAPI routing scaffolding, SQLite relational schemas, and baseline environment lifecycle configuration. |
| **Dev** | **Tester / QA** | **Testing, Telemetry & Scenario Verification**<br>Executed end-to-end demo scenario audits, brute-force burst stress testing, and client telemetry validation. |

---

## 🚀 Local Quickstart Guide

### 1. Clone & Run
```bash
# Clone repository
git clone https://github.com/nitenvarshan/adaptive-auth.git
cd adaptive-auth

# Install dependencies
pip install -r requirements.txt

# Start Gateway (Port 8000)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Run Test Suite
```bash
python -m unittest backend/test_risk.py
```

### 3. Docker Deployment
```bash
docker compose up -d
```

---

## 📄 Evaluation Documents & Playbooks

- 📄 **Official Judge Evaluation Dossier:** [DIGNITAS_JUDGE_EVALUATION_DOSSIER.pdf](./DIGNITAS_JUDGE_EVALUATION_DOSSIER.pdf)
- 📖 **Comprehensive Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 📊 **Official Live Demo Audit Report:** [DEMO_REPORT.md](./DEMO_REPORT.md)
