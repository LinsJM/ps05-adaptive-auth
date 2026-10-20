import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 756, "DIGNITAS (PS05) — Adaptive Authentication & Threat Intelligence Gateway")
            self.drawRightString(576, 756, "Judges' Presentation & Team Playbook")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 750, 576, 750)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 38, 576, 38)
        self.drawString(36, 26, "CONFIDENTIAL — HACKATHON EVALUATION GUIDE — TEAM DIGNITAS (4 SPEAKERS)")
        self.drawRightString(576, 26, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    c_navy = colors.HexColor("#0F172A")
    c_blue = colors.HexColor("#2563EB")
    c_dark = colors.HexColor("#1E293B")
    c_muted = colors.HexColor("#475569")
    c_red = colors.HexColor("#DC2626")
    c_green = colors.HexColor("#16A34A")
    c_amber = colors.HexColor("#D97706")
    c_purple = colors.HexColor("#7C3AED")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_navy,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_blue,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SecH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_navy,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SecH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_blue,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyMain',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletMain',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_dark,
        leftIndent=14,
        spaceAfter=3
    )

    speaker_title_style = ParagraphStyle(
        'SpeakerTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.white
    )

    speaker_meta_style = ParagraphStyle(
        'SpeakerMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#E0E7FF")
    )

    cue_style = ParagraphStyle(
        'DemoCue',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=c_amber,
        leftIndent=10,
        spaceAfter=4
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=c_dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=c_navy
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    story = []

    # ========================================================
    # COVER / HEADER BANNER
    # ========================================================
    header_data = [
        [
            Paragraph("<b>DIGNITAS — PS05 ADAPTIVE AUTHENTICATION GATEWAY</b>", title_style),
            Paragraph("<b>HACKATHON FINAL DEFENSE</b><br/><font color='#2563EB'>Team of 4 Pitch Deck</font>", table_cell_bold)
        ]
    ]
    header_table = Table(header_data, colWidths=[420, 120])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    story.append(header_table)
    story.append(Paragraph("A Comprehensive Judging Presentation, 4-Speaker Script, Live Attack Demo Guide & Q&A Battlecards", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceBefore=0, spaceAfter=10))

    # Executive Summary Card
    exec_text = (
        "<b>Executive Mission:</b> DIGNITAS solves <b>Problem Statement PS05</b> by replacing static, high-friction 2FA "
        "with an intelligent, explainable, sub-10ms risk engine. Legitimate users authenticate with <b>zero friction</b>, "
        "while malicious automated bots, credential stuffers, and account takeovers face a mathematically graduated "
        "<b>5-Tier Threat Mitigation Policy</b>. This document coordinates a polished <b>7-minute presentation</b> distributed across 4 team members."
    )
    exec_table = Table([[Paragraph(exec_text, body_style)]], colWidths=[540])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#BFDBFE")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 10))

    # ========================================================
    # 4-SPEAKER ROSTER OVERVIEW TABLE
    # ========================================================
    story.append(Paragraph("1. Team Roster & Stage Allocation (4 Speakers)", h1_style))
    
    roster_data = [
        [
            Paragraph("Speaker & Role", table_header),
            Paragraph("Time Slot", table_header),
            Paragraph("Core Theme & Key Responsibilities", table_header),
            Paragraph("Live Screen / Demo Action", table_header)
        ],
        [
            Paragraph("<b>Speaker 1</b><br/>Team Lead & Visionary", table_cell_bold),
            Paragraph("<b>0:00 - 1:30</b><br/>(90 sec)", table_cell),
            Paragraph("<b>Problem PS05 Framing</b>: The 2FA fatigue dilemma, credential stuffing epidemic, and DIGNITAS zero-friction vision.", table_cell),
            Paragraph("Opens <b>Overview Site</b> (/landing), points to Problem Statement and Solution Matrix.", table_cell)
        ],
        [
            Paragraph("<b>Speaker 2</b><br/>Risk Engine Architect", table_cell_bold),
            Paragraph("<b>1:30 - 3:15</b><br/>(105 sec)", table_cell),
            Paragraph("<b>5-Tier Adaptive Architecture</b>: Mathematical scoring, risk weights (+45 dev, +25 country, +35 attempts), explainability.", table_cell),
            Paragraph("Slides toggles in <b>Live Matrix Simulator</b>; demonstrates dynamic score shifts across tiers.", table_cell)
        ],
        [
            Paragraph("<b>Speaker 3</b><br/>Live Demo Master", table_cell_bold),
            Paragraph("<b>3:15 - 5:15</b><br/>(120 sec)", table_cell),
            Paragraph("<b>Live Attack Demonstrations</b>: Executes Scenarios 1, 2, 4, 6 & 8 in the live gateway; shows OTP toast & phone sim.", table_cell),
            Paragraph("Operates <b>Interactive Gateway</b> (/dashboard); demonstrates CAPTCHA, 6-box OTP, and instant blocks.", table_cell)
        ],
        [
            Paragraph("<b>Speaker 4</b><br/>SOC & Intelligence Lead", table_cell_bold),
            Paragraph("<b>5:15 - 6:45</b><br/>(90 sec)", table_cell),
            Paragraph("<b>SOC Intelligence & Data Integrity</b>: Real-time ledger, ACID SQLite inspector, enterprise SLA (<10ms), cross-app sync.", table_cell),
            Paragraph("Switches to <b>SOC Threat Center</b> (/dashboard/soc.html); inspects SQL database tables and user locks.", table_cell)
        ],
        [
            Paragraph("<b>All 4 Members</b><br/>Panel Defense", table_cell_bold),
            Paragraph("<b>6:45 - 8:00+</b><br/>(Q&A)", table_cell),
            Paragraph("<b>Judges' Q&A Defense</b>: Handles technical objections on privacy, latency, bypass vectors, and enterprise scalability.", table_cell),
            Paragraph("Answers directed based on domain specialty (Speaker 1: Product, 2: Math, 3: UX, 4: Backend).", table_cell)
        ]
    ]

    roster_table = Table(roster_data, colWidths=[90, 65, 235, 150])
    roster_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(roster_table)
    story.append(Spacer(1, 14))

    # ========================================================
    # SPEAKER 1 DETAILED SCRIPT
    # ========================================================
    story.append(KeepTogether([
        Table([[
            Paragraph("<b>SPEAKER 1: PROBLEM FRAMING, THE 2FA PARADOX & THE DIGNITAS VISION</b>", speaker_title_style),
            Paragraph("0:00 – 1:30 (90 seconds)", speaker_meta_style)
        ]], colWidths=[400, 140], style=[
            ('BACKGROUND', (0,0), (-1,-1), c_blue),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ]),
        Spacer(1, 6)
    ]))

    story.append(Paragraph("<b>Opening Hook & Spoken Script:</b>", h2_style))
    story.append(Paragraph(
        '"Respected judges, every day millions of legitimate users suffer through frustrating SMS codes and CAPTCHAs, '
        'while sophisticated automated bots and credential stuffers steal billions of dollars using stolen passwords. '
        'Security teams face an impossible dilemma: <b>maximum friction that kills user retention, or minimum friction that invites disaster</b>."',
        body_style
    ))
    story.append(Paragraph(
        '"Static 2FA is fundamentally broken. Today, our team is proud to introduce <b>DIGNITAS</b> — an Adaptive Authentication '
        'and Suspicious Login Detection Gateway engineered specifically for Problem Statement PS05. DIGNITAS replaces guesswork '
        'with a <b>sub-10ms, mathematically explainable risk engine</b>. Legitimate users glide through with zero friction, while '
        'threats are graduated across a rock-solid 5-tier mitigation policy."',
        body_style
    ))
    story.append(Paragraph("<b>Screen & Demo Cues for Speaker 1:</b>", cue_style))
    story.append(Paragraph("• <b>[0:15]</b> Stand beside screen showing <b>http://localhost:8000/landing/</b>.", bullet_style))
    story.append(Paragraph("• <b>[0:40]</b> Scroll smoothly to Section <code>#problem</code> to highlight the 3 core failures of legacy systems.", bullet_style))
    story.append(Paragraph("• <b>[1:15]</b> Point to the Solution Matrix card and transition to Speaker 2: <i>'Now, my teammate will explain how our mathematical engine evaluates risk in under 10 milliseconds.'</i>", bullet_style))
    story.append(Spacer(1, 10))

    # ========================================================
    # SPEAKER 2 DETAILED SCRIPT
    # ========================================================
    story.append(KeepTogether([
        Table([[
            Paragraph("<b>SPEAKER 2: MATHEMATICAL RISK SCORING & THE 5-TIER ADAPTIVE ENGINE</b>", speaker_title_style),
            Paragraph("1:30 – 3:15 (105 seconds)", speaker_meta_style)
        ]], colWidths=[400, 140], style=[
            ('BACKGROUND', (0,0), (-1,-1), c_navy),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ]),
        Spacer(1, 6)
    ]))

    story.append(Paragraph("<b>Core Spoken Script:</b>", h2_style))
    story.append(Paragraph(
        '"Thank you, Speaker 1. At the heart of DIGNITAS is our <b>Explainable Contextual Risk Scoring Engine</b>. '
        'Instead of opaque black-box machine learning models that compliance auditors reject, every single login evaluation '
        'produces an integer score from 0 to 100, backed by explicit, itemized mathematical reasons."',
        body_style
    ))
    story.append(Paragraph(
        '"We analyze multi-dimensional contextual signals: <b>hardware device fingerprints, geographic country shifts, '
        'impossible velocity calculations (e.g., India to USA in 15 minutes), Tor exit nodes, unusual hour deviations, '
        'and cross-application threats</b>. Most importantly, we redesigned the mitigation hierarchy into a defensible <b>5-Tier Architecture</b>:"',
        body_style
    ))
    story.append(Paragraph("• <b>Tier 1 (0–29 pts): Frictionless Allow</b> — Standard password check. Zero user friction for familiar baseline logins.", bullet_style))
    story.append(Paragraph("• <b>Tier 2 (30–44 pts): Turnstile CAPTCHA Challenge</b> — Neutralizes rapid brute-force bots without locking out legitimate humans.", bullet_style))
    story.append(Paragraph("• <b>Tier 3 (45–59 pts): Contextual Challenge & Device Trust</b> — For new unrecognized devices (+45 pts), prompts 6-box Email OTP with optional 30-day device enrollment.", bullet_style))
    story.append(Paragraph("• <b>Tier 4 (60–79 pts): High-Threat Quarantine & Out-of-Band Push</b> — For impossible travel (+70 pts), freezes session in isolated quarantine pending mobile push approval.", bullet_style))
    story.append(Paragraph("• <b>Tier 5 (80–100 pts): Automated Hard Block & Breach Protocol</b> — For account takeovers, honeytoken traps, and blacklisted IPs. Blocks login, adds IP to SQLite blacklist, and sends urgent password reset alert email.", bullet_style))
    
    story.append(Paragraph("<b>Screen & Demo Cues for Speaker 2:</b>", cue_style))
    story.append(Paragraph("• <b>[1:45]</b> Scroll to <b>Section #simulator</b> in the Overview site.", bullet_style))
    story.append(Paragraph("• <b>[2:10]</b> Click 'New Device Mismatch (+45 pts)' checkbox live; show gauge move to 45 (Tier 3: Step-Up OTP).", bullet_style))
    story.append(Paragraph("• <b>[2:40]</b> Click 'Tor Proxy' (+25) and 'Unusual Hours' (+10); show gauge jump to 80 (Tier 5: Critical Block).", bullet_style))
    story.append(Paragraph("• <b>[3:05]</b> Hand off to Speaker 3: <i>'Now, let us watch these 5 tiers defend live applications under real attack.'</i>", bullet_style))
    story.append(Spacer(1, 10))

    story.append(PageBreak())

    # ========================================================
    # SPEAKER 3 DETAILED SCRIPT
    # ========================================================
    story.append(KeepTogether([
        Table([[
            Paragraph("<b>SPEAKER 3: LIVE GATEWAY DEMONSTRATION & ATTACK SCENARIOS</b>", speaker_title_style),
            Paragraph("3:15 – 5:15 (120 seconds)", speaker_meta_style)
        ]], colWidths=[400, 140], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#065F46")),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ]),
        Spacer(1, 6)
    ]))

    story.append(Paragraph("<b>Core Spoken Script:</b>", h2_style))
    story.append(Paragraph(
        '"Thank you, Speaker 2. You are looking at our <b>Live Border-Control Adaptive Gateway</b> running at <code>/dashboard</code>. '
        'Notice our dual-app toggle: we protect both a high-security banking portal (Apex Bank) and a consumer social network (Pulse Social). '
        'Let us execute our live scenarios using our quick keyboard hotkeys:"',
        body_style
    ))
    story.append(Paragraph(
        '"<b>Press Key 1: Scenario 1 (Normal Familiar Login).</b> Alice logs in from her trusted laptop in Delhi. The risk score is exactly 0. '
        'The gateway issues a JWT token instantly with zero friction in just 4.5 milliseconds."',
        body_style
    ))
    story.append(Paragraph(
        '"<b>Press Key 2: Scenario 2 (First-Time Device Challenge).</b> Alice signs in from an unrecognized mobile device. Risk score jumps to 45 (Tier 3). '
        'Notice the slide-in security toast and our interactive 6-box OTP challenge. We enter the OTP code <code>482910</code>, check '
        '<i>Trust this device for 30 days</i>, and the device is enrolled into our trusted SQL database."',
        body_style
    ))
    story.append(Paragraph(
        '"<b>Press Key 4: Scenario 4 (Brute-Force Attack Burst).</b> An attacker injects 5 rapid password attempts. The gateway calculates an attempt velocity penalty '
        'and immediately triggers Cloudflare Turnstile CAPTCHA (Tier 2: 35 pts), blocking the automated bot script in its tracks."',
        body_style
    ))
    story.append(Paragraph(
        '"<b>Press Key 6: Scenario 6 (Honeytoken Decoy Trap).</b> An attacker probes our system targeting decoy account <code>backup_admin</code>. '
        'The gateway triggers a 100-point hard block, terminates the connection, and automatically blacklists the attacker IP into SQLite."',
        body_style
    ))
    story.append(Paragraph(
        '"<b>Press Key 8: Scenario 8 (Impossible Travel).</b> Bob logged into Delhi 15 minutes ago; now an attacker presents valid credentials from New York. '
        'That requires Mach-4 supersonic flight speed! DIGNITAS calculates impossible velocity, assigns Score 70 (Tier 4), and isolates the session in Quarantine."',
        body_style
    ))

    story.append(Paragraph("<b>Screen & Demo Cues for Speaker 3:</b>", cue_style))
    story.append(Paragraph("• <b>[3:20]</b> Switch active browser tab to <b>http://localhost:8000/dashboard/</b>.", bullet_style))
    story.append(Paragraph("• <b>[3:35]</b> Press <b>Key 1</b> $\\rightarrow$ Show green gauge, 'Score 0', frictionless success banner.", bullet_style))
    story.append(Paragraph("• <b>[4:00]</b> Press <b>Key 2</b> $\\rightarrow$ Show yellow gauge 'Score 45', 6-box modal pops up; enter OTP, click 'Trust device'.", bullet_style))
    story.append(Paragraph("• <b>[4:30]</b> Press <b>Key 4</b> $\\rightarrow$ Show Cloudflare Turnstile CAPTCHA challenge box render.", bullet_style))
    story.append(Paragraph("• <b>[4:55]</b> Press <b>Key 6</b> $\\rightarrow$ Show red gauge 'Score 100 Hard Block' and judge's iPhone simulator alert toast.", bullet_style))
    story.append(Paragraph("• <b>[5:10]</b> Click top nav link <code>Security Operations (SOC Feed) ↗</code> and hand over to Speaker 4.", bullet_style))
    story.append(Spacer(1, 10))

    # ========================================================
    # SPEAKER 4 DETAILED SCRIPT
    # ========================================================
    story.append(KeepTogether([
        Table([[
            Paragraph("<b>SPEAKER 4: SOC THREAT TELEMETRY, ACID SQL LEDGER & ENTERPRISE SLA</b>", speaker_title_style),
            Paragraph("5:15 – 6:45 (90 seconds)", speaker_meta_style)
        ]], colWidths=[400, 140], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#581C87")),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ]),
        Spacer(1, 6)
    ]))

    story.append(Paragraph("<b>Core Spoken Script:</b>", h2_style))
    story.append(Paragraph(
        '"Thank you, Speaker 3. While users experience seamless security, enterprise security analysts need total visibility. '
        'This is our <b>Security Operations Center (SOC)</b> running at <code>/dashboard/soc.html</code>. '
        'Every login attempt is captured in an <b>immutable, real-time audit ledger</b>."',
        body_style
    ))
    story.append(Paragraph(
        '"Notice our live ACID Database Inspector tab. We use an enterprise-grade SQLite relational engine with foreign keys '
        'and indexing. Security admins can directly inspect the <code>login_events</code> table, <code>known_devices</code> hardware table, '
        'and the automated <code>flagged_ips</code> blacklist table. If an account is actively targeted, our Emergency Kill Switch '
        'allows SOC analysts to lock or unlock any user in 1 click with zero downtime."',
        body_style
    ))
    story.append(Paragraph(
        '"<b>Performance & Verification Metrics:</b> In our comprehensive test suite of 12 unit tests and 8 end-to-end attack scenarios, '
        'DIGNITAS achieved a <b>100% detection rate</b>, <b>0.0% false positives</b> on legitimate baselines, and an average decision '
        'latency of <b>8.67 milliseconds</b> — well under our strict 100ms enterprise SLA requirement."',
        body_style
    ))
    story.append(Paragraph(
        '"In conclusion, DIGNITAS proves that organizations do not have to choose between user experience and uncompromising security. '
        'Thank you, and our entire team is now eager to take your questions!"',
        body_style
    ))

    story.append(Paragraph("<b>Screen & Demo Cues for Speaker 4:</b>", cue_style))
    story.append(Paragraph("• <b>[5:20]</b> Display <b>http://localhost:8000/dashboard/soc.html</b>.", bullet_style))
    story.append(Paragraph("• <b>[5:45]</b> Click 'Database Explorer' tab; show live record counts and click <code>flagged_ips</code> table.", bullet_style))
    story.append(Paragraph("• <b>[6:15]</b> Point to 'Average Latency: 8.67 ms' and 'Zero False Positives' badges on the live dashboard.", bullet_style))
    story.append(Paragraph("• <b>[6:40]</b> All 4 team members step forward together, make eye contact with judges for Q&A.", bullet_style))
    story.append(Spacer(1, 14))

    # ========================================================
    # 5-TIER POLICY DEFENSE TABLE
    # ========================================================
    story.append(Paragraph("2. Official 5-Tier Adaptive Threat Matrix", h1_style))
    matrix_data = [
        [
            Paragraph("Tier & Risk Score", table_header),
            Paragraph("Trigger Signals & Conditions", table_header),
            Paragraph("Adaptive Enforcement Action", table_header),
            Paragraph("UX Impact & Security Rationale", table_header)
        ],
        [
            Paragraph("<b>Tier 1: Minimal</b><br/><font color='#16A34A'><b>0 – 29 pts</b></font>", table_cell_bold),
            Paragraph("Trusted hardware, known IP/subnet, typical working hours, familiar country.", table_cell),
            Paragraph("<b>Frictionless Allow</b><br/>Standard Argon2 password check; JWT issued.", table_cell),
            Paragraph("Zero user friction. Seamless entry for legitimate daily workflow.", table_cell)
        ],
        [
            Paragraph("<b>Tier 2: Low</b><br/><font color='#2563EB'><b>30 – 44 pts</b></font>", table_cell_bold),
            Paragraph("Rapid brute-force attempts (2–5 failures), cross-app threat correlation (+35 pts).", table_cell),
            Paragraph("<b>Cloudflare Turnstile CAPTCHA</b><br/>Enforces cryptographic proof-of-work.", table_cell),
            Paragraph("Filters high-speed bot scripts without frustrating legitimate humans with OTP.", table_cell)
        ],
        [
            Paragraph("<b>Tier 3: Medium</b><br/><font color='#D97706'><b>45 – 59 pts</b></font>", table_cell_bold),
            Paragraph("New unrecognized device (+45 pts), mild time anomaly, unverified browser.", table_cell),
            Paragraph("<b>Contextual Step-Up MFA</b><br/>6-Box Email OTP + 30-Day Device Trust.", table_cell),
            Paragraph("Verifies possession of primary mailbox; binds hardware to prevent future friction.", table_cell)
        ],
        [
            Paragraph("<b>Tier 4: High</b><br/><font color='#EA580C'><b>60 – 79 pts</b></font>", table_cell_bold),
            Paragraph("Impossible travel velocity (e.g., India $\\rightarrow$ US in 15m), multiple anomalies.", table_cell),
            Paragraph("<b>Session Quarantine</b><br/>Out-of-band mobile verification challenge.", table_cell),
            Paragraph("Isolates session from sensitive resources until authorized out-of-band.", table_cell)
        ],
        [
            Paragraph("<b>Tier 5: Critical</b><br/><font color='#DC2626'><b>80 – 100 pts</b></font>", table_cell_bold),
            Paragraph("Honeytoken target (<code>backup_admin</code>), blacklisted IP, Tor ATO combo.", table_cell),
            Paragraph("<b>Hard Block + Auto Blacklist</b><br/>Source IP banned; Emergency breach email sent.", table_cell),
            Paragraph("Immediate threat termination; provides one-click password reset link to victim.", table_cell)
        ]
    ]

    matrix_table = Table(matrix_data, colWidths=[85, 155, 145, 155])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(matrix_table)

    story.append(PageBreak())

    # ========================================================
    # JUDGES' TOUGH Q&A BATTLECARDS (ALL 4 SPEAKERS)
    # ========================================================
    story.append(Paragraph("3. Judges' Q&A Battlecards (Anticipated Objections & Answers)", h1_style))
    story.append(Paragraph("Be prepared for these 6 technical challenges from the judging panel. Speak with confidence and cite these exact mechanisms:", body_style))
    story.append(Spacer(1, 4))

    qa_list = [
        (
            "Q1: Why not enforce MFA for every single login? Isn't mandatory MFA safer?",
            "Speaker 1 / 2",
            "Mandatory MFA causes severe user fatigue, high drop-off rates (up to 40% in consumer apps), and massive SMS/provider costs. More critically, attackers bypass static MFA using prompt bombing, real-time phishing proxies (Evilginx), and SIM swapping. DIGNITAS applies defense-in-depth: zero friction for trusted sessions, but instant graduated escalation when signals deviate, making targeted attacks far harder to execute."
        ),
        (
            "Q2: Can't sophisticated attackers easily spoof HTTP headers and IP addresses?",
            "Speaker 2 / 4",
            "IP spoofing over TCP three-way handshake is mathematically impossible for stateful HTTP sessions because sequence numbers cannot be completed without receiving response packets. Additionally, our device fingerprinting is multi-attribute: we correlate hardware screen geometry, WebGL rendering hashes, CPU concurrency, platform architecture, and TLS client fingerprints. Spoofing one header does not bypass our compound risk score."
        ),
        (
            "Q3: How do you achieve sub-10ms decision latency? Does this scale?",
            "Speaker 2 / 4",
            "Our average decision latency is 8.67ms. We achieve this because our risk calculation is strictly local, in-memory, and deterministic. All contextual weights and historical baseline calculations run via indexed SQLite queries with zero external network blocking. In production, Redis caching can further reduce latency to sub-2 milliseconds for millions of concurrent sessions."
        ),
        (
            "Q4: What if an attacker attempts impossible travel using a residential proxy in the user's city?",
            "Speaker 3 / 2",
            "If an attacker uses a local proxy, the geographic country signal might not trigger, but the unrecognized hardware device mismatch (+45 pts) still immediately activates Tier 3 Contextual MFA. If they also guess incorrect passwords or attack during unusual hours (3 AM), compound score penalties immediately push the session into Tier 4 Quarantine or Tier 5 Block."
        ),
        (
            "Q5: How does the Cross-Application Threat Correlation work across different apps?",
            "Speaker 4 / 3",
            "Our centralized risk engine indexes security events by normalized user identity across all enterprise applications (e.g. Apex Bank and Pulse Social). When a high-risk security incident or brute-force burst occurs on Apex Bank, any login attempt on Pulse Social within the correlation window inherits a +35 point penalty, neutralizing lateral movement attacks."
        ),
        (
            "Q6: What about user privacy, GDPR compliance, and telemetry data storage?",
            "Speaker 4 / 1",
            "DIGNITAS follows strict data minimization principles. We do not store invasive keystroke recordings or precise GPS location tracks. Telemetry is limited to coarse country/city geolocation and hashed device signatures. Furthermore, our automated background task enforces a 30-day retention window, purging stale event telemetry to ensure GDPR compliance."
        )
    ]

    for question, owner, answer in qa_list:
        qa_card = [
            [
                Paragraph(f"<b>{question}</b>", table_cell_bold),
                Paragraph(f"<font color='#2563EB'><b>Lead: {owner}</b></font>", table_cell)
            ],
            [
                Paragraph(f"<b>Winning Answer:</b> {answer}", table_cell),
                ""
            ]
        ]
        t = Table(qa_card, colWidths=[430, 110])
        t.setStyle(TableStyle([
            ('SPAN', (0,1), (1,1)),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#E2E8F0")),
            ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ]))
        story.append(t)
        story.append(Spacer(1, 5))

    # ========================================================
    # QUICK DEMO CHEATSHEET (KEYS 1 TO 8)
    # ========================================================
    story.append(Spacer(1, 4))
    story.append(Paragraph("4. Keyboard Shortcut Cheatsheet for Speaker 3", h1_style))
    cheat_data = [
        [Paragraph("Key", table_header), Paragraph("Scenario Name", table_header), Paragraph("Target App", table_header), Paragraph("Score", table_header), Paragraph("Enforced Action", table_header)],
        [Paragraph("<b>1</b>", table_cell_bold), Paragraph("Normal Familiar Login", table_cell), Paragraph("Apex Bank", table_cell), Paragraph("<font color='#16A34A'><b>0</b></font>", table_cell), Paragraph("Frictionless Allow (JWT)", table_cell)],
        [Paragraph("<b>2</b>", table_cell_bold), Paragraph("First-Time Device Mismatch", table_cell), Paragraph("Apex Bank", table_cell), Paragraph("<font color='#D97706'><b>45</b></font>", table_cell), Paragraph("Tier 3 Email OTP + Device Trust", table_cell)],
        [Paragraph("<b>3</b>", table_cell_bold), Paragraph("Foreign Tor Attack at 3 AM", table_cell), Paragraph("Apex Bank", table_cell), Paragraph("<font color='#DC2626'><b>100</b></font>", table_cell), Paragraph("Tier 5 Critical Hard Block", table_cell)],
        [Paragraph("<b>4</b>", table_cell_bold), Paragraph("Brute-Force Password Burst", table_cell), Paragraph("Apex Bank", table_cell), Paragraph("<font color='#2563EB'><b>30</b></font>", table_cell), Paragraph("Tier 2 Turnstile CAPTCHA", table_cell)],
        [Paragraph("<b>5</b>", table_cell_bold), Paragraph("Cross-App Threat Correlation", table_cell), Paragraph("Pulse Social", table_cell), Paragraph("<font color='#2563EB'><b>40</b></font>", table_cell), Paragraph("Tier 2 Elevated Challenge", table_cell)],
        [Paragraph("<b>6</b>", table_cell_bold), Paragraph("Honeytoken Trap (backup_admin)", table_cell), Paragraph("Apex Bank", table_cell), Paragraph("<font color='#DC2626'><b>100</b></font>", table_cell), Paragraph("Tier 5 Block & IP Flagged in DB", table_cell)],
        [Paragraph("<b>7</b>", table_cell_bold), Paragraph("Baseline Adaptation (Enrolled)", table_cell), Paragraph("Apex Bank", table_cell), Paragraph("<font color='#16A34A'><b>0</b></font>", table_cell), Paragraph("Frictionless Allow (Post-Enroll)", table_cell)],
        [Paragraph("<b>8</b>", table_cell_bold), Paragraph("Impossible Travel (IN $\\rightarrow$ US)", table_cell), Paragraph("Apex Bank", table_cell), Paragraph("<font color='#EA580C'><b>70</b></font>", table_cell), Paragraph("Tier 4 Quarantine Verification", table_cell)],
    ]
    cheat_table = Table(cheat_data, colWidths=[30, 180, 95, 55, 180])
    cheat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,1), (0,-1), 'CENTER'),
        ('ALIGN', (3,1), (3,-1), 'CENTER'),
    ]))
    story.append(cheat_table)

    # Build PDF using custom NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")


if __name__ == "__main__":
    out_pdf = sys.argv[1] if len(sys.argv) > 1 else "DIGNITAS_JUDGE_PRESENTATION_PLAYBOOK.pdf"
    build_pdf(out_pdf)
