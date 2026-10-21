/**
 * DIGNITAS: Checkpoint & Border-Control Adaptive Gateway
 * Interactive Controller: 5-Tier Segmented Gauge, Explainable Reasons, 
 * Functional Challenge Panel, Scenarios 1–8 with Keyboard Shortcuts, and SOC Telemetry.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let currentApp = 'bank';
  let currentFilter = 'all';
  let activeChallenge = null;
  let lastScore = 0;
  const API_BASE = (window.location.protocol === 'file:') ? 'http://127.0.0.1:8000' : '';

  // DOM Elements - Header Navigation & Telemetry
  const globalLatencyVal = document.getElementById('global-latency-val');
  const btnTopReset = document.getElementById('btn-top-reset');
  const btnDockReset = document.getElementById('btn-dock-reset');

  // DOM Elements - Telemetry Drawer
  const btnToggleTelemetry = document.getElementById('btn-toggle-telemetry');
  const btnCloseTelemetry = document.getElementById('btn-close-telemetry');
  const telemetryDrawer = document.getElementById('telemetry-drawer');
  const summaryTelemetry = document.getElementById('summary-telemetry');
  const ctxIp = document.getElementById('ctx-ip');
  const ctxDevice = document.getElementById('ctx-device');
  const ctxCity = document.getElementById('ctx-city');
  const ctxCountry = document.getElementById('ctx-country');
  const ctxHour = document.getElementById('ctx-hour');
  const ctxMins = document.getElementById('ctx-mins');
  const ctxVpn = document.getElementById('ctx-vpn');

  // DOM Elements - Customer App Login Form
  const appShell = document.getElementById('app-shell');
  const pillBank = document.getElementById('pill-bank');
  const pillSocial = document.getElementById('pill-social');
  const logoBank = document.getElementById('logo-bank');
  const logoSocial = document.getElementById('logo-social');
  const appHeadingText = document.getElementById('app-heading-text');
  const appSubheadText = document.getElementById('app-subhead-text');
  const formCustomerLogin = document.getElementById('form-customer-login');
  const inputEmail = document.getElementById('input-email');
  const inputPassword = document.getElementById('input-password');
  const btnAppSignin = document.getElementById('btn-app-signin');
  const btnFillAlice = document.getElementById('btn-fill-alice');
  const btnFillBob = document.getElementById('btn-fill-bob');
  const btnFillHoney = document.getElementById('btn-fill-honey');

  // DOM Elements - Decision Panel & Gauge
  const bannerDecisionBadge = document.getElementById('banner-decision-badge');
  const bannerHeadline = document.getElementById('banner-headline');
  const displayScore = document.getElementById('display-score');
  const displayLatency = document.getElementById('display-latency');
  const gaugePin = document.getElementById('gauge-pin');
  const pinTooltip = document.getElementById('pin-tooltip');
  const reasonsStack = document.getElementById('reasons-stack');

  // DOM Elements - Verification / Challenge & Threat HUD
  const panelStateIdle = document.getElementById('panel-state-idle');
  const panelStateActive = document.getElementById('panel-state-active');
  const panelStateThreat = document.getElementById('panel-state-threat');
  const threatOriginFlag = document.getElementById('threat-origin-flag');
  const threatOriginCity = document.getElementById('threat-origin-city');
  const threatOriginIp = document.getElementById('threat-origin-ip');
  const threatDestServer = document.getElementById('threat-dest-server');
  const activeChallengeType = document.getElementById('active-challenge-type');
  const activeChallengeUser = document.getElementById('active-challenge-user');
  const activeChallengeContent = document.getElementById('active-challenge-content');

  // DOM Elements - Incoming Email Notification Toast & Modal
  const mailToastContainer = document.getElementById('mail-toast-container');
  const emailModalBackdrop = document.getElementById('email-modal-backdrop');
  const btnCloseEmailModal = document.getElementById('btn-close-email-modal');
  const emailModalTo = document.getElementById('email-modal-to');
  const emailModalSubject = document.getElementById('email-modal-subject');
  const emailModalDate = document.getElementById('email-modal-date');
  const emailModalPasscode = document.getElementById('email-modal-passcode');
  const emailModalApp = document.getElementById('email-modal-app');
  const emailModalDevice = document.getElementById('email-modal-device');
  const emailModalLoc = document.getElementById('email-modal-loc');
  const emailModalIp = document.getElementById('email-modal-ip');
  const btnModalUseCode = document.getElementById('btn-modal-use-code');

  // DOM Elements - Target Enrollment Modal
  const btnOpenEnrollModal = document.getElementById('btn-open-enroll-modal');
  const targetModalBackdrop = document.getElementById('target-modal-backdrop');
  const btnCloseTargetModal = document.getElementById('btn-close-target-modal');
  const btnCancelTargetModal = document.getElementById('btn-cancel-target-modal');
  const btnSubmitEnrollTarget = document.getElementById('btn-submit-enroll-target');
  const inputTargetEmail = document.getElementById('input-target-email');
  const inputTargetDevice = document.getElementById('input-target-device');
  const inputTargetPassword = document.getElementById('input-target-password');

  // DOM Elements - SMTP Settings Modal
  const btnOpenSmtp = document.getElementById('btn-open-smtp');
  const smtpModalBackdrop = document.getElementById('smtp-modal-backdrop');
  const btnCloseSmtpModal = document.getElementById('btn-close-smtp-modal');
  const btnSaveSmtp = document.getElementById('btn-save-smtp');
  const btnTestSmtp = document.getElementById('btn-test-smtp');
  const inputSmtpHost = document.getElementById('input-smtp-host');
  const inputSmtpPort = document.getElementById('input-smtp-port');
  const inputSmtpUser = document.getElementById('input-smtp-user');
  const inputSmtpPass = document.getElementById('input-smtp-pass');
  const inputSmtpFrom = document.getElementById('input-smtp-from');
  const smtpStatusFeedback = document.getElementById('smtp-status-feedback');

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }



  function setCustomerApp(app) {
    currentApp = app;
    const policyBadge = document.getElementById('policy-badge');
    const policyDetail = document.getElementById('policy-detail');
    const appPolicyBanner = document.getElementById('app-policy-banner');

    if (app === 'social') {
      pillBank.classList.remove('active');
      pillSocial.classList.add('active');
      logoBank.classList.add('hidden');
      logoSocial.classList.remove('hidden');
      appShell.classList.add('app-social');
      appHeadingText.textContent = 'Pulse Social Network';
      appSubheadText.textContent = 'User Social Identity Gateway';

      if (policyBadge && policyDetail && appPolicyBanner) {
        policyBadge.innerHTML = '⚡ SOCIAL ENGAGEMENT-BALANCED';
        policyDetail.textContent = 'High Tolerance • Invisible Turnstile Proof-of-Work • Active Session Alerts';
        appPolicyBanner.style.background = 'rgba(124, 58, 237, 0.2)';
        appPolicyBanner.style.borderColor = 'rgba(167, 139, 250, 0.35)';
      }
    } else {
      pillSocial.classList.remove('active');
      pillBank.classList.add('active');
      logoSocial.classList.add('hidden');
      logoBank.classList.remove('hidden');
      appShell.classList.remove('app-social');
      appHeadingText.textContent = 'Apex Trust Bank';
      appSubheadText.textContent = 'Client Online Financial Portal';

      if (policyBadge && policyDetail && appPolicyBanner) {
        policyBadge.innerHTML = '🏛️ BANK ZERO-TRUST';
        policyDetail.textContent = 'Low Tolerance • Wire Lock on Unknown Endpoints • Out-of-Band Phone Verify';
        appPolicyBanner.style.background = 'rgba(30, 58, 138, 0.25)';
        appPolicyBanner.style.borderColor = 'rgba(59, 130, 246, 0.35)';
      }
    }
  }

  pillBank.addEventListener('click', () => setCustomerApp('bank'));
  pillSocial.addEventListener('click', () => setCustomerApp('social'));

  // -------------------------------------------------------------
  // 2. Simulated Telemetry Drawer
  // -------------------------------------------------------------
  function updateTelemetrySummary() {
    const city = ctxCity.value.trim() || 'Delhi';
    const country = ctxCountry.value.trim() || 'IN';
    const dev = ctxDevice.value.trim() || 'dev-unknown';
    const ip = ctxIp.value.trim() || '127.0.0.1';
    const hour = ctxHour.value !== '' ? `${ctxHour.value}:00 UTC` : '10:00 UTC';
    const vpn = ctxVpn.checked ? ' • [VPN/Tor Node]' : '';
    summaryTelemetry.textContent = `${city}, ${country} • ${dev} (${ip}) • ${hour}${vpn}`;
  }

  btnToggleTelemetry.addEventListener('click', () => {
    telemetryDrawer.classList.toggle('open');
  });

  btnCloseTelemetry.addEventListener('click', () => {
    telemetryDrawer.classList.remove('open');
  });

  [ctxIp, ctxDevice, ctxCity, ctxCountry, ctxHour, ctxMins, ctxVpn].forEach(el => {
    el.addEventListener('change', updateTelemetrySummary);
    el.addEventListener('input', updateTelemetrySummary);
  });

  function getClientTelemetry() {
    return {
      ip_address: ctxIp.value.trim() || '127.0.0.1',
      device_id: ctxDevice.value.trim() || 'dev-unknown',
      city: ctxCity.value.trim() || 'Delhi',
      country: ctxCountry.value.trim() || 'IN',
      hour: ctxHour.value !== '' ? parseInt(ctxHour.value, 10) : 10,
      minutes_since_last_login: ctxMins.value !== '' ? parseInt(ctxMins.value, 10) : null,
      is_vpn: ctxVpn.checked
    };
  }

  // Quick User Fill Buttons
  btnFillAlice.addEventListener('click', () => {
    inputEmail.value = 'alice@example.com';
    inputPassword.value = 'Password123!';
    ctxIp.value = '103.21.244.2';
    ctxDevice.value = 'dev-alice-laptop';
    ctxCity.value = 'Delhi';
    ctxCountry.value = 'IN';
    ctxHour.value = 10;
    ctxMins.value = '';
    ctxVpn.checked = false;
    updateTelemetrySummary();
  });

  btnFillBob.addEventListener('click', () => {
    inputEmail.value = 'bob@example.com';
    inputPassword.value = 'Password123!';
    ctxIp.value = '103.21.244.2';
    ctxDevice.value = 'dev-bob-laptop';
    ctxCity.value = 'Delhi';
    ctxCountry.value = 'IN';
    ctxHour.value = 10;
    ctxMins.value = '';
    ctxVpn.checked = false;
    updateTelemetrySummary();
  });

  btnFillHoney.addEventListener('click', () => {
    inputEmail.value = 'backup_admin';
    inputPassword.value = 'AdminSecret2024!';
    ctxIp.value = '45.154.255.99';
    ctxDevice.value = 'dev-honeypot-bot';
    ctxCity.value = 'St. Petersburg';
    ctxCountry.value = 'RU';
    ctxHour.value = 1;
    ctxMins.value = '';
    ctxVpn.checked = true;
    updateTelemetrySummary();
  });

  // -------------------------------------------------------------
  // 3. API Communication
  // -------------------------------------------------------------
  async function apiLogin(payload) {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async function apiVerifyPrompt(payload) {
    const res = await fetch(`${API_BASE}/api/verify-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async function apiVerifyStepUp(payload) {
    const res = await fetch(`${API_BASE}/api/verify-stepup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async function apiResetDemo() {
    const res = await fetch(`${API_BASE}/api/dashboard/reset-demo`, { method: 'POST' });
    return await res.json();
  }

  // -------------------------------------------------------------
  // 4. Form Submission & Evaluation Pipeline
  // -------------------------------------------------------------
  formCustomerLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    await executeLoginEvaluation(inputEmail.value.trim(), inputPassword.value);
  });

  async function executeLoginEvaluation(email, password) {
    btnAppSignin.disabled = true;
    btnAppSignin.textContent = 'Evaluating Risk Policy...';

    const telem = getClientTelemetry();
    const payload = {
      app_id: currentApp,
      email: email,
      password: password,
      ...telem
    };

    try {
      const data = await apiLogin(payload);
      applyEvaluationResult(data, email);
    } catch (err) {
      console.error('Login evaluation failed:', err);
      bannerHeadline.textContent = 'Evaluation Gateway Error';
    } finally {
      btnAppSignin.disabled = false;
      btnAppSignin.textContent = 'Sign In';
    }
  }

  // -------------------------------------------------------------
  // 5. Dynamic Decision Rendering & Signature Gauge Animation
  // -------------------------------------------------------------
  function applyEvaluationResult(data, email) {
    const score = Number.isFinite(data.score) ? data.score : (data.risk_score || 0);
    const latency = (data.latency_ms !== undefined && data.latency_ms !== null) ? Number(data.latency_ms).toFixed(1) : '8.4';

    // 1. Unified Real Per-Decision Latency Display
    displayLatency.textContent = `${latency} ms`;
    globalLatencyVal.textContent = `${latency} ms`;

    // 2. Animate Score Counter (Readable from 3 meters!)
    animateScoreCounter(lastScore, score);
    lastScore = score;

    // 3. Move Segmented Risk Gauge Needle Pin
    const clampedScore = Math.max(0, Math.min(100, score));
    gaugePin.style.left = `${clampedScore}%`;
    pinTooltip.textContent = `${score}`;

    // 4. Update Decision Badge & Projector Headline
    updateDecisionBanner(data.action, data.decision, score, data.message);

    // 5. Render Explainable Named Reasons with Points
    renderExplainableReasons(data.reasons || []);

    // 6. Handle Step-Up Verification Challenge Box
    handleChallengeDisplay(data, email);
  }

  function animateScoreCounter(fromVal, toVal) {
    const duration = 500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(fromVal + (toVal - fromVal) * ease);
      displayScore.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        displayScore.textContent = toVal;
      }
    }
    requestAnimationFrame(step);

    // Dynamic Colorize Score Digits
    if (toVal < 30) {
      displayScore.style.color = '#166534';
    } else if (toVal < 45) {
      displayScore.style.color = '#92400E';
    } else if (toVal < 61) {
      displayScore.style.color = '#9A3412';
    } else if (toVal < 80) {
      displayScore.style.color = '#9F1239';
    } else {
      displayScore.style.color = '#7F1D1D';
    }
  }

  function updateDecisionBanner(action, decision, score, message) {
    bannerDecisionBadge.className = 'decision-badge';

    if (action === 'block' || decision === 'restrict' || score >= 80) {
      bannerDecisionBadge.classList.add('badge-block');
      bannerDecisionBadge.textContent = 'BLOCK & ADVISORY (80–100)';
      bannerHeadline.textContent = 'Intrusion Blocked • Breach Alert Dispatched';
    } else if (action === 'quarantine_verify' || action === 'otp_password_reset' || score >= 60) {
      bannerDecisionBadge.classList.add('badge-reset');
      bannerDecisionBadge.textContent = 'SESSION QUARANTINE (60–79)';
      bannerHeadline.textContent = 'High-Risk Anomaly • Out-of-Band Approval';
    } else if (action === 'email_otp' || score >= 45) {
      bannerDecisionBadge.classList.add('badge-otp');
      bannerDecisionBadge.textContent = 'EMAIL OTP & TRUST (45–59)';
      bannerHeadline.textContent = 'Step-Up MFA & Device Enrollment';
    } else if (action === 'captcha' || score >= 30) {
      bannerDecisionBadge.classList.add('badge-captcha');
      bannerDecisionBadge.textContent = 'CAPTCHA (30–44)';
      bannerHeadline.textContent = 'Human Presence Bot Verification';
    } else {
      bannerDecisionBadge.classList.add('badge-allow');
      bannerDecisionBadge.textContent = 'ALLOW (0–29)';
      bannerHeadline.textContent = 'Frictionless Sign-In Approved (<10ms)';
    }
  }

  function renderExplainableReasons(reasons) {
    reasonsStack.innerHTML = '';

    if (!reasons || reasons.length === 0) {
      reasonsStack.innerHTML = `
        <div class="empty-reasons-state">
          No anomaly detected. Client baseline matches historic trusted pattern (0 risk points).
        </div>
      `;
      return;
    }

    // Normalize and sort reasons descending by points
    const normalized = reasons.map(r => {
      if (typeof r === 'object' && r !== null) {
        return {
          points: typeof r.points === 'number' ? r.points : 0,
          signal: r.signal || 'RISK_SIGNAL',
          detail: r.detail || JSON.stringify(r),
          category: r.category || null
        };
      } else {
        // String format parsing
        const str = String(r);
        const match = str.match(/\+(\d+)/);
        const pts = match ? parseInt(match[1], 10) : 0;
        return {
          points: pts,
          signal: 'TELEMETRY_ANOMALY',
          detail: str,
          category: null
        };
      }
    });

    // Sort descending by risk points
    normalized.sort((a, b) => b.points - a.points);

    normalized.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'reason-item';
      row.style.animationDelay = `${index * 60}ms`;

      let ptsClass = 'pts-low';
      if (item.points >= 40) ptsClass = 'pts-high';
      else if (item.points >= 20) ptsClass = 'pts-med';
      else if (item.points === 0) ptsClass = 'pts-zero';

      const signStr = item.points >= 0 ? `+${item.points}` : `${item.points}`;
      const categoryTag = item.category
        ? `<span class="reason-category-tag" style="display:inline-block; font-size:0.67rem; font-weight:700; background:rgba(59, 130, 246, 0.15); border:1px solid rgba(59, 130, 246, 0.35); padding:1px 6px; border-radius:4px; margin-left:6px; color:#93C5FD;">${escapeHtml(item.category)}</span>`
        : '';

      row.innerHTML = `
        <div class="reason-points-badge ${ptsClass}">${signStr} pts</div>
        <div class="reason-content">
          <div class="reason-signal" style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
            <span>${escapeHtml(item.signal.toUpperCase())}</span>
            ${categoryTag}
          </div>
          <div class="reason-detail">${escapeHtml(item.detail)}</div>
        </div>
      `;
      reasonsStack.appendChild(row);
    });
  }

  // -------------------------------------------------------------
  // 6. Challenge & Verification Panel (Realism Upgrades)
  // -------------------------------------------------------------

  // Country Flag Helper
  function getCountryFlag(cc) {
    if (!cc) return '🌐';
    const flags = {
      'IN': '🇮🇳', 'RU': '🇷🇺', 'US': '🇺🇸', 'GB': '🇬🇧',
      'UK': '🇬🇧', 'DE': '🇩🇪', 'CN': '🇨🇳', 'SG': '🇸🇬',
      'NL': '🇳🇱', 'FR': '🇫🇷', 'CA': '🇨🇦', 'AU': '🇦🇺', 'JP': '🇯🇵'
    };
    return flags[cc.toUpperCase().trim()] || '🌐';
  }

  // Slide-in Mail / Threat Notification Toast
  function showMailToast({ type, email, otp, app, device, loc, ip }) {
    if (!mailToastContainer) return;

    const toast = document.createElement('div');
    const isThreat = type === 'threat';
    const isQuarantine = type === 'quarantine';
    toast.className = `mail-toast ${isThreat ? 'mail-toast-threat' : (isQuarantine ? 'mail-toast-quarantine' : '')}`;

    const appName = app === 'bank' ? 'Apex Trust Bank' : 'Pulse Social';

    let senderBadge = '✉️ DIGNITAS IDENTITY MAIL';
    let subjectText = '🔐 Your Single-Use Sign-In Passcode';
    let snippetHtml = `Authentication challenge for <strong>${escapeHtml(appName)}</strong>. Enter the 6-digit code below to verify your login and trust this device.`;

    if (isThreat) {
      senderBadge = '🚨 DIGNITAS INTRUSION MITIGATOR';
      subjectText = '🚨 Critical Security Alert: Suspicious sign-in blocked';
      snippetHtml = `Blocked unauthorized sign-in on <strong>${escapeHtml(appName)}</strong> for <code>${escapeHtml(email)}</code> from IP <code>${escapeHtml(ip || '185.220.101.5')}</code>.<br><br>⚠️ <strong>Password Compromised:</strong> The intruder possessed your correct password. We blocked them, but please reset your password immediately.`;
    } else if (isQuarantine) {
      senderBadge = '⚠️ DIGNITAS SESSION QUARANTINE';
      subjectText = '⚠️ Urgent Security Notice: Unusual sign-in quarantined';
      snippetHtml = `Unusual sign-in from <code>${escapeHtml(loc || 'Foreign')}</code> (IP <code>${escapeHtml(ip || 'Unknown')}</code>). High-risk anomaly detected. This session is in <strong>Quarantine</strong>. Out-of-band email approval required.`;
    }

    toast.innerHTML = `
      <div class="mail-toast-header">
        <div class="toast-sender-badge">
          ${senderBadge}
        </div>
        <button class="toast-btn-close" title="Dismiss notification">✕</button>
      </div>
      <div class="mail-toast-body">
        <div class="toast-subject">${subjectText}</div>
        <div class="toast-snippet">
          ${snippetHtml}
        </div>
        ${!isThreat && otp ? `
          <div class="toast-passcode-callout">
            <span class="toast-passcode-value">${escapeHtml(otp)}</span>
            <button class="toast-btn-copy" id="toast-btn-copy-action">${isQuarantine ? '✓ Approve Session' : '📋 Copy Passcode'}</button>
          </div>
        ` : ''}
      </div>
      <div class="mail-toast-footer">
        <span class="toast-time">Just now</span>
        <div class="toast-actions-right">
          ${!isThreat ? `<button class="toast-btn-view" id="toast-btn-view-action">✉️ View Email</button>` : `<a href="soc.html" class="toast-btn-view" style="text-decoration:none;">Inspect SOC Feed →</a>`}
        </div>
      </div>
    `;

    // Close button
    toast.querySelector('.toast-btn-close').addEventListener('click', () => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    });

    // Copy Passcode Action
    if (!isThreat && otp) {
      const copyBtn = toast.querySelector('#toast-btn-copy-action');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(otp).catch(() => {});
          }
          copyBtn.textContent = isQuarantine ? '✓ Approved!' : '✓ Copied & Filled!';
          copyBtn.style.background = '#15803D';
          fillAndSubmitOtp(otp);
        });
      }

      const viewBtn = toast.querySelector('#toast-btn-view-action');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          openEmailModal({ email, otp, app, device, loc, ip });
        });
      }
    }

    mailToastContainer.appendChild(toast);

    // Auto dismiss after 14 seconds
    setTimeout(() => {
      if (toast.isConnected) {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
      }
    }, 14000);
  }

  // Open Corporate Email Modal
  let currentModalOtp = null;
  function openEmailModal({ email, otp, app, device, loc, ip }) {
    if (!emailModalBackdrop) return;
    currentModalOtp = otp;
    if (emailModalTo) emailModalTo.textContent = email || 'user@example.com';
    if (emailModalPasscode) emailModalPasscode.textContent = otp || '849201';
    if (emailModalApp) emailModalApp.textContent = app === 'bank' ? 'Apex Trust Bank' : 'Pulse Social Network';
    if (emailModalDevice) emailModalDevice.textContent = device || 'Unknown Device';
    if (emailModalLoc) emailModalLoc.textContent = loc || 'Delhi, India';
    if (emailModalIp) emailModalIp.textContent = ip || '103.21.244.2';
    if (emailModalDate) emailModalDate.textContent = `Today at ${new Date().toLocaleTimeString()} (Just now)`;
    emailModalBackdrop.classList.remove('hidden');
  }

  function closeEmailModal() {
    if (emailModalBackdrop) emailModalBackdrop.classList.add('hidden');
  }

  if (btnCloseEmailModal) {
    btnCloseEmailModal.addEventListener('click', closeEmailModal);
  }

  if (emailModalBackdrop) {
    emailModalBackdrop.addEventListener('click', (e) => {
      if (e.target === emailModalBackdrop) closeEmailModal();
    });
  }

  if (btnModalUseCode) {
    btnModalUseCode.addEventListener('click', () => {
      if (currentModalOtp) {
        fillAndSubmitOtp(currentModalOtp);
      }
      closeEmailModal();
    });
  }

  function fillAndSubmitOtp(otp) {
    const digits = String(otp).split('');
    const pinInputs = Array.from(document.querySelectorAll('.pin-digit'));
    if (pinInputs.length > 0) {
      pinInputs.forEach((input, idx) => {
        input.value = digits[idx] || '';
      });
      submitOtpVerification(otp);
    } else {
      submitOtpVerification(otp);
    }
  }

  // -------------------------------------------------------------
  // 5AA. Web Audio API Notification Synthesizer (Zero-Asset Apple Chime)
  // -------------------------------------------------------------
  function playNotificationChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Note 1: E6 (~1318.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1318.5, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: B6 (~1975.5 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1975.5, now + 0.08);
      gain2.gain.setValueAtTime(0.26, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.warn('Notification chime error:', e);
    }
  }

  // -------------------------------------------------------------
  // 5AB. Smartphone Simulator (iPhone 15 Pro) Controller
  // -------------------------------------------------------------
  const deliveryModePill = document.getElementById('delivery-mode-pill');
  const deliveryModeText = document.getElementById('delivery-mode-text');
  const btnTogglePhone = document.getElementById('btn-toggle-phone');
  const phoneSimulatorDrawer = document.getElementById('phone-simulator-drawer');
  const btnClosePhone = document.getElementById('btn-close-phone');
  const phoneClockStatus = document.getElementById('phone-clock-status');
  const phoneLockClock = document.getElementById('phone-lock-clock');
  const phoneLockDate = document.getElementById('phone-lock-date');
  const phoneViewLock = document.getElementById('phone-view-lock');
  const phoneViewGmail = document.getElementById('phone-view-gmail');
  const phonePushNotification = document.getElementById('phone-push-notification');
  const pushTitle = document.getElementById('push-title');
  const pushBody = document.getElementById('push-body');
  const pushOtpHighlight = document.getElementById('push-otp-highlight');
  const btnGmailBack = document.getElementById('btn-gmail-back');
  const phoneGmailSubject = document.getElementById('phone-gmail-subject');
  const gmailToAddr = document.getElementById('gmail-to-addr');
  const gmailOtpDigits = document.getElementById('gmail-otp-digits');
  const phoneSpecApp = document.getElementById('phone-spec-app');
  const phoneSpecDevice = document.getElementById('phone-spec-device');
  const phoneSpecLoc = document.getElementById('phone-spec-loc');
  const btnPhoneAutofill = document.getElementById('btn-phone-autofill');

  let currentPhoneOtp = '849201';

  function updatePhoneClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${mins}`;
    if (phoneClockStatus) phoneClockStatus.textContent = timeStr;
    if (phoneLockClock) phoneLockClock.textContent = timeStr;

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    if (phoneLockDate) phoneLockDate.textContent = now.toLocaleDateString('en-US', options);
  }
  updatePhoneClock();
  setInterval(updatePhoneClock, 30000);

  function setPhoneDeliveryMode(mode) {
    if (!deliveryModePill || !deliveryModeText) return;
    if (mode === 'live_smtp' || mode === 'smtp') {
      deliveryModePill.classList.add('mode-live');
      deliveryModeText.textContent = 'RELAY: LIVE GMAIL';
      deliveryModePill.title = 'Active Live SMTP: Outbound security alerts dispatch directly to user inbox';
    } else {
      deliveryModePill.classList.remove('mode-live');
      deliveryModeText.textContent = 'RELAY: SIMULATOR';
      deliveryModePill.title = 'Offline Simulation: Security alerts arrive on simulated iPhone 15 Pro';
    }
  }

  async function checkInitialDeliveryMode() {
    try {
      const res = await fetch(`${API_BASE}/api/settings/smtp`);
      if (res.ok) {
        const data = await res.json();
        setPhoneDeliveryMode(data.configured ? 'live_smtp' : 'simulated');
      }
    } catch (e) {}
  }
  checkInitialDeliveryMode();

  function togglePhoneSimulator(forceOpen = null) {
    if (!phoneSimulatorDrawer) return;
    const shouldOpen = forceOpen !== null ? forceOpen : phoneSimulatorDrawer.classList.contains('hidden');
    if (shouldOpen) {
      phoneSimulatorDrawer.classList.remove('hidden');
      if (btnTogglePhone) btnTogglePhone.classList.add('active');
    } else {
      phoneSimulatorDrawer.classList.add('hidden');
      if (btnTogglePhone) btnTogglePhone.classList.remove('active');
    }
  }

  if (btnTogglePhone) {
    btnTogglePhone.addEventListener('click', () => togglePhoneSimulator());
  }

  if (btnClosePhone) {
    btnClosePhone.addEventListener('click', () => togglePhoneSimulator(false));
  }

  if (phonePushNotification) {
    phonePushNotification.addEventListener('click', () => {
      if (phoneViewLock) phoneViewLock.classList.add('hidden');
      if (phoneViewGmail) phoneViewGmail.classList.remove('hidden');
    });
  }

  if (btnGmailBack) {
    btnGmailBack.addEventListener('click', () => {
      if (phoneViewGmail) phoneViewGmail.classList.add('hidden');
      if (phoneViewLock) phoneViewLock.classList.remove('hidden');
    });
  }

  if (btnPhoneAutofill) {
    btnPhoneAutofill.addEventListener('click', () => {
      btnPhoneAutofill.textContent = '✓ Auto-Filled & Verifying...';
      btnPhoneAutofill.style.background = '#15803D';
      fillAndSubmitOtp(currentPhoneOtp);
      setTimeout(() => {
        btnPhoneAutofill.textContent = '📋 Auto-Fill Passcode on Laptop';
        btnPhoneAutofill.style.background = '#2563EB';
      }, 2500);
    });
  }

  let lastAttackerIp = '185.220.101.5';
  let lastTargetEmail = 'alice@example.com';

  function triggerPhoneSimulatorAlert({ email, otp, app, device, loc, ip, deliveryMode, score = 0, action = 'allow', anomaly = '' }) {
    currentPhoneOtp = otp || '849201';
    lastAttackerIp = ip || '185.220.101.5';
    lastTargetEmail = email || (inputEmail ? inputEmail.value.trim() : 'alice@example.com') || 'alice@example.com';

    if (deliveryMode) setPhoneDeliveryMode(deliveryMode);

    const appDisplayName = app === 'bank' ? 'Apex Trust Bank' : 'Pulse Social';
    const isResetReq = action === 'password_reset_request' || deliveryMode === 'password_reset_request' || anomaly === 'password_reset_request';
    const isThreat = !isResetReq && (action === 'block' || score >= 80);
    const isQuarantine = !isResetReq && (action === 'quarantine_verify' || action === 'otp_password_reset' || score >= 60);
    const isNewDevice = !isResetReq && !isThreat && !isQuarantine && (action === 'email_otp' || score >= 45);

    const btnPhoneResetAction = document.getElementById('btn-phone-reset-action');

    // 1. Lock screen Push Banner
    if (pushTitle) {
      if (isResetReq) {
        pushTitle.textContent = `🔐 Password Recovery Request`;
      } else if (isThreat) {
        pushTitle.textContent = `🚨 Critical Alert: Sign-In Blocked!`;
      } else if (isQuarantine) {
        pushTitle.textContent = `⚠️ Security Alert: Session Quarantined`;
      } else {
        pushTitle.textContent = `🔔 New Sign-In from Unrecognized Device`;
      }
    }

    if (pushOtpHighlight) {
      pushOtpHighlight.textContent = (isNewDevice || isResetReq) ? currentPhoneOtp : 'ALERT';
    }

    if (pushBody) {
      if (isResetReq) {
        pushBody.innerHTML = `Password recovery requested for <strong>${escapeHtml(lastTargetEmail)}</strong>. PIN: <strong class="push-code-highlight">${escapeHtml(currentPhoneOtp)}</strong>. Tap to reset.`;
      } else if (isThreat) {
        pushBody.innerHTML = `Intruder attempted sign-in with your password from <strong>${escapeHtml(loc || 'Moscow, RU')}</strong> (IP: ${escapeHtml(lastAttackerIp)}). Your credentials may be compromised!`;
      } else if (isQuarantine) {
        pushBody.innerHTML = `High-speed location jump detected from <strong>${escapeHtml(loc)}</strong> (IP: ${escapeHtml(lastAttackerIp)}). Out-of-band authorization required.`;
      } else {
        pushBody.innerHTML = `Sign-in attempt from <strong>${escapeHtml(device || 'Unrecognized Laptop')}</strong> in ${escapeHtml(loc || 'Delhi, IN')}. Passcode: <strong class="push-code-highlight">${escapeHtml(currentPhoneOtp)}</strong>.`;
      }
    }

    // 2. Gmail / Alert View Details
    if (gmailToAddr) gmailToAddr.textContent = lastTargetEmail;
    if (phoneSpecApp) phoneSpecApp.textContent = appDisplayName;
    if (phoneSpecDevice) phoneSpecDevice.textContent = device || 'dev-demo-laptop-unrecognized';
    if (phoneSpecLoc) phoneSpecLoc.textContent = loc || 'Delhi, India';
    const phoneSpecIpEl = document.getElementById('phone-spec-ip');
    if (phoneSpecIpEl) phoneSpecIpEl.textContent = lastAttackerIp;
    const phoneSpecAnomalyEl = document.getElementById('phone-spec-anomaly');
    if (phoneSpecAnomalyEl) {
      phoneSpecAnomalyEl.textContent = anomaly || (isResetReq ? 'Self-Service Password Reset (+0 pts)' : (isThreat ? 'Compromised Password / Malicious Proxy (+95 pts)' : (isQuarantine ? 'Impossible Velocity Travel (+70 pts)' : 'Hardware Baseline Mismatch (+45 pts)')));
    }

    const phonePromptBox = document.getElementById('phone-prompt-box');
    const phoneThreatCard = document.getElementById('phone-threat-card');
    const phoneThreatTitle = document.getElementById('phone-threat-title');
    const phoneThreatMsg = document.getElementById('phone-threat-msg');
    const phoneOtpBox = document.getElementById('phone-otp-box');
    const btnPhoneAutofillEl = document.getElementById('btn-phone-autofill');
    const btnPhoneApproveQuarantine = document.getElementById('btn-phone-approve-quarantine');
    const phoneLeadText = document.getElementById('phone-lead-text');
    const phoneCorpTitle = document.getElementById('phone-corp-title');
    const phoneCorpBadge = document.getElementById('phone-corp-badge');
    const phoneGmailSubject = document.getElementById('phone-gmail-subject');

    if (isResetReq) {
      // Password Reset Mode
      if (phoneCorpTitle) phoneCorpTitle.textContent = 'DIGNITAS RECOVERY';
      if (phoneCorpBadge) {
        phoneCorpBadge.textContent = 'PASSWORD RESET';
        phoneCorpBadge.style.background = '#2563EB';
      }
      if (phoneGmailSubject) phoneGmailSubject.textContent = '🔐 Password Reset Authorization Code';
      if (phoneLeadText) {
        phoneLeadText.textContent = 'A self-service password reset was initiated for your account. Use your 6-digit PIN below or reset your password on this device:';
      }
      if (phoneOtpBox) phoneOtpBox.classList.remove('hidden');
      if (gmailOtpDigits) gmailOtpDigits.textContent = String(currentPhoneOtp).split('').join(' ');
      if (phonePromptBox) phonePromptBox.classList.add('hidden');
      if (btnPhoneAutofillEl) btnPhoneAutofillEl.classList.add('hidden');
      if (btnPhoneResetAction) btnPhoneResetAction.classList.remove('hidden');
      if (phoneThreatCard) phoneThreatCard.classList.add('hidden');
    } else if (isThreat || isQuarantine) {
      // Threat Mode
      if (btnPhoneResetAction) btnPhoneResetAction.classList.add('hidden');
      if (phoneCorpTitle) phoneCorpTitle.textContent = 'DIGNITAS THREAT RADAR';
      if (phoneCorpBadge) {
        phoneCorpBadge.textContent = isThreat ? 'CRITICAL BLOCK' : 'QUARANTINE';
        phoneCorpBadge.style.background = '#DC2626';
      }
      if (phoneGmailSubject) {
        phoneGmailSubject.textContent = isThreat ? '🚨 Critical Security Alert: Suspicious sign-in blocked' : '⚠️ Security Alert: High-speed impossible travel detected';
      }
      if (phoneLeadText) {
        phoneLeadText.textContent = isThreat
          ? 'An unauthorized sign-in attempt using your matching credentials was terminated by DIGNITAS. We recommend changing your password immediately.'
          : 'An impossible travel jump was detected on your account. The session has been placed in quarantine pending verification.';
      }
      if (phoneOtpBox) phoneOtpBox.classList.add('hidden');
      if (phonePromptBox) phonePromptBox.classList.add('hidden');
      if (btnPhoneAutofillEl) btnPhoneAutofillEl.classList.add('hidden');
      if (phoneThreatCard) phoneThreatCard.classList.remove('hidden');

      if (phoneThreatTitle) {
        phoneThreatTitle.textContent = isThreat ? '🚨 Intruder Blocked • Leaked Password' : '⚠️ Impossible Travel • Session Isolated';
      }
      if (phoneThreatMsg) {
        phoneThreatMsg.innerHTML = isThreat
          ? `Attacker attempted sign-in from <strong>${escapeHtml(loc)}</strong> (IP: ${escapeHtml(lastAttackerIp)}). Because your password matched, your credentials may be exposed in an external leak.`
          : `Sign-in from <strong>${escapeHtml(loc)}</strong> requires supersonic flight speed from your earlier location. Verify your identity or change your password.`;
      }
      if (btnPhoneApproveQuarantine) {
        if (isQuarantine) {
          btnPhoneApproveQuarantine.classList.remove('hidden');
        } else {
          btnPhoneApproveQuarantine.classList.add('hidden');
        }
      }
    } else {
      // New Device Mode (Tier 3)
      if (btnPhoneResetAction) btnPhoneResetAction.classList.add('hidden');
      if (phoneCorpTitle) phoneCorpTitle.textContent = 'DIGNITAS IDENTITY';
      if (phoneCorpBadge) {
        phoneCorpBadge.textContent = 'NEW DEVICE';
        phoneCorpBadge.style.background = '#2563EB';
      }
      if (phoneGmailSubject) phoneGmailSubject.textContent = '🛡️ Security Alert: New sign-in from unrecognized device';
      if (phoneLeadText) phoneLeadText.textContent = 'An unrecognized device has attempted to sign in to your corporate account. Was this you? Choose an option below:';
      if (phoneOtpBox) phoneOtpBox.classList.remove('hidden');
      if (gmailOtpDigits) gmailOtpDigits.textContent = String(currentPhoneOtp).split('').join(' ');
      if (phonePromptBox) {
        phonePromptBox.classList.remove('hidden');
        phonePromptBox.innerHTML = `
          <div style="font-size:0.75rem; font-weight:700; color:#1E293B; margin-bottom:4px;">Was this you signing in?</div>
          <div class="phone-prompt-actions" style="display:flex; gap:6px;">
            <button type="button" class="btn-phone-prompt-yes" id="btn-phone-prompt-yes" style="flex:1; padding:8px 6px; background:#16A34A; color:#FFF; border:none; border-radius:6px; font-size:0.72rem; font-weight:700; cursor:pointer;">✓ Yes, it's me</button>
            <button type="button" class="btn-phone-prompt-no" id="btn-phone-prompt-no" style="flex:1; padding:8px 6px; background:#DC2626; color:#FFF; border:none; border-radius:6px; font-size:0.72rem; font-weight:700; cursor:pointer;">✕ No, it's not me</button>
          </div>
        `;
        document.getElementById('btn-phone-prompt-yes')?.addEventListener('click', handlePhonePromptYes);
        document.getElementById('btn-phone-prompt-no')?.addEventListener('click', handlePhonePromptNo);
      }
      if (btnPhoneAutofillEl) btnPhoneAutofillEl.classList.remove('hidden');
      if (phoneThreatCard) phoneThreatCard.classList.add('hidden');
    }

    if (phoneViewLock) phoneViewLock.classList.remove('hidden');
    if (phoneViewGmail) phoneViewGmail.classList.add('hidden');
    const phoneViewResetEl = document.getElementById('phone-view-reset');
    if (phoneViewResetEl) phoneViewResetEl.classList.add('hidden');

    if (phonePushNotification) {
      phonePushNotification.style.animation = 'none';
      void phonePushNotification.offsetWidth;
      phonePushNotification.style.animation = 'pushBannerDrop 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    togglePhoneSimulator(true);
    playNotificationChime();
  }

  // Phone Simulator Action Handlers: "Yes, it's me" and "No, it's not me"
  async function handlePhonePromptYes() {
    const box = document.getElementById('phone-prompt-box');
    if (box) {
      box.innerHTML = '<div style="color:#16A34A; font-weight:700; text-align:center; padding:8px; font-size:0.75rem; background:#DCFCE7; border-radius:6px;">✓ Sign-In Approved! Trusting device...</div>';
    }
    await submitPromptVerification(true);
  }

  async function handlePhonePromptNo() {
    const box = document.getElementById('phone-prompt-box');
    if (box) {
      box.innerHTML = '<div style="color:#DC2626; font-weight:700; text-align:center; padding:8px; font-size:0.75rem; background:#FEE2E2; border-radius:6px;">✕ Intrusion Denied! Account Emergency Locked.</div>';
    }
    await submitPromptVerification(false);
  }

  // Password Reset View in Phone
  function openPhonePasswordReset() {
    if (phoneViewGmail) phoneViewGmail.classList.add('hidden');
    if (phoneViewLock) phoneViewLock.classList.add('hidden');
    const phoneViewReset = document.getElementById('phone-view-reset');
    if (phoneViewReset) phoneViewReset.classList.remove('hidden');

    const phoneResetEmail = document.getElementById('phone-reset-email');
    if (phoneResetEmail) phoneResetEmail.value = lastTargetEmail;
    const phoneResetFeedback = document.getElementById('phone-reset-feedback');
    if (phoneResetFeedback) phoneResetFeedback.innerHTML = '';
  }

  async function submitPhonePasswordReset() {
    const newPass = document.getElementById('phone-reset-newpass')?.value || 'JudgeSecurePass2026!';
    const feedback = document.getElementById('phone-reset-feedback');
    const btn = document.getElementById('btn-phone-submit-reset');

    if (btn) { btn.disabled = true; btn.textContent = 'Updating Password...'; }

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: lastTargetEmail,
          new_password: newPass,
          current_ip: lastAttackerIp,
          reason: 'Emergency reset from smartphone alert'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (feedback) {
          feedback.innerHTML = `<span style="color:#16A34A; font-weight:700;">✓ Password updated! Rogue sessions terminated & attacker IP blacklisted.</span>`;
        }
        if (inputPassword) inputPassword.value = newPass;
      } else {
        if (feedback) feedback.innerHTML = `<span style="color:#DC2626;">${data.detail || 'Failed to reset password'}</span>`;
      }
    } catch (err) {
      if (feedback) feedback.innerHTML = `<span style="color:#DC2626;">Network error communicating with gateway</span>`;
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Update Password & Revoke Intruder'; }
    }
  }

  async function blacklistAttackerIp() {
    const btn = document.getElementById('btn-phone-block-ip');
    if (btn) { btn.disabled = true; btn.textContent = 'Blacklisting IP...'; }
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/blacklist-ip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip_address: lastAttackerIp,
          reason: 'Blacklisted from user smartphone security alert'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (btn) {
          btn.style.background = '#15803D';
          btn.textContent = `✓ IP ${lastAttackerIp} Blacklisted in SQLite!`;
        }
      }
    } catch (e) {
      if (btn) btn.textContent = 'Failed to blacklist IP';
    }
  }

  async function approveQuarantineSession() {
    const btn = document.getElementById('btn-phone-approve-quarantine');
    if (btn) { btn.disabled = true; btn.textContent = 'Authorizing Session...'; }
    await submitOtpVerification(currentPhoneOtp || 'APPROVE');
    if (btn) {
      btn.style.background = '#15803D';
      btn.textContent = '✓ Quarantine Session Authorized!';
    }
  }

  // Wire up phone buttons on load
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-phone-change-pwd')?.addEventListener('click', openPhonePasswordReset);
    document.getElementById('btn-phone-reset-action')?.addEventListener('click', openPhonePasswordReset);
    document.getElementById('btn-phone-block-ip')?.addEventListener('click', blacklistAttackerIp);
    document.getElementById('btn-phone-approve-quarantine')?.addEventListener('click', approveQuarantineSession);
    document.getElementById('btn-reset-back')?.addEventListener('click', () => {
      document.getElementById('phone-view-reset')?.classList.add('hidden');
      document.getElementById('phone-view-gmail')?.classList.remove('hidden');
    });
    document.getElementById('btn-phone-submit-reset')?.addEventListener('click', submitPhonePasswordReset);
  });

  // -------------------------------------------------------------
  // 5C. Self-Service Forgot Password Modal Handlers
  // -------------------------------------------------------------
  const btnForgotPassword = document.getElementById('btn-forgot-password');
  const forgotModalBackdrop = document.getElementById('forgot-modal-backdrop');
  const btnCloseForgotModal = document.getElementById('btn-close-forgot-modal');
  const btnCancelForgot = document.getElementById('btn-cancel-forgot');
  const forgotModalBodyStep1 = document.getElementById('forgot-modal-body-step1');
  const forgotModalBodyStep2 = document.getElementById('forgot-modal-body-step2');
  const inputForgotEmail = document.getElementById('input-forgot-email');
  const inputRecoveryPin = document.getElementById('input-recovery-pin');
  const inputRecoveryNewpass = document.getElementById('input-recovery-newpass');
  const btnSendForgotPin = document.getElementById('btn-send-forgot-pin');
  const btnSubmitRecoveryNewpass = document.getElementById('btn-submit-recovery-newpass');
  const forgotStatusFeedback = document.getElementById('forgot-status-feedback');
  const forgotStep2Feedback = document.getElementById('forgot-step2-feedback');

  function openForgotModal() {
    if (forgotModalBackdrop) {
      forgotModalBackdrop.classList.remove('hidden');
      if (forgotModalBodyStep1) forgotModalBodyStep1.classList.remove('hidden');
      if (forgotModalBodyStep2) forgotModalBodyStep2.classList.add('hidden');
      if (btnSendForgotPin) {
        btnSendForgotPin.classList.remove('hidden');
        btnSendForgotPin.disabled = false;
        btnSendForgotPin.textContent = 'Send Recovery PIN →';
      }
      if (btnSubmitRecoveryNewpass) btnSubmitRecoveryNewpass.classList.add('hidden');
      if (inputForgotEmail && inputEmail) {
        inputForgotEmail.value = inputEmail.value.trim() || 'alice@example.com';
      }
      if (forgotStatusFeedback) forgotStatusFeedback.innerHTML = '';
      if (forgotStep2Feedback) forgotStep2Feedback.innerHTML = '';
    }
  }

  function closeForgotModal() {
    if (forgotModalBackdrop) forgotModalBackdrop.classList.add('hidden');
  }

  if (btnForgotPassword) btnForgotPassword.addEventListener('click', openForgotModal);
  if (btnCloseForgotModal) btnCloseForgotModal.addEventListener('click', closeForgotModal);
  if (btnCancelForgot) btnCancelForgot.addEventListener('click', closeForgotModal);

  if (btnSendForgotPin) {
    btnSendForgotPin.addEventListener('click', async () => {
      const email = inputForgotEmail ? inputForgotEmail.value.trim() : '';
      if (!email) {
        if (forgotStatusFeedback) forgotStatusFeedback.innerHTML = '<span style="color:#DC2626;">Please enter an email address.</span>';
        return;
      }
      try {
        btnSendForgotPin.disabled = true;
        btnSendForgotPin.textContent = 'Dispatching PIN...';
        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, app_id: currentApp })
        });
        const data = await res.json();
        btnSendForgotPin.disabled = false;
        btnSendForgotPin.textContent = 'Send Recovery PIN →';

        triggerPhoneSimulatorAlert({
          email: email,
          otp: data.otp_preview || '849201',
          app: currentApp,
          device: 'Self-Service Recovery',
          loc: 'Account Security Center',
          ip: 'Client Reset Session',
          deliveryMode: 'password_reset_request',
          score: 0,
          action: 'password_reset_request',
          anomaly: 'password_reset_request'
        });

        if (forgotModalBodyStep1) forgotModalBodyStep1.classList.add('hidden');
        if (forgotModalBodyStep2) forgotModalBodyStep2.classList.remove('hidden');
        if (btnSendForgotPin) btnSendForgotPin.classList.add('hidden');
        if (btnSubmitRecoveryNewpass) btnSubmitRecoveryNewpass.classList.remove('hidden');
        if (inputRecoveryPin && data.otp_preview) {
          inputRecoveryPin.value = data.otp_preview;
        }
      } catch (err) {
        btnSendForgotPin.disabled = false;
        btnSendForgotPin.textContent = 'Send Recovery PIN →';
        if (forgotStatusFeedback) forgotStatusFeedback.innerHTML = `<span style="color:#DC2626;">Error: ${escapeHtml(err.message)}</span>`;
      }
    });
  }

  if (btnSubmitRecoveryNewpass) {
    btnSubmitRecoveryNewpass.addEventListener('click', async () => {
      const email = inputForgotEmail ? inputForgotEmail.value.trim() : '';
      const newPass = inputRecoveryNewpass ? inputRecoveryNewpass.value.trim() : '';
      if (!newPass || newPass.length < 6) {
        if (forgotStep2Feedback) forgotStep2Feedback.innerHTML = '<span style="color:#DC2626;">Password must be at least 6 characters.</span>';
        return;
      }
      try {
        btnSubmitRecoveryNewpass.disabled = true;
        btnSubmitRecoveryNewpass.textContent = 'Securing Account...';
        const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            new_password: newPass,
            reason: 'Self-service forgot password verification'
          })
        });
        const data = await res.json();
        btnSubmitRecoveryNewpass.disabled = false;
        btnSubmitRecoveryNewpass.textContent = 'Set New Password';
        if (data.success) {
          if (inputPassword) inputPassword.value = newPass;
          closeForgotModal();
          alert(`✓ Password successfully reset for ${email}! You can now sign in with your new password.`);
        } else {
          if (forgotStep2Feedback) forgotStep2Feedback.innerHTML = `<span style="color:#DC2626;">${escapeHtml(data.message || 'Reset failed')}</span>`;
        }
      } catch (err) {
        btnSubmitRecoveryNewpass.disabled = false;
        btnSubmitRecoveryNewpass.textContent = 'Set New Password';
        if (forgotStep2Feedback) forgotStep2Feedback.innerHTML = `<span style="color:#DC2626;">Error: ${escapeHtml(err.message)}</span>`;
      }
    });
  }

  // -------------------------------------------------------------
  // 5B. Target Enrollment (Judge Account) & SMTP Modal Handlers
  // -------------------------------------------------------------
  function openTargetModal() {
    if (targetModalBackdrop) {
      targetModalBackdrop.classList.remove('hidden');
      if (inputTargetEmail) {
        inputTargetEmail.focus();
      }
    }
  }

  function closeTargetModal() {
    if (targetModalBackdrop) {
      targetModalBackdrop.classList.add('hidden');
    }
  }

  if (btnOpenEnrollModal) {
    btnOpenEnrollModal.addEventListener('click', openTargetModal);
  }
  if (btnCloseTargetModal) {
    btnCloseTargetModal.addEventListener('click', closeTargetModal);
  }
  if (btnCancelTargetModal) {
    btnCancelTargetModal.addEventListener('click', closeTargetModal);
  }
  if (targetModalBackdrop) {
    targetModalBackdrop.addEventListener('click', (e) => {
      if (e.target === targetModalBackdrop) closeTargetModal();
    });
  }

  async function handleEnrollTarget() {
    const email = (inputTargetEmail.value || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid judge email address (e.g. judge@gmail.com)');
      return;
    }
    const phoneName = (inputTargetDevice.value || '').trim() || "Judge's Primary Smartphone (iPhone / Pixel)";
    const pass = (inputTargetPassword.value || '').trim() || "JudgePass2026!";

    btnSubmitEnrollTarget.disabled = true;
    btnSubmitEnrollTarget.textContent = 'Enrolling Target in SQL DB...';

    try {
      const res = await fetch(`${API_BASE}/api/auth/enroll-target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          phone_device_name: phoneName,
          trusted_phone_id: 'judge-primary-phone',
          password: pass
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Set input fields for judge
        inputEmail.value = email;
        inputPassword.value = pass;

        // Configure client telemetry: Laptop is UNRECOGNIZED hardware mismatch!
        ctxDevice.value = 'dev-demo-laptop-unrecognized';
        ctxIp.value = '103.21.244.2';
        ctxCity.value = 'Delhi';
        ctxCountry.value = 'IN';
        ctxHour.value = 10;
        ctxMins.value = '';
        ctxVpn.checked = false;
        updateTelemetrySummary();

        closeTargetModal();

        // Inform user & automatically trigger Attempt 1: Laptop tries to access Judge's account
        bannerHeadline.textContent = 'Target Enrolled — Live Attack Evaluated';
        setTimeout(() => {
          executeLoginEvaluation(email, pass);
        }, 300);
      } else {
        alert(data.detail || 'Could not enroll target');
      }
    } catch (err) {
      console.error('Target enrollment failed:', err);
      alert('Failed to enroll target account');
    } finally {
      btnSubmitEnrollTarget.disabled = false;
      btnSubmitEnrollTarget.textContent = '🎯 Enroll & Setup Demo Laptop as Attacker';
    }
  }

  if (btnSubmitEnrollTarget) {
    btnSubmitEnrollTarget.addEventListener('click', handleEnrollTarget);
  }

  // SMTP Settings Handlers
  async function openSmtpModal() {
    if (!smtpModalBackdrop) return;
    smtpModalBackdrop.classList.remove('hidden');
    if (smtpStatusFeedback) smtpStatusFeedback.textContent = 'Loading SMTP settings...';
    try {
      const res = await fetch(`${API_BASE}/api/settings/smtp`);
      if (res.ok) {
        const data = await res.json();
        if (inputSmtpHost) inputSmtpHost.value = data.smtp_host || 'smtp.gmail.com';
        if (inputSmtpPort) inputSmtpPort.value = data.smtp_port || 587;
        if (inputSmtpUser) inputSmtpUser.value = data.smtp_user || '';
        if (inputSmtpFrom) inputSmtpFrom.value = data.smtp_from || '';
        if (smtpStatusFeedback) {
          smtpStatusFeedback.innerHTML = data.configured
            ? `<span style="color:#16A34A;">● Active Mode: ${escapeHtml(data.mode)} (${escapeHtml(data.smtp_user)})</span>`
            : `<span style="color:#D97706;">● Fallback Mode: ${escapeHtml(data.mode)} (Set Gmail + App Password to enable live inbox delivery)</span>`;
        }
      }
    } catch (err) {
      if (smtpStatusFeedback) smtpStatusFeedback.textContent = 'Could not load SMTP settings';
    }
  }

  function closeSmtpModal() {
    if (smtpModalBackdrop) smtpModalBackdrop.classList.add('hidden');
  }

  if (btnOpenSmtp) btnOpenSmtp.addEventListener('click', openSmtpModal);
  if (btnCloseSmtpModal) btnCloseSmtpModal.addEventListener('click', closeSmtpModal);
  if (smtpModalBackdrop) {
    smtpModalBackdrop.addEventListener('click', (e) => {
      if (e.target === smtpModalBackdrop) closeSmtpModal();
    });
  }

  if (btnSaveSmtp) {
    btnSaveSmtp.addEventListener('click', async () => {
      const host = inputSmtpHost.value.trim();
      const port = parseInt(inputSmtpPort.value.trim(), 10) || 587;
      const user = inputSmtpUser.value.trim();
      const pass = inputSmtpPass.value.trim();
      const fromAddr = inputSmtpFrom.value.trim();

      if (!host || !user || !pass) {
        alert('Please fill in SMTP Host, Username/Email, and App Password');
        return;
      }

      btnSaveSmtp.disabled = true;
      btnSaveSmtp.textContent = 'Saving...';

      try {
        const res = await fetch(`${API_BASE}/api/settings/smtp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtp_host: host,
            smtp_port: port,
            smtp_user: user,
            smtp_pass: pass,
            smtp_from: fromAddr || user
          })
        });
        const data = await res.json();
        if (smtpStatusFeedback) {
          smtpStatusFeedback.innerHTML = `<span style="color:#16A34A;">✓ Configuration saved! Real email delivery active.</span>`;
        }
        setTimeout(closeSmtpModal, 1200);
      } catch (err) {
        alert('Failed to save SMTP configuration');
      } finally {
        btnSaveSmtp.disabled = false;
        btnSaveSmtp.textContent = 'Save Configuration';
      }
    });
  }

  if (btnTestSmtp) {
    btnTestSmtp.addEventListener('click', async () => {
      const recipient = inputTargetEmail?.value.trim() || inputEmail?.value.trim() || inputSmtpUser?.value.trim();
      if (!recipient) {
        alert('Please specify an email address to test delivery');
        return;
      }
      btnTestSmtp.disabled = true;
      btnTestSmtp.textContent = 'Sending test...';
      try {
        const res = await fetch(`${API_BASE}/api/settings/test-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipient })
        });
        const data = await res.json();
        if (data.success) {
          alert(`Test email successfully delivered to ${recipient}! Check your inbox or phone.`);
        } else {
          alert(`Delivery notice: ${data.message}`);
        }
      } catch (err) {
        alert('Error connecting to SMTP dispatch test');
      } finally {
        btnTestSmtp.disabled = false;
        btnTestSmtp.textContent = '✉️ Send Test Dispatch';
      }
    });
  }

  function handleChallengeDisplay(data, email) {
    const score = Number.isFinite(data.score) ? data.score : (data.risk_score || 0);
    const isBlock = data.action === 'block' || data.decision === 'restrict' || score >= 80;
    const isStepUp = data.requires_step_up || data.decision === 'step_up' || (data.action && data.action !== 'allow' && !isBlock);

    // Hide all state panels first
    if (panelStateIdle) panelStateIdle.classList.add('hidden');
    if (panelStateActive) panelStateActive.classList.add('hidden');
    if (panelStateThreat) panelStateThreat.classList.add('hidden');

    // Case 1: ATTACK / BLOCK SCENARIO (Threat Visualizer HUD)
    if (isBlock) {
      if (panelStateThreat) panelStateThreat.classList.remove('hidden');

      const country = ctxCountry.value.trim() || data.prompt_details?.country || 'RU';
      const city = ctxCity.value.trim() || data.prompt_details?.city || 'Moscow';
      const ip = ctxIp.value.trim() || data.prompt_details?.ip_address || '185.220.101.5';
      const flag = getCountryFlag(country);

      if (threatOriginFlag) threatOriginFlag.textContent = flag;
      if (threatOriginCity) threatOriginCity.textContent = `${city}, ${country}`;
      if (threatOriginIp) threatOriginIp.textContent = `${ctxVpn.checked ? 'Tor Node: ' : 'IP: '}${ip}`;
      if (threatDestServer) {
        threatDestServer.textContent = `${currentApp === 'bank' ? 'Apex Trust Core' : 'Pulse Core'} (Delhi, IN)`;
      }

      // High-priority security alert toast
      showMailToast({
        type: 'threat',
        email: email,
        otp: null,
        app: currentApp,
        device: ctxDevice.value.trim() || 'dev-unknown',
        loc: `${city}, ${country}`,
        ip: ip
      });

      // TRIGGER PHONE SIMULATOR FOR THREAT / BLOCK SCENARIO!
      triggerPhoneSimulatorAlert({
        email: email,
        otp: null,
        app: currentApp,
        device: ctxDevice.value.trim() || 'dev-unknown',
        loc: `${city}, ${country}`,
        ip: ip,
        deliveryMode: data.prompt_details?.delivery_mode || 'simulated',
        score: score,
        action: 'block',
        anomaly: (data.reasons && data.reasons[0]?.detail) ? data.reasons[0].detail : 'Compromised credential / Malicious proxy detected'
      });

      activeChallenge = null;
      return;
    }

    // Case 2: ALLOW / LOW RISK (Frictionless login)
    if (!isStepUp) {
      if (panelStateIdle) {
        panelStateIdle.classList.remove('hidden');
        panelStateIdle.innerHTML = `
          <div class="idle-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div class="idle-text-wrap">
            <div class="idle-heading">Adaptive Step-Up Inactive</div>
            <div class="idle-sub">When unusual telemetry triggers a challenge, the verification prompt appears here.</div>
          </div>
        `;
      }
      activeChallenge = null;
      return;
    }

    // Case 3: STEP-UP CHALLENGE ACTIVE
    if (panelStateActive) panelStateActive.classList.remove('hidden');
    if (activeChallengeUser) activeChallengeUser.textContent = email;

    const deviceId = ctxDevice.value.trim() || data.prompt_details?.device_id || 'dev-unknown';
    const clientIp = ctxIp.value.trim() || data.prompt_details?.ip_address || '103.21.244.2';
    const clientLoc = `${ctxCity.value.trim() || 'Delhi'}, ${ctxCountry.value.trim() || 'IN'}`;
    const otpCode = data.prompt_details?.otp_code || '849201';

    activeChallenge = {
      email: email,
      action: data.action || data.step_up_type || 'email_otp',
      device_id: deviceId,
      app_id: currentApp,
      otp_code: otpCode
    };

    // SUB-CASE 3A: Cloudflare Turnstile CAPTCHA (Score 30-44 or Repeated Attempts)
    if (data.action === 'captcha' || data.step_up_type === 'captcha') {
      if (activeChallengeType) activeChallengeType.textContent = 'CLOUDFLARE TURNSTILE CAPTCHA';
      
      const isRepeatedAttempt = data.score >= 50 || (data.reasons && data.reasons.some(r => (r.signal || '').includes('attempt') || (r.detail || '').includes('Multiple')));
      const anomalyBanner = isRepeatedAttempt ? `
        <div class="captcha-anomaly-warning">
          <span>⚠️</span>
          <span><strong>Security Anomaly:</strong> Multiple failed sign-ins detected for this account. Human presence verification (Cloudflare Turnstile) enforced.</span>
        </div>
      ` : '';

      activeChallengeContent.innerHTML = `
        ${anomalyBanner}
        <div class="turnstile-card" id="turnstile-widget" tabindex="0" role="button" aria-label="Verify you are human">
          <div class="turnstile-checkbox" id="turnstile-box">
            <span class="turnstile-spinner" id="turnstile-spin"></span>
            <span class="turnstile-check" id="turnstile-mark">✓</span>
          </div>
          <div class="turnstile-label-col">
            <div class="turnstile-title" id="turnstile-text">Verify you are human</div>
            <div class="turnstile-sub">Protected by Cloudflare Turnstile</div>
          </div>
          <div class="turnstile-logo">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <path d="M38.5 28.5c0-5.8-4.7-10.5-10.5-10.5-1.1 0-2.2.2-3.2.5C23.6 14.5 19.6 12 15 12c-6.6 0-12 5.4-12 12 0 .5 0 1 .1 1.5C1.3 26.6 0 28.6 0 31c0 3.3 2.7 6 6 6h32c3.3 0 6-2.7 6-6 0-1.1-.3-2.1-.8-3-.9-1.2-2.7-2-4.7-2z" fill="#F48120"/>
              <path d="M29 37h10c2.8 0 5-2.2 5-5 0-.9-.2-1.7-.7-2.4-.7-1-2-1.6-3.8-1.6h-.5c-.6 0-1.1-.4-1.2-1-.8-4.8-4.9-8.5-9.8-8.5-.9 0-1.8.1-2.7.4-.6.2-1.2 0-1.6-.4-.8-.9-1.9-1.5-3.1-1.7 5.1 1.4 8.7 6 8.7 11.5v.7c0 .6.4 1 1 1h.7c1.3.1 2.3 1.1 2.3 2.4 0 1.4-1.1 2.5-2.5 2.5H29v2.1z" fill="#FAAD3F"/>
            </svg>
            <span>Cloudflare</span>
          </div>
        </div>
      `;

      const turnstileWidget = document.getElementById('turnstile-widget');
      let verifying = false;

      if (turnstileWidget) {
        turnstileWidget.addEventListener('click', () => {
          if (verifying) return;
          verifying = true;
          turnstileWidget.classList.add('verifying');
          const text = document.getElementById('turnstile-text');
          if (text) text.textContent = 'Evaluating browser challenge...';

          setTimeout(() => {
            turnstileWidget.classList.remove('verifying');
            turnstileWidget.classList.add('verified');
            if (text) text.textContent = 'Human Verification Complete';

            setTimeout(() => {
              submitOtpVerification('CAPTCHA');
            }, 400);
          }, 750);
        });
      }

      return;
    }

    // SUB-CASE 3B: Segmented 6-Box Email OTP / Quarantine Approval (Score 45-79)
    if (data.action === 'email_otp' || data.action === 'quarantine_verify' || data.action === 'otp_password_reset' || data.step_up_type === 'email_otp' || data.step_up_type === 'quarantine_verify' || data.step_up_type === 'otp_password_reset') {
      const isQuarantine = data.action === 'quarantine_verify' || data.action === 'otp_password_reset' || data.step_up_type === 'quarantine_verify' || data.step_up_type === 'otp_password_reset';
      if (activeChallengeType) {
        activeChallengeType.textContent = isQuarantine ? 'SESSION QUARANTINE • OUT-OF-BAND APPROVAL' : 'STEP-UP EMAIL OTP • DEVICE TRUST';
      }

      const quarantineAlertBanner = isQuarantine ? `
        <div class="quarantine-anomaly-warning" style="background:rgba(225,29,72,0.12); border:1px solid rgba(225,29,72,0.3); border-radius:8px; padding:10px 14px; margin-bottom:12px; display:flex; gap:8px; align-items:flex-start; font-size:0.82rem; color:#FB7185;">
          <span>⚠️</span>
          <span><strong>High-Risk Threat Intercepted:</strong> Impossible travel or proxy detected. This session has been placed in <strong>Quarantine</strong>. Out-of-band email authorization required.</span>
        </div>
      ` : `
        <div class="device-trust-banner" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); border-radius:8px; padding:10px 14px; margin-bottom:12px; display:flex; gap:8px; align-items:flex-start; font-size:0.82rem; color:#A5B4FC;">
          <span>📱</span>
          <span><strong>New Hardware Detected:</strong> Single-use passcode dispatched to <strong>${escapeHtml(email)}</strong>. Verifying will enroll this device into trusted baseline.</span>
        </div>
      `;

      activeChallengeContent.innerHTML = `
        <div class="otp-challenge-view">
          ${quarantineAlertBanner}
          <div class="otp-pin-wrap" id="otp-pin-container">
            <input type="text" class="pin-digit" maxlength="1" data-index="0" inputmode="numeric" autocomplete="one-time-code" autofocus>
            <input type="text" class="pin-digit" maxlength="1" data-index="1" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="2" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="3" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="4" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="5" inputmode="numeric">
          </div>
          ${!isQuarantine ? `
          <div class="trust-device-option" style="display:flex; align-items:center; justify-content:center; gap:8px; margin:10px 0 6px 0; font-size:0.83rem; color:#94A3B8;">
            <input type="checkbox" id="check-trust-device" checked style="accent-color:#6366F1; width:15px; height:15px; cursor:pointer;">
            <label for="check-trust-device" style="cursor:pointer; user-select:none;">Trust this device for 30 days (frictionless next sign-in)</label>
          </div>
          ` : `
          <div class="quarantine-status-pill" style="display:flex; align-items:center; justify-content:center; gap:6px; margin:8px 0; font-size:0.82rem; color:#FB7185;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#E11D48; box-shadow:0 0 8px #E11D48;"></span>
            <span>Session Status: <strong>Quarantined</strong> • Waiting for Out-of-Band Email Approval</span>
          </div>
          `}
          <div class="otp-actions-bar">
            <button type="button" class="btn-otp-action" id="btn-open-email-preview">✉️ View Email Preview</button>
            ${isQuarantine ? `<button type="button" class="btn-otp-action btn-otp-verify-action" id="btn-approve-quarantine" style="background:linear-gradient(135deg, #E11D48, #BE123C);">✓ Approve Session Out-of-Band</button>` : `<button type="button" class="btn-otp-action btn-otp-verify-action" id="btn-submit-pin">Verify OTP & Trust Device →</button>`}
          </div>
        </div>
      `;

      // Trigger incoming email notification toast and simulated iPhone alert
      const dMode = data.prompt_details?.delivery_mode || 'simulated';
      showMailToast({
        type: isQuarantine ? 'quarantine' : 'otp',
        email: email,
        otp: otpCode,
        app: currentApp,
        device: deviceId,
        loc: clientLoc,
        ip: clientIp
      });

      triggerPhoneSimulatorAlert({
        email: email,
        otp: otpCode,
        app: currentApp,
        device: deviceId,
        loc: clientLoc,
        ip: clientIp,
        deliveryMode: dMode,
        score: score,
        action: data.action || 'email_otp',
        anomaly: isQuarantine ? 'Impossible supersonic velocity travel detected (+70 pts)' : 'Hardware baseline mismatch (+45 pts)'
      });

      // Wire up PIN input navigation
      const pinInputs = Array.from(document.querySelectorAll('.pin-digit'));
      if (pinInputs.length > 0) {
        setTimeout(() => pinInputs[0].focus(), 150);

        pinInputs.forEach((input, idx) => {
          input.addEventListener('input', () => {
            const val = input.value.replace(/[^0-9]/g, '');
            input.value = val ? val[val.length - 1] : '';

            if (input.value && idx < pinInputs.length - 1) {
              pinInputs[idx + 1].focus();
            }

            // Check if all 6 filled
            const entered = pinInputs.map(p => p.value).join('');
            if (entered.length === 6) {
              submitOtpVerification(entered);
            }
          });

          input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && idx > 0) {
              pinInputs[idx - 1].focus();
            } else if (e.key === 'Enter') {
              const entered = pinInputs.map(p => p.value).join('');
              if (entered.length > 0) submitOtpVerification(entered);
            }
          });

          input.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
            if (text) {
              const chars = text.slice(0, 6).split('');
              chars.forEach((c, i) => {
                if (pinInputs[i]) pinInputs[i].value = c;
              });
              const entered = pinInputs.map(p => p.value).join('');
              if (entered.length === 6) {
                submitOtpVerification(entered);
              } else if (pinInputs[chars.length]) {
                pinInputs[chars.length].focus();
              }
            }
          });
        });
      }

      // Button handlers
      const btnOpenEmail = document.getElementById('btn-open-email-preview');
      if (btnOpenEmail) {
        btnOpenEmail.addEventListener('click', () => {
          openEmailModal({
            email: email,
            otp: otpCode,
            app: currentApp,
            device: deviceId,
            loc: clientLoc,
            ip: clientIp
          });
        });
      }

      const btnSubmitPin = document.getElementById('btn-submit-pin');
      if (btnSubmitPin) {
        btnSubmitPin.addEventListener('click', () => {
          const entered = pinInputs.map(p => p.value).join('');
          submitOtpVerification(entered || otpCode);
        });
      }

      const btnApproveQuarantine = document.getElementById('btn-approve-quarantine');
      if (btnApproveQuarantine) {
        btnApproveQuarantine.addEventListener('click', () => {
          const entered = pinInputs.map(p => p.value).join('');
          submitOtpVerification(entered || otpCode || 'APPROVE');
        });
      }

      return;
    }

    // SUB-CASE 3C: Fallback Google Trusted Device Prompt
    if (activeChallengeType) activeChallengeType.textContent = 'TRUSTED DEVICE PROMPT';
    activeChallengeContent.innerHTML = `
      <div class="challenge-body-prompt">
        <div class="prompt-details-summary">
          <div class="prompt-title-bold">Is this you signing in?</div>
          <div class="prompt-context-snippet">Device: <strong>${escapeHtml(deviceId)}</strong> near ${escapeHtml(clientLoc)}</div>
        </div>
        <div class="prompt-action-btns">
          <button class="btn-prompt-yes" id="btn-challenge-approve">✓ Yes, it's me</button>
          <button class="btn-prompt-no" id="btn-challenge-deny">✕ No, lock</button>
        </div>
      </div>
    `;

    document.getElementById('btn-challenge-approve')?.addEventListener('click', () => submitPromptVerification(true));
    document.getElementById('btn-challenge-deny')?.addEventListener('click', () => submitPromptVerification(false));
  }

  async function submitPromptVerification(approved) {
    if (!activeChallenge) return;
    try {
      const res = await apiVerifyPrompt({
        email: activeChallenge.email,
        device_id: activeChallenge.device_id,
        app_id: activeChallenge.app_id,
        approved: approved
      });
      applyEvaluationResult(res, activeChallenge.email);
    } catch (err) {
      console.error('Prompt verify error:', err);
    }
  }

  async function submitOtpVerification(codeOverride) {
    if (!activeChallenge) return;
    const code = (typeof codeOverride === 'string' && codeOverride.length > 0)
      ? codeOverride
      : (activeChallenge.otp_code || '849201');

    try {
      const res = await apiVerifyStepUp({
        email: activeChallenge.email,
        device_id: activeChallenge.device_id,
        app_id: activeChallenge.app_id,
        step_up_type: activeChallenge.action || 'email_otp',
        code: code
      });
      applyEvaluationResult(res, activeChallenge.email);
    } catch (err) {
      console.error('OTP verify error:', err);
    }
  }

  // -------------------------------------------------------------
  // 7. Demo Scenarios 1 to 8 & Keyboard Shortcuts
  // -------------------------------------------------------------
  const scenarios = {
    1: {
      name: 'Familiar Login',
      email: 'alice@example.com',
      pass: 'Password123!',
      app: 'bank',
      ip: '103.21.244.2',
      dev: 'dev-alice-laptop',
      city: 'Delhi',
      country: 'IN',
      hour: 10,
      mins: '',
      vpn: false
    },
    2: {
      name: 'New Device',
      email: 'alice@example.com',
      pass: 'Password123!',
      app: 'bank',
      ip: '103.21.244.2',
      dev: 'dev-alice-tablet-unseen',
      city: 'Delhi',
      country: 'IN',
      hour: 10,
      mins: '',
      vpn: false
    },
    3: {
      name: 'Tor 3 AM Intrusion',
      email: 'alice@example.com',
      pass: 'Password123!',
      app: 'bank',
      ip: '185.220.101.5',
      dev: 'dev-tor-attacker',
      city: 'Moscow',
      country: 'RU',
      hour: 3,
      mins: '',
      vpn: true
    },
    4: {
      name: 'Brute Force Defense',
      email: 'alice@example.com',
      pass: 'WrongPassword!',
      app: 'bank',
      ip: '103.21.244.2',
      dev: 'dev-alice-laptop',
      city: 'Delhi',
      country: 'IN',
      hour: 10,
      mins: '',
      vpn: false
    },
    5: {
      name: 'Cross-App Threat',
      email: 'bob@example.com',
      pass: 'Password123!',
      app: 'social',
      ip: '103.21.244.2',
      dev: 'dev-bob-laptop',
      city: 'Delhi',
      country: 'IN',
      hour: 10,
      mins: '',
      vpn: false
    },
    6: {
      name: 'Honeytoken Trap',
      email: 'backup_admin',
      pass: 'AdminSecret2024!',
      app: 'bank',
      ip: '45.154.255.99',
      dev: 'dev-honeypot-bot',
      city: 'St. Petersburg',
      country: 'RU',
      hour: 1,
      mins: '',
      vpn: true
    },
    7: {
      name: 'Adapted Baseline',
      email: 'alice@example.com',
      pass: 'Password123!',
      app: 'bank',
      ip: '103.21.244.2',
      dev: 'dev-alice-laptop',
      city: 'Delhi',
      country: 'IN',
      hour: 10,
      mins: '',
      vpn: false
    },
    8: {
      name: 'Impossible Velocity',
      email: 'alice@example.com',
      pass: 'Password123!',
      app: 'bank',
      ip: '185.86.151.11',
      dev: 'dev-alice-laptop',
      city: 'London',
      country: 'GB',
      hour: 11,
      mins: 15,
      vpn: false
    }
  };

  function triggerScenario(num) {
    const sc = scenarios[num];
    if (!sc) return;

    // Set Customer App
    setCustomerApp(sc.app);

    // Populate Fields
    inputEmail.value = sc.email;
    inputPassword.value = sc.pass;
    ctxIp.value = sc.ip;
    ctxDevice.value = sc.dev;
    ctxCity.value = sc.city;
    ctxCountry.value = sc.country;
    ctxHour.value = sc.hour;
    ctxMins.value = sc.mins;
    ctxVpn.checked = sc.vpn;
    updateTelemetrySummary();

    // Visual highlight on scenario button
    document.querySelectorAll('.btn-scenario').forEach(b => b.style.outline = 'none');
    const activeBtn = document.getElementById(`btn-sc-${num}`);
    if (activeBtn) {
      activeBtn.style.outline = '2px solid var(--accent-navy)';
      setTimeout(() => { activeBtn.style.outline = 'none'; }, 1000);
    }

    // Execute Login Attempt
    executeLoginEvaluation(sc.email, sc.pass);
  }

  // Hook up scenario buttons 1–8
  for (let i = 1; i <= 8; i++) {
    const btn = document.getElementById(`btn-sc-${i}`);
    if (btn) {
      btn.addEventListener('click', () => triggerScenario(i));
    }
  }

  // Keyboard Shortcuts: Keys 1 to 8
  window.addEventListener('keydown', (e) => {
    // Avoid triggering when user is typing into input fields
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    const keyStr = (e.key || '').replace(/^Digit/, '') || (e.code || '').replace(/^Digit/, '') || (e.code || '').replace(/^Numpad/, '');
    const keyNum = parseInt(keyStr, 10);
    if (keyNum >= 1 && keyNum <= 8) {
      triggerScenario(keyNum);
    }
  });

  // Expose globally on window for inline handlers & programmatic trigger
  window.triggerScenario = triggerScenario;
  window.handleDemoReset = handleDemoReset;
  window.executeLoginEvaluation = executeLoginEvaluation;

  // Reset Demo State
  async function handleDemoReset() {
    try {
      await apiResetDemo();
      btnFillAlice.click();
      lastScore = 0;
      displayScore.textContent = '0';
      displayScore.style.color = '#14171F';
      displayLatency.textContent = '-- ms';
      globalLatencyVal.textContent = '4.5 ms';
      gaugePin.style.left = '0%';
      pinTooltip.textContent = '0';
      bannerDecisionBadge.className = 'decision-badge badge-neutral';
      bannerDecisionBadge.textContent = 'AWAITING LOGIN';
      bannerHeadline.textContent = 'Ready for Authentication';
      reasonsStack.innerHTML = `
        <div class="empty-reasons-state">
          Submit a login or click any demo scenario below to inspect security telemetry.
        </div>
      `;
      if (mailToastContainer) mailToastContainer.innerHTML = '';
      closeEmailModal();
      handleChallengeDisplay({ requires_step_up: false, action: 'allow', score: 0 }, 'alice@example.com');
    } catch (err) {
      console.error('Reset error:', err);
    }
  }

  btnTopReset.addEventListener('click', handleDemoReset);
  btnDockReset.addEventListener('click', handleDemoReset);

  // Credits Modal Handlers
  const btnOpenCredits = document.getElementById('btn-open-credits');
  const btnCloseCredits = document.getElementById('btn-close-credits');
  const creditsModalOverlay = document.getElementById('credits-modal-overlay');

  if (btnOpenCredits && creditsModalOverlay) {
    btnOpenCredits.addEventListener('click', () => {
      creditsModalOverlay.classList.remove('hidden');
    });
  }

  if (btnCloseCredits && creditsModalOverlay) {
    btnCloseCredits.addEventListener('click', () => {
      creditsModalOverlay.classList.add('hidden');
    });
  }

  if (creditsModalOverlay) {
    creditsModalOverlay.addEventListener('click', (e) => {
      if (e.target === creditsModalOverlay) {
        creditsModalOverlay.classList.add('hidden');
      }
    });
  }

  // Initial Boot
  updateTelemetrySummary();
});

