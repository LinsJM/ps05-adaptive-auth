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
    pdf_filename = "DIGNITAS_5MIN_TEAM_PRESENTATION_SCRIPT.pdf"
    workspace_path = os.path.abspath(pdf_filename)
    artifact_dir = r"C:\Users\niten_2e\.gemini\antigravity-ide\brain\e2cc44d5-93f8-4da0-9ec6-43002d38d9e9"
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

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        alignment=1, # Center
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SecHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=8,
        spaceAfter=4
    )

    speaker_badge_1 = ParagraphStyle(
        'Spk1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1D4ED8'), # Blue
        spaceBefore=10,
        spaceAfter=4
    )

    speaker_badge_2 = ParagraphStyle(
        'Spk2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#047857'), # Emerald
        spaceBefore=10,
        spaceAfter=4
    )

    speaker_badge_3 = ParagraphStyle(
        'Spk3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#7C3AED'), # Purple
        spaceBefore=10,
        spaceAfter=4
    )

    spoken_text = ParagraphStyle(
        'Spoken',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B'),
        leftIndent=12,
        spaceAfter=5
    )

    cue_text = ParagraphStyle(
        'ActionCue',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#B45309'), # Amber
        leftIndent=12,
        spaceAfter=4
    )

    meta_callout = ParagraphStyle(
        'MetaCall',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0F172A'),
        alignment=1
    )

    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#334155')
    )

    cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#0F172A')
    )

    elements = []

    # Title & Metadata
    elements.append(Paragraph("DIGNITAS PS05 — 5-MINUTE TEAM PRESENTATION SCRIPT", title_style))
    elements.append(Paragraph("<b>Exact Timing Guide for 3 Speakers</b> • Problem PS05: Adaptive Authentication & Real-Time Threat Mitigation", subtitle_style))

    # Overview Table
    summary_data = [
        [
            Paragraph("<b>Speaker 1</b><br/><b>0:00 – 1:35</b> (95 sec)<br/>Architecture &amp; 5 Tiers", meta_callout),
            Paragraph("<b>Speaker 2</b><br/><b>1:35 – 3:15</b> (100 sec)<br/>5 Threat Vectors &amp; Bank vs Social", meta_callout),
            Paragraph("<b>Speaker 3</b><br/><b>3:15 – 5:00</b> (105 sec)<br/>Live Demo, Phone Sim &amp; Recovery", meta_callout),
        ]
    ]
    t_summary = Table(summary_data, colWidths=[180, 180, 180])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t_summary)
    elements.append(Spacer(1, 8))

    # ================= SPEAKER 1 =================
    elements.append(Paragraph("🎙️ SPEAKER 1: Problem Statement & 5-Tier Graduated Architecture (0:00 – 1:35)", speaker_badge_1))
    elements.append(Paragraph("<i>Goal: Hook the judges, define Problem Statement PS05, explain why static passwords fail, and introduce our sub-10ms 5-tier architecture.</i>", cue_text))

    elements.append(Paragraph("<b>[0:00 – 0:30] The Core Problem:</b>", cue_text))
    elements.append(Paragraph('"Good morning respected judges. In modern cybersecurity, static username and password authentication is completely broken. Attackers deploy automated botnets, credential-stuffing lists from dark-web leaks, and residential proxy networks to impersonate users. However, forcing multi-factor authentication on every single login frustrates legitimate users, driving customer churn."', spoken_text))
    elements.append(Paragraph('"DIGNITAS solves Problem Statement PS05: a sub-10 millisecond Adaptive Authentication Gateway that evaluates incoming client telemetry in real time and applies the exact minimum friction needed to protect the account."', spoken_text))

    elements.append(Paragraph("<b>[0:30 – 1:10] The 5-Tier Graduated Threat Architecture:</b>", cue_text))
    elements.append(Paragraph('"Rather than a simplistic binary allow-or-block decision, DIGNITAS implements an explainable 5-Tier Risk Engine based on a 0 to 100 risk score:"', spoken_text))

    tier_table_data = [
        [Paragraph("<b>Tier</b>", cell_bold), Paragraph("<b>Score</b>", cell_bold), Paragraph("<b>Mitigation Action</b>", cell_bold), Paragraph("<b>Security Objective</b>", cell_bold)],
        [Paragraph("Tier 1: Allow", cell_bold), Paragraph("0 – 29", cell_style), Paragraph("Frictionless Passage (<10ms)", cell_style), Paragraph("Habitual pattern, trusted device, zero friction", cell_style)],
        [Paragraph("Tier 2: CAPTCHA", cell_bold), Paragraph("30 – 44", cell_style), Paragraph("Cloudflare Turnstile Proof-of-Work", cell_style), Paragraph("Neutralizes automated bot velocity & brute force", cell_style)],
        [Paragraph("Tier 3: Step-Up", cell_bold), Paragraph("45 – 59", cell_style), Paragraph("Phone Prompt (Yes/No) + Email OTP", cell_style), Paragraph("Enrolls & trusts first-time unrecognized devices", cell_style)],
        [Paragraph("Tier 4: Quarantine", cell_bold), Paragraph("60 – 79", cell_style), Paragraph("Session Quarantine & Out-of-Band Auth", cell_style), Paragraph("Quarantines supersonic impossible travel attempts", cell_style)],
        [Paragraph("Tier 5: Hard Block", cell_bold), Paragraph("80 – 100", cell_style), Paragraph("Block + IP Blacklist + Leaked Alert", cell_style), Paragraph("Terminates honeytoken hits & credential dumps", cell_style)],
    ]
    t_tiers = Table(tier_table_data, colWidths=[80, 50, 160, 250])
    t_tiers.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_tiers)
    elements.append(Spacer(1, 4))

    elements.append(Paragraph("<b>[1:10 – 1:35] Speed & Independence:</b>", cue_text))
    elements.append(Paragraph('"Our backend runs on Python FastAPI and SQLite with zero external cloud dependencies. It calculates IP subnet clustering, device fingerprints, and geographic velocity in just 4 to 15 milliseconds. I will now hand over to Speaker 2 to explain how we categorize real-time threats across banking and social applications."', spoken_text))

    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#E2E8F0'), spaceBefore=8, spaceAfter=8))

    # ================= SPEAKER 2 =================
    elements.append(Paragraph("🎙️ SPEAKER 2: The 5 Threat Vectors & Banking vs Social Policy (1:35 – 3:15)", speaker_badge_2))
    elements.append(Paragraph("<i>Goal: Detail the 5 login threat vectors, show our explainable scoring breakdown, and explain why Banking vs Social Media policies differ in risk tolerance.</i>", cue_text))

    elements.append(Paragraph("<b>[1:35 – 2:20] The 5 Threat Vectors in Real Time:</b>", cue_text))
    elements.append(Paragraph('"Thank you Speaker 1. DIGNITAS groups incoming threat signals into five distinct attack vectors:"', spoken_text))
    elements.append(Paragraph('<b>1. Credential Replay & Leaks:</b> Detects breached credentials matching dark-web dumps, phishing reverse proxies, and trips honeytoken decoys like our fake backup_admin account.<br/>'
                              '<b>2. Automated & High-Velocity Threats:</b> Identifies rapid brute-force bursts, credential stuffing from residential proxies, and headless browser automation.<br/>'
                              '<b>3. Device & Environment Posture:</b> Flags unverified hardware, rooted or jailbroken operating systems, and emulator environments.<br/>'
                              '<b>4. Network & Location Anomalies:</b> Flags Tor exit nodes, data center proxy subnets, and impossible supersonic travel speeds.<br/>'
                              '<b>5. Behavioral Anomalies & Session Hijacking:</b> Identifies abnormal login hours, sudden simultaneous attribute shifts, and cross-application correlated attacks.', spoken_text))

    elements.append(Paragraph("<b>[2:20 – 3:15] Policy Duality: Banking Zero-Trust vs Social Friction-Balancing:</b>", cue_text))
    elements.append(Paragraph('"A critical innovation of DIGNITAS is Adaptive Policy Profiling. A bank and a social network cannot treat risk the same way:"', spoken_text))

    policy_table_data = [
        [Paragraph("<b>Dimension</b>", cell_bold), Paragraph("<b>Apex Bank Profile (Zero-Trust)</b>", cell_bold), Paragraph("<b>Pulse Social Profile (Engagement)</b>", cell_bold)],
        [Paragraph("Risk Tolerance", cell_bold), Paragraph("<b>Low Tolerance</b>: Prioritizes fraud prevention over convenience", cell_style), Paragraph("<b>High Tolerance</b>: Prioritizes instant onboarding & engagement", cell_style)],
        [Paragraph("Primary Objective", cell_bold), Paragraph("Prevent wire fraud, balance drainage & regulatory fines", cell_style), Paragraph("Prevent spam botnets, brand hijacking & mass takeovers", cell_style)],
        [Paragraph("Unknown Device", cell_bold), Paragraph("Step-up out-of-band phone prompt; freezes wires for 24h", cell_style), Paragraph("One-time code; adds to active sessions with alert", cell_style)],
        [Paragraph("Velocity Anomaly", cell_bold), Paragraph("Immediate session quarantine or customer support block", cell_style), Paragraph("Invisible Turnstile CAPTCHA proof-of-work", cell_style)],
    ]
    t_policy = Table(policy_table_data, colWidths=[100, 220, 220])
    t_policy.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_policy)
    elements.append(Spacer(1, 4))
    elements.append(Paragraph('"Now Speaker 3 will demonstrate these defenses live using our interactive Gateway and iPhone simulator."', spoken_text))

    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#E2E8F0'), spaceBefore=8, spaceAfter=8))

    # ================= SPEAKER 3 =================
    elements.append(Paragraph("🎙️ SPEAKER 3: Live Attack Demos, Phone Simulator & Self-Service Recovery (3:15 – 5:00)", speaker_badge_3))
    elements.append(Paragraph("<i>Goal: Execute live scenario buttons on screen, show the interactive iPhone simulator buzzing with 'Yes/No' prompts, trigger impossible travel, and demonstrate self-service password recovery.</i>", cue_text))

    elements.append(Paragraph("<b>[3:15 – 3:45] Demo 1: Frictionless Passage vs Bot Defense:</b>", cue_text))
    elements.append(Paragraph("<b>[ACTION: Click Scenario 1 'Familiar Login']</b>", cue_text))
    elements.append(Paragraph('"Watch our live gateway in action. When Alice signs in from her familiar laptop in Delhi, our engine scores it 0 out of 100. Latency is just 6 milliseconds. She receives frictionless access without a single prompt."', spoken_text))
    elements.append(Paragraph("<b>[ACTION: Click Scenario 4 'Brute Force Defense']</b>", cue_text))
    elements.append(Paragraph('"Next, an attacker attempts repeated rapid logins with wrong passwords. The engine immediately flags repeated failure velocity, elevates risk to 30 points, and presents a Cloudflare Turnstile CAPTCHA challenge that bot scripts cannot bypass."', spoken_text))

    elements.append(Paragraph("<b>[3:45 – 4:25] Demo 2: Phone Simulator Interactive Prompt (Yes/No) & Impossible Travel:</b>", cue_text))
    elements.append(Paragraph("<b>[ACTION: Click Scenario 2 'New Device' & point to Phone Simulator]</b>", cue_text))
    elements.append(Paragraph('"Now, Alice signs in from an unrecognized mobile device. The engine flags Tier 3 (45 pts). Immediately, our iPhone 15 Pro simulator buzzes with an urgent security prompt: Was this you signing in? Notice the two interactive buttons: clicking [✓ Yes, it\'s me] permanently trusts the device into SQLite and logs her in. Clicking [✕ No, it\'s not me] instantly emergency-locks the account."', spoken_text))
    elements.append(Paragraph("<b>[ACTION: Click Scenario 8 'Impossible Velocity Travel']</b>", cue_text))
    elements.append(Paragraph('"Next, look at Scenario 8: an attacker attempts to log in from London just 15 minutes after Alice was active in Delhi. That requires supersonic aircraft speed. The engine intercepts this as Tier 4 Session Quarantine (70 pts). The user is alerted on their phone with one-click options to [🔒 Change Password] and [🚫 Blacklist Attacker IP] directly in SQLite."', spoken_text))

    elements.append(Paragraph("<b>[4:25 – 4:45] Demo 3: Honeytoken Trap & Self-Service Forgot Password:</b>", cue_text))
    elements.append(Paragraph("<b>[ACTION: Click Scenario 6 'Honeytoken Trap' then click 'Forgot password?']</b>", cue_text))
    elements.append(Paragraph('"When an intruder probes our decoy backup_admin honeytoken, the engine scores a lethal 100, hard-blocks the connection, and permanently blacklists the IP."', spoken_text))
    elements.append(Paragraph('"Finally, we built end-to-end self-service recovery: clicking [Forgot password?] dispatches a 6-digit recovery PIN directly to the phone simulator, allowing the legitimate user to restore access in seconds without needing IT support."', spoken_text))

    elements.append(Paragraph("<b>[4:45 – 5:00] Conclusion & Judge Wrap-Up:</b>", cue_text))
    elements.append(Paragraph('"To conclude: DIGNITAS is not a prototype mock-up. It is a production-grade, explainable, sub-10ms adaptive security suite with 100% test accuracy, live smartphone simulation, dual-app threat profiling, and complete deployment readiness. Thank you for your time, and we look forward to your questions!"', spoken_text))

    doc.build(elements)
    print(f"[SUCCESS] PDF generated at: {workspace_path}")

    # Copy to artifact dir as well
    if os.path.exists(artifact_dir):
        import shutil
        shutil.copy2(workspace_path, artifact_path)
        print(f"[SUCCESS] PDF copied to artifact directory: {artifact_path}")

if __name__ == "__main__":
    build_pdf()
