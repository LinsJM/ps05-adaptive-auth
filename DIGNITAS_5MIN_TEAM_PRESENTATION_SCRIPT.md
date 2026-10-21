# DIGNITAS PS05 — 5-MINUTE TEAM PRESENTATION SCRIPT
### Exact Timing Guide for 3 Speakers (300 Seconds Total)
**Problem Statement PS05**: Adaptive Authentication & Explainable Suspicious Login Detection with 5-Tier Graduated Threat Mitigation

---

## ⏱️ Executive Timing & Division of Roles

| Speaker | Time Window | Duration | Core Responsibility & Focus |
| :--- | :---: | :---: | :--- |
| **Speaker 1** | **0:00 – 1:35** | 95 sec | **The Problem & 5-Tier Architecture**: Why static passwords fail, the 5-tier graduated mitigation model, and sub-10ms pipeline speed. |
| **Speaker 2** | **1:35 – 3:15** | 100 sec | **The 5 Real-Time Threat Vectors & Policy Profiling**: The 5 attack vectors, explainable telemetry scoring, and Apex Bank vs Pulse Social policy duality. |
| **Speaker 3** | **3:15 – 5:00** | 105 sec | **Live Attack Demos & Live Phone Simulator**: Demonstrating Scenarios 1 to 8, iPhone 15 Pro simulator ("Yes/No" prompt), impossible travel defense, and self-service password recovery. |

---

## 🎙️ SPEAKER 1: Problem Statement & 5-Tier Architecture (0:00 – 1:35)
> **Goal**: Hook the judges, define Problem Statement PS05, explain why binary security fails, and introduce our 5-tier graduated architecture.

### [0:00 – 0:30] The Core Problem
> **Spoken Dialogue:**
> *"Good morning respected judges. In modern cybersecurity, static username and password authentication is completely broken. Attackers deploy automated botnets, credential-stuffing lists from dark-web leaks, and residential proxy networks to impersonate legitimate users. However, forcing multi-factor authentication on every single login frustrates legitimate users, driving customer churn.*
>
> *DIGNITAS solves Problem Statement PS05: a sub-10 millisecond Adaptive Authentication Gateway that evaluates incoming client telemetry in real time and applies the exact minimum friction needed to protect the account."*

### [0:30 – 1:10] The 5-Tier Graduated Threat Architecture
> **Spoken Dialogue:**
> *"Rather than a simplistic binary allow-or-block decision, DIGNITAS implements an explainable 5-Tier Risk Engine based on a 0 to 100 risk score:*
>
> 1. ***Tier 1: Allow (0–29 pts)***: *Frictionless passage in under 10ms when client behavior matches the habitual baseline.*
> 2. ***Tier 2: CAPTCHA (30–44 pts)***: *Cloudflare Turnstile proof-of-work to neutralize automated bot scripts and rapid password guessing without user friction.*
> 3. ***Tier 3: Step-Up Challenge (45–59 pts)***: *Interactive smartphone prompt ('Yes, it's me' / 'No, it's not me') plus email OTP with automated device trust enrollment.*
> 4. ***Tier 4: Session Quarantine (60–79 pts)***: *Isolates the session in read-only quarantine when high anomalies like supersonic impossible travel occur, requiring out-of-band email approval.*
> 5. ***Tier 5: Hard Block (80–100 pts)***: *Automated connection termination, SQLite IP blacklisting, and urgent compromised password alerts for honeytoken decoys and active account takeovers."*

### [1:10 – 1:35] System Speed & Technical Independence
> **Spoken Dialogue:**
> *"Our backend runs on Python FastAPI and SQLite with zero external cloud dependencies. It calculates IP subnet clustering, hardware fingerprints, and geographical travel velocity in just 4 to 15 milliseconds.*
>
> *I will now hand over to Speaker 2 to explain how our engine categorizes real-time threats across banking and social applications."*

---

## 🎙️ SPEAKER 2: The 5 Threat Vectors & Banking vs Social Policy (1:35 – 3:15)
> **Goal**: Detail the 5 login threat vectors, show our explainable scoring breakdown, and explain why Banking vs Social Media policies differ in risk tolerance.

### [1:35 – 2:20] The 5 Real-Time Threat Vectors
> **Spoken Dialogue:**
> *"Thank you Speaker 1. DIGNITAS groups incoming threat signals into five distinct attack vectors in real time:*
>
> 1. ***Credential Replay & Leaks***: *Detects credentials matching dark-web dumps, phishing reverse proxies, and trips honeytoken decoys like our fake backup_admin trap.*
> 2. ***Automated & High-Velocity Threats***: *Identifies rapid brute-force bursts, credential stuffing from residential proxies, and headless browser automation signatures.*
> 3. ***Device & Environment Posture***: *Flags unverified hardware, rooted or jailbroken operating systems, and emulator environments.*
> 4. ***Network & Location Anomalies***: *Flags Tor exit nodes, data center proxy subnets, and impossible supersonic travel speeds.*
> 5. ***Behavioral Anomalies & Session Hijacking***: *Identifies abnormal login hours, abrupt multi-attribute shifts, and cross-application correlated attacks."*

### [2:20 – 3:15] Policy Duality: Banking Zero-Trust vs Social Friction-Balancing
> **Spoken Dialogue:**
> *"A critical innovation of DIGNITAS is Adaptive Policy Profiling. A bank and a social network cannot treat risk the same way:*
>
> - ***Apex Bank operates a strict Zero-Trust Policy***: *Zero tolerance for financial loss. Unrecognized endpoints cannot transfer funds, and anomalies trigger out-of-band smartphone verification or emergency account lockouts.*
> - ***Pulse Social operates a Friction-Balanced Policy***: *Optimizes for high engagement and rapid user onboarding. Automated bots are filtered invisibly using Turnstile CAPTCHA, while legitimate users enjoy frictionless access with post-login active session notifications.*
>
> *Notice our live application switcher dynamically adjusts the security posture from banking zero-trust to social engagement-balancing with a single click.*
>
> *Now Speaker 3 will demonstrate these defenses live using our interactive Gateway and iPhone simulator."*

---

## 🎙️ SPEAKER 3: Live Attack Demos, Phone Simulator & Recovery (3:15 – 5:00)
> **Goal**: Execute live scenario buttons on screen, show the interactive iPhone simulator buzzing with 'Yes/No' prompts, trigger impossible travel, and demonstrate self-service password recovery.

### [3:15 – 3:45] Demo 1: Frictionless Passage vs Bot Defense
> **Action Cue**: *[Click Scenario 1 'Familiar Login' on left dock]*
>
> **Spoken Dialogue:**
> *"Watch our live gateway in action. When Alice signs in from her familiar laptop in Delhi, our engine scores it 0 out of 100. Latency is just 6 milliseconds. She receives frictionless access without a single prompt.*
>
> **Action Cue**: *[Click Scenario 4 'Brute Force Defense']*
>
> *Next, an attacker attempts repeated rapid logins with wrong passwords. The engine immediately flags repeated failure velocity, elevates risk to 30 points, and presents a Cloudflare Turnstile CAPTCHA challenge that bot scripts cannot bypass."*

### [3:45 – 4:25] Demo 2: Phone Simulator Interactive Prompt (Yes/No) & Impossible Travel
> **Action Cue**: *[Click Scenario 2 'New Device' & point to Phone Simulator drawer]*
>
> **Spoken Dialogue:**
> *"Now, Alice signs in from an unrecognized mobile device. The engine flags Tier 3 (45 pts). Immediately, our iPhone 15 Pro simulator buzzes with an urgent security prompt: 'Was this you signing in?'*
>
> *Notice the two interactive buttons: clicking [✓ Yes, it's me] permanently trusts the device into SQLite and logs her in. Clicking [✕ No, it's not me] instantly emergency-locks the account.*
>
> **Action Cue**: *[Click Scenario 8 'Impossible Velocity Travel']*
>
> *Next, look at Scenario 8: an attacker attempts to log in from London just 15 minutes after Alice was active in Delhi. That requires supersonic aircraft speed. The engine intercepts this as Tier 4 Session Quarantine (70 pts). The user is alerted on their phone with one-click options to [🔒 Change Password] and [🚫 Blacklist Attacker IP] directly in SQLite."*

### [4:25 – 4:45] Demo 3: Honeytoken Trap & Self-Service Forgot Password
> **Action Cue**: *[Click Scenario 6 'Honeytoken Trap' then click 'Forgot password?']*
>
> **Spoken Dialogue:**
> *"When an intruder probes our decoy backup_admin honeytoken, the engine scores a lethal 100, hard-blocks the connection, and permanently blacklists the IP.*
>
> *Finally, we built end-to-end self-service recovery: clicking [Forgot password?] dispatches a 6-digit recovery PIN directly to the phone simulator, allowing the legitimate user to restore access in seconds without needing IT support."*

### [4:45 – 5:00] Conclusion & Judge Wrap-Up
> **Spoken Dialogue:**
> *"To conclude: DIGNITAS is not a prototype mock-up. It is a production-grade, explainable, sub-10ms adaptive security suite with 100% test accuracy, live smartphone simulation, dual-app threat profiling, and complete deployment readiness.*
>
> *Thank you for your time, and we look forward to your questions!"*
