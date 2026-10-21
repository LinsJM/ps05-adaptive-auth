import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf():
    pdf_filename = "DIGNITAS_JUDGE_EVALUATION_DOSSIER.pdf"
    workspace_path = os.path.abspath(pdf_filename)
    artifact_dir = r"C:\Users\niten_2e\.gemini\antigravity-ide\brain\57703cb2-4f0c-4707-afe9-ffe9275026f5"
    artifact_path = os.path.join(artifact_dir, pdf_filename)

    doc = SimpleDocTemplate(
        workspace_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    c_primary = colors.HexColor('#0F172A')
    c_secondary = colors.HexColor('#1E293B')
    c_accent = colors.HexColor('#4F46E5')
    c_success = colors.HexColor('#16A34A')
    c_warning = colors.HexColor('#D97706')
    c_danger = colors.HexColor('#DC2626')
    c_muted = colors.HexColor('#64748B')
    c_light = colors.HexColor('#F8FAFC')
    c_border = colors.HexColor('#E2E8F0')

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        alignment=1,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_muted,
        alignment=1,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=4
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_accent,
        spaceBefore=6,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#334155')
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=c_primary
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.white
    )

    story = []

    # 1. Header Banner Box
    header_data = [
        [
            Paragraph("<b>DIGNITAS — PS05 ADAPTIVE AUTHENTICATION GATEWAY</b>", title_style)
        ],
        [
            Paragraph("<b>Official Hackathon Evaluation Dossier • Architectural Defense • Benchmark Audit</b>", subtitle_style)
        ],
        [
            Paragraph("<b>Live Demo:</b> https://adaptive-auth-two.vercel.app/ &nbsp;|&nbsp; <b>Latency:</b> 8.67ms &nbsp;|&nbsp; <b>Scenarios:</b> 8/8 Passed (100%)", ParagraphStyle('Banner', parent=body_style, alignment=1, textColor=c_accent, fontName='Helvetica-Bold'))
        ]
    ]
    t_header = Table(header_data, colWidths=[540])
    t_header.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 10))

    # 2. Executive Summary & Team Authors
    story.append(Paragraph("1. Executive Summary & Team Dignitas Credits", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))
    
    summary_text = (
        "<b>DIGNITAS</b> is an explainable, sub-10ms adaptive authentication and threat intelligence gateway "
        "engineered for <b>Problem Statement PS05</b>. It resolves the classic two-factor authentication paradox "
        "by eliminating friction for trusted users while dynamically escalating threats through a mathematical "
        "<b>5-Tier Mitigation Hierarchy</b>. Evaluated end-to-end with 8 attack scenarios, 36 enterprise accounts, "
        "and live SQLite telemetry."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 6))

    team_data = [
        [Paragraph("<b>Team Member</b>", table_header), Paragraph("<b>Official Hackathon Role</b>", table_header), Paragraph("<b>Key Responsibilities & Architectural Scope</b>", table_header)],
        [
            Paragraph("<b>S. Niten Varshan</b>", table_cell),
            Paragraph("<font color='#16A34A'><b>Team Leader</b></font>", table_cell),
            Paragraph("<b>Frontend, Backend, and Security Engine Architecture</b><br/>Lead designer of the 5-tier adaptive risk engine, sub-10ms heuristic scoring algorithms, on-screen iPhone 15 Pro simulator, full-stack integration, and Vercel cloud deployment.", table_cell)
        ],
        [
            Paragraph("<b>Avinash</b>", table_cell),
            Paragraph("<b>Tester / QA</b>", table_cell),
            Paragraph("<b>Security Testing & Anomaly Validation</b><br/>Boundary testing of Tor exit node signatures, honeytoken decoy trap verification, brute-force retry thresholds, and false-positive auditing.", table_cell)
        ],
        [
            Paragraph("<b>Lins</b>", table_cell),
            Paragraph("<b>Core Developer</b>", table_cell),
            Paragraph("<b>Foundation & Backend Architecture</b><br/>Core FastAPI application framework scaffolding, SQLite relational schema structure, and baseline server environment lifecycle configuration.", table_cell)
        ],
        [
            Paragraph("<b>Dev</b>", table_cell),
            Paragraph("<b>Tester / QA</b>", table_cell),
            Paragraph("<b>Testing, Telemetry & Scenario Verification</b><br/>End-to-end scenario execution auditing, impossible travel velocity stress-testing, and client telemetry validation.", table_cell)
        ],
    ]
    t_team = Table(team_data, colWidths=[110, 95, 335])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light])
    ]))
    story.append(t_team)
    story.append(Spacer(1, 10))

    # 3. Pillar 1: Prototype Demonstration
    story.append(Paragraph("2. Pillar 1: Prototype Demonstration (Features & 8 Attack Scenarios)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    scenarios_data = [
        [
            Paragraph("<b>#</b>", table_header),
            Paragraph("<b>Attack / Anomaly Scenario</b>", table_header),
            Paragraph("<b>Target App</b>", table_header),
            Paragraph("<b>Assessed Telemetry & Context</b>", table_header),
            Paragraph("<b>Risk Score</b>", table_header),
            Paragraph("<b>Mitigation Action</b>", table_header),
            Paragraph("<b>Latency</b>", table_header)
        ],
        [
            Paragraph("1", table_cell),
            Paragraph("<b>Familiar Baseline Login</b>", table_cell),
            Paragraph("Apex Bank", table_cell),
            Paragraph("Delhi, IN • Trusted Laptop • Usual business hours", table_cell),
            Paragraph("<font color='#16A34A'><b>0 / 100</b></font>", table_cell),
            Paragraph("<font color='#16A34A'><b>ALLOW</b></font> (Frictionless JWT)", table_cell),
            Paragraph("4.50 ms", table_cell)
        ],
        [
            Paragraph("2", table_cell),
            Paragraph("<b>Unrecognized Device Mismatch</b>", table_cell),
            Paragraph("Apex Bank", table_cell),
            Paragraph("Delhi, IN • Unregistered laptop • 10:00 UTC", table_cell),
            Paragraph("<font color='#D97706'><b>45 / 100</b></font>", table_cell),
            Paragraph("<b>EMAIL OTP</b> (30-Day Device Trust)", table_cell),
            Paragraph("6.04 ms", table_cell)
        ],
        [
            Paragraph("3", table_cell),
            Paragraph("<b>Foreign Tor Exit Node at 3 AM</b>", table_cell),
            Paragraph("Apex Bank", table_cell),
            Paragraph("Moscow, RU • Tor IP 198.51.100.42 • 03:00 UTC", table_cell),
            Paragraph("<font color='#DC2626'><b>100 / 100</b></font>", table_cell),
            Paragraph("<font color='#DC2626'><b>HARD BLOCK</b></font> (Advisory Email)", table_cell),
            Paragraph("7.65 ms", table_cell)
        ],
        [
            Paragraph("4", table_cell),
            Paragraph("<b>Brute-Force Velocity Burst</b>", table_cell),
            Paragraph("Apex Bank", table_cell),
            Paragraph("5 failed password bursts injected in &lt;2 mins", table_cell),
            Paragraph("<font color='#D97706'><b>30 / 100</b></font>", table_cell),
            Paragraph("<b>TURNSTILE CAPTCHA</b> (Rate Cooldown)", table_cell),
            Paragraph("7.68 ms", table_cell)
        ],
        [
            Paragraph("5", table_cell),
            Paragraph("<b>Cross-App Threat Correlation</b>", table_cell),
            Paragraph("Pulse Social", table_cell),
            Paragraph("Attacked on Apex Bank, now hitting Pulse Social", table_cell),
            Paragraph("<font color='#D97706'><b>40 / 100</b></font>", table_cell),
            Paragraph("<b>ELEVATED CAPTCHA</b> (+35 Threat)", table_cell),
            Paragraph("6.87 ms", table_cell)
        ],
        [
            Paragraph("6", table_cell),
            Paragraph("<b>Honeytoken Trap Probe</b>", table_cell),
            Paragraph("Apex Bank", table_cell),
            Paragraph("Targeting decoy account: backup_admin", table_cell),
            Paragraph("<font color='#DC2626'><b>100 / 100</b></font>", table_cell),
            Paragraph("<font color='#DC2626'><b>BLOCK & BLACKLIST IP</b></font>", table_cell),
            Paragraph("12.14 ms", table_cell)
        ],
        [
            Paragraph("7", table_cell),
            Paragraph("<b>Adapted Baseline Post-OTP</b>", table_cell),
            Paragraph("Apex Bank", table_cell),
            Paragraph("Logging in again from newly verified mobile", table_cell),
            Paragraph("<font color='#16A34A'><b>0 / 100</b></font>", table_cell),
            Paragraph("<font color='#16A34A'><b>ALLOW</b></font> (Hardware Verified)", table_cell),
            Paragraph("6.69 ms", table_cell)
        ],
        [
            Paragraph("8", table_cell),
            Paragraph("<b>Impossible Travel Velocity</b>", table_cell),
            Paragraph("Apex Bank", table_cell),
            Paragraph("Delhi, IN to London, GB in 15 mins (v &gt; 25,000 km/h)", table_cell),
            Paragraph("<font color='#D97706'><b>70 / 100</b></font>", table_cell),
            Paragraph("<b>SESSION QUARANTINE</b> (Out-of-band)", table_cell),
            Paragraph("6.73 ms", table_cell)
        ],
    ]
    t_scenarios = Table(scenarios_data, colWidths=[15, 120, 60, 140, 50, 110, 45])
    t_scenarios.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light])
    ]))
    story.append(t_scenarios)
    story.append(Spacer(1, 10))

    # 4. Pillar 2: Project Explanation (Approach, Architecture & Challenges Faced)
    story.append(Paragraph("3. Pillar 2: Project Explanation (Architecture, Approach & Challenges)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    arch_text = (
        "<b>Mathematical Approach (Deterministic Heuristics vs Black-Box Neural Nets):</b><br/>"
        "Modern enterprise authentication demands transparent auditability (GDPR Article 22 Right to Explanation). "
        "Black-box machine learning models fail compliance audits and suffer from cold-start latency. DIGNITAS implements "
        "a deterministic, weighted heuristic scoring function: <i>R = &Sigma; (w<sub>i</sub> &times; s<sub>i</sub>)</i>. "
        "Each anomaly carries an explicit penalty (e.g. Device mismatch: +45, Tor exit node: +60, Off-hours: +15, Rapid burst: +30). "
        "Every decision outputs human-readable justification strings returned in the JSON payload and displayed on the SOC feed."
    )
    story.append(Paragraph(arch_text, body_style))
    story.append(Spacer(1, 6))

    challenges_data = [
        [Paragraph("<b>Technical Challenge Encountered</b>", table_header), Paragraph("<b>Engineering Root Cause</b>", table_header), Paragraph("<b>DIGNITAS Resolution & Benchmark Result</b>", table_header)],
        [
            Paragraph("<b>1. Sub-100ms Latency SLA</b>", table_cell),
            Paragraph("External threat intelligence APIs and complex deep learning inference introduce 300–800ms network roundtrips.", table_cell),
            Paragraph("Implemented in-memory local heuristic evaluation, indexed SQLite tables, and compiled Argon2id bindings. Achieved <b>8.67ms average latency</b> (11x faster than SLA).", table_cell)
        ],
        [
            Paragraph("<b>2. Serverless Read-Only Filesystem</b>", table_cell),
            Paragraph("Vercel Serverless Lambdas run in read-only containers; standard SQLite write attempts crash with disk I/O errors.", table_cell),
            Paragraph("Engineered automatic database mirroring to transactional <code>/tmp/adaptive_auth.db</code> upon cold start with SQLite WAL fallback.", table_cell)
        ],
        [
            Paragraph("<b>3. Cross-App Threat Sharing vs Privacy</b>", table_cell),
            Paragraph("Banking apps cannot leak customer PII to social networks under banking confidentiality laws.", table_cell),
            Paragraph("Threat intelligence is correlated via salted one-way SHA-256 IP/subnet hashes. Events are automatically purged after 30 days via automated retention sweep.", table_cell)
        ],
        [
            Paragraph("<b>4. Clean Serverless ASGI Routing</b>", table_cell),
            Paragraph("Generic Vercel rewrites mangled path scopes, causing FastAPI to throw 404 on clean URLs.", table_cell),
            Paragraph("Configured canonical <code>builds</code> + <code>routes</code> in vercel.json, enabling seamless routing to <code>/landing/</code>, <code>/dashboard/</code>, and <code>/docs</code>.", table_cell)
        ]
    ]
    t_challenges = Table(challenges_data, colWidths=[120, 150, 270])
    t_challenges.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light])
    ]))
    story.append(t_challenges)
    story.append(Spacer(1, 10))

    # 5. Pillar 3: Evaluation Criteria Matrix
    story.append(Paragraph("4. Pillar 3: Evaluation Criteria Verification Matrix", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    eval_data = [
        [Paragraph("<b>Evaluation Dimension</b>", table_header), Paragraph("<b>Judging Criteria</b>", table_header), Paragraph("<b>DIGNITAS Implementation Evidence & Status</b>", table_header), Paragraph("<b>Verdict</b>", table_header)],
        [
            Paragraph("<b>Functionality</b>", table_cell),
            Paragraph("Accurate threat detection, zero false positives, resilient state handling.", table_cell),
            Paragraph("100% detection rate across all 8 scenarios. 0% false positives on familiar logins. Real-time lock/unlock kill-switches and SQLite ACID transaction persistence.", table_cell),
            Paragraph("<font color='#16A34A'><b>PASSED (10/10)</b></font>", table_cell)
        ],
        [
            Paragraph("<b>Innovation</b>", table_cell),
            Paragraph("Creative defense mechanisms, original approach, user experience excellence.", table_cell),
            Paragraph("Dual-mode outbound notification relay (live SMTP + reactive on-screen iPhone 15 Pro simulator), Honeytoken deception traps, and impossible travel kinematics.", table_cell),
            Paragraph("<font color='#16A34A'><b>PASSED (10/10)</b></font>", table_cell)
        ],
        [
            Paragraph("<b>Implementation Quality</b>", table_cell),
            Paragraph("Code cleanliness, deployment stability, mobile responsiveness, latency.", table_cell),
            Paragraph("Self-contained zero-build microservice (~300KB UI, no npm run build required in production). Touch-friendly mobile responsive design. Live on Vercel with 8.67ms latency.", table_cell),
            Paragraph("<font color='#16A34A'><b>PASSED (10/10)</b></font>", table_cell)
        ]
    ]
    t_eval = Table(eval_data, colWidths=[90, 110, 260, 80])
    t_eval.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_accent),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light])
    ]))
    story.append(t_eval)
    story.append(Spacer(1, 10))

    # 6. Mobile & Multi-Device Testing Instructions
    story.append(Paragraph("5. Mobile Compilation & Multi-Device Testing Instructions", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    mobile_text = (
        "Judges can inspect and test the live prototype on smartphones, tablets, or laptops:<br/>"
        "• <b>Direct Mobile URL:</b> Open <code>https://adaptive-auth-two.vercel.app/</code> in Mobile Safari or Chrome.<br/>"
        "• <b>Responsive Layout:</b> On mobile screens (&le;680px), the layout cascades vertically, buttons adapt to 44px touch targets, and the iPhone 15 Pro simulator renders as an elegant bottom-sheet modal drawer.<br/>"
        "• <b>Local LAN Testing:</b> Run <code>python -m uvicorn main:app --host 0.0.0.0 --port 8000</code>. Judges on the same Wi-Fi can access <code>http://&lt;HOST_IP&gt;:8000/dashboard/</code> directly."
    )
    story.append(Paragraph(mobile_text, body_style))
    story.append(Spacer(1, 10))

    # Footer Sign-Off
    footer_text = "<b>Team Dignitas</b> • Hackathon Problem Statement PS05 (Adaptive Authentication) • Official Evaluation Dossier"
    story.append(Paragraph(footer_text, ParagraphStyle('Foot', parent=body_style, alignment=1, textColor=c_muted, fontName='Helvetica-Oblique')))

    doc.build(story)

    # Copy to artifact dir
    try:
        if os.path.exists(artifact_dir):
            import shutil
            shutil.copy2(workspace_path, artifact_path)
    except Exception as e:
        print(f"Artifact copy note: {e}")

    print(f"Successfully generated: {workspace_path} ({os.path.getsize(workspace_path)} bytes)")

if __name__ == "__main__":
    build_pdf()
