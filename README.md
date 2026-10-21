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

DIGNITAS is fully responsive, touch-optimized, and compile-free for mobile devices:
- **Zero-Compile Mobile Access**: Judges can open `https://adaptive-auth-two.vercel.app/` directly on iPhone Safari, iPad, or Android Chrome with zero native compilation needed.
- **Adaptive Touch Controls**: Scenario buttons (1–8) are sized with minimum 44×46px touch targets with horizontal scroll-snap.
- **Responsive Phone Sim**: On mobile screens ($\le 680\text{px}$), the iPhone 15 Pro simulator automatically converts into an elegant bottom-sheet modal drawer (`width: min(320px, 92vw)`).
- **Vertical Stack Workspace**: The dual-column workspace seamlessly cascades vertically on smartphones for effortless thumb navigation.

---

## 🛠️ How We Created This (The Complete Engineering Journey)

DIGNITAS was architected and built from the ground up to solve the real-world operational challenges of **Problem Statement PS05**. Here is our end-to-end engineering methodology across six distinct development phases:

```mermaid
graph TD
    A[Phase 1: Threat Modeling & PS05 Discovery] --> B[Phase 2: Mathematical Risk Scoring Engine]
    B --> C[Phase 3: Cryptography & SQLite ACID Layer]
    C --> D[Phase 4: Frontend & On-Screen Smartphone Simulator]
    D --> E[Phase 5: Real-Time SOC & Telemetry Ledger]
    E --> F[Phase 6: Serverless Deployment & Mobile Optimization]
```

### Phase 1: Problem Definition & Threat Modeling
- **The 2FA Paradox**: Legacy MFA systems enforce OTP challenges indiscriminately on every login. This causes severe user fatigue, drop-offs, and social-engineering vulnerability (e.g. MFA fatigue push attacks). Conversely, static username/password systems leave organizations defenseless against credential stuffing.
- **The Core Objective**: Engineer an intelligent security gateway that calculates a dynamic risk score ($0$ to $100$) in under $10\text{ms}$ at the moment of authentication, enforcing zero friction for legitimate logins while escalating graduated defenses against attackers.

### Phase 2: Mathematical Risk Heuristics & Explainability Engine
- **Why Not Black-Box Deep Learning?** Many teams default to training complex machine learning classifiers. However, under banking and enterprise compliance (including **GDPR Article 22: Right to Explanation**), an AI system *must* be capable of explaining why an individual was challenged or blocked. Black-box weights cannot provide verifiable legal audit trails.
- **Deterministic Heuristic Equation**:
  $$R = \min\left(100, \max\left(0, \sum_{i} (w_i \cdot s_i) - B_{\text{trusted}}\right)\right)$$
  Where $s_i \in \{0, 1\}$ represents the presence of an anomaly signal, $w_i$ represents the penalty weight, and $B_{\text{trusted}}$ is a mitigation discount applied when verified hardware signatures match.
- **Calibrated Penalty Weights**:
  - *Unrecognized Hardware Signature*: $+45\text{ pts}$ (Device Trust mismatch).
  - *Tor Exit Node / Anonymizing VPN*: $+60\text{ pts}$ (Known proxy threat).
  - *Off-Hours Anomaly ($>3\text{h}$ from habitual baseline)*: $+10\text{ pts}$.
  - *Rapid Failed Password Burst ($5\text{ in } <2\text{m}$)*: $+30\text{ pts}$.
  - *Cross-App Threat Correlation*: $+35\text{ pts}$ (Account attacked on sister platform within last 15 mins).
  - *Impossible Travel Velocity ($>900\text{ km/h}$)*: $+45\text{ pts}$.
  - *Honeytoken Decoy Account Hit (`backup_admin`)*: $+100\text{ pts}$ (Instant hard block).

### Phase 3: Cryptographic Foundations & Data Architecture
- **Argon2id Password Hashing**: Standard SHA-256 and bcrypt are susceptible to parallelized GPU/ASIC dictionary attacks. DIGNITAS implements **Argon2id** (winner of the Password Hashing Competition) with a 64MB memory cost, rendering brute-force cracking mathematically infeasible.
- **SQLite ACID Persistence**: Built with relational foreign-key integrity in Write-Ahead Logging (WAL) mode across four core tables: `users`, `login_events`, `known_devices`, and `flagged_ips`.
- **Ephemeral Step-Up Tokens**: HMAC-SHA256 tokens with strict 5-minute time-to-live (TTL) bounds and one-time verification protection.

### Phase 4: Frontend Development & On-Screen Smartphone Simulator
- **Zero-Build Vanilla Architecture**: Created using modern semantic HTML5, Vanilla CSS3, and JavaScript without requiring `npm run build` or heavyweight node runtime dependencies in production.
- **Interactive iPhone 15 Pro Simulator**: Built an in-browser smartphone emulator featuring Apple Dynamic Island animations, realistic lock-screen push banners, Web Audio API ringtones, and interactive "Yes, it's me" / "No, it's not me" push verification.
- **Dual-Mode Outbound Relay**:
  - *Mode A (Live Inbox)*: Authenticated TLS SMTP relay (`smtp.gmail.com:587`) dispatches live OTPs and breach advisories to real user email addresses.
  - *Mode B (Zero-Config Simulator)*: When external SMTP credentials are not configured, the gateway seamlessly defaults to the on-screen iPhone simulator with zero configuration.

### Phase 5: Security Operations Center (SOC) & Telemetry Pipeline
- **Real-Time Audit Stream**: Every decision, latency measurement, signal breakdown, and geolocation is permanently recorded in `adaptive_auth.db`.
- **Administrative Kill-Switches**: One-click emergency account lock and unlock buttons for security analysts.
- **Interactive Relational SQL Inspector**: Directly view, filter, and inspect raw SQL table rows (`users`, `login_events`, `known_devices`, `flagged_ips`) within the browser.

### Phase 6: Cloud Deployment & Serverless Resilience
- **Serverless Read-Only Filesystem Resolution**: Vercel Serverless Functions execute in a read-only environment where standard SQLite writes crash. We engineered an automated transactional mirror that copies the baseline database to `/tmp/adaptive_auth.db` on cold start, ensuring persistent write operations.
- **Canonical ASGI Routing**: Configured Vercel `builds` + `routes` to proxy all incoming HTTP traffic directly to FastAPI's ASGI router, ensuring clean URLs (`/landing/`, `/dashboard/`, `/docs`) work without path-stripping 404 errors.
- **Multi-Layout Fallback**: Embedded static assets inside `backend/static/` so the application runs completely self-contained (~300KB UI) whether deployed from the repository root or just the backend directory.

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

## 🏆 Hackathon Evaluation Defense Matrix

This table maps directly to the three official judging criteria:

### 1. 💻 Prototype Demonstration (Working Prototype & Features)
- **Live Interactive Gateway**: Judges can log in as `alice@example.com` or `bob@example.com` and observe instantaneous risk calculation.
- **8 Pre-Seeded Attack Scenarios**: One-click execution of real-world threats with hotkeys 1 to 8.
- **Dual-Mode Outbound Relay**: Live TLS SMTP relay + Interactive on-screen iPhone 15 Pro simulator with Dynamic Island.
- **SOC Threat Telemetry & Relational SQL Explorer**: Real-time inspection of `users`, `login_events`, `known_devices`, and `flagged_ips`.

### 2. 💡 Project Explanation (Approach, Implementation & Challenges Faced)
- **Explainable Heuristic Math vs Black-Box ML**: Transparent, deterministic penalty weights complying with GDPR Article 22 Right to Explanation.
- **Technical Architecture**: Python 3.12, FastAPI ASGI, Argon2id memory-hard hashing, SQLite in WAL mode.
- **Challenges Faced & Overcome**:
  1. *Sub-100ms Latency Target*: Achieved **8.67ms average latency** (11x faster than target SLA).
  2. *Serverless Read-Only Filesystems*: Resolved by automated `/tmp` transactional SQLite database sync.
  3. *Cross-App Correlation vs GDPR*: Resolved by salted one-way hashes and 30-day automated TTL retention purge.
  4. *Serverless ASGI Path Preservation*: Resolved via canonical Vercel `builds` + `routes` configuration.

### 3. 🏆 Evaluation & Feedback (Functionality, Innovation & Implementation)
- **Functionality**: 100% detection rate across all 8 threat vectors with **0% false positive rate** on familiar baseline logins.
- **Innovation**: Honeytoken decoy traps (`backup_admin`), impossible travel velocity calculation, and interactive on-screen smartphone simulator.
- **Implementation Quality**: Self-contained zero-build deployment (~300KB total static assets), containerized with Docker, and deployed serverless.

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
