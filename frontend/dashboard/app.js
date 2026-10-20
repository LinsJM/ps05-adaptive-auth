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
    if (app === 'social') {
      pillBank.classList.remove('active');
      pillSocial.classList.add('active');
      logoBank.classList.add('hidden');
      logoSocial.classList.remove('hidden');
      appShell.classList.add('app-social');
      appHeadingText.textContent = 'Pulse Social Network';
      appSubheadText.textContent = 'User Social Identity Gateway';
    } else {
      pillSocial.classList.remove('active');
      pillBank.classList.add('active');
      logoSocial.classList.add('hidden');
      logoBank.classList.remove('hidden');
      appShell.classList.remove('app-social');
      appHeadingText.textContent = 'Apex Trust Bank';
      appSubheadText.textContent = 'Client Online Financial Portal';
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
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async function apiVerifyPrompt(payload) {
    const res = await fetch('/api/verify-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async function apiVerifyStepUp(payload) {
    const res = await fetch('/api/verify-stepup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async function apiResetDemo() {
    const res = await fetch('/api/dashboard/reset-demo', { method: 'POST' });
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
      bannerDecisionBadge.textContent = 'BLOCK & LOCK (80–100)';
      bannerHeadline.textContent = 'Intrusion Blocked • Account Locked';
    } else if (action === 'otp_password_reset' || score >= 61) {
      bannerDecisionBadge.classList.add('badge-reset');
      bannerDecisionBadge.textContent = 'RESET REQUIRED (61–79)';
      bannerHeadline.textContent = 'Suspicious Login • OTP & Reset';
    } else if (action === 'email_otp' || score >= 45) {
      bannerDecisionBadge.classList.add('badge-otp');
      bannerDecisionBadge.textContent = 'EMAIL OTP (45–60)';
      bannerHeadline.textContent = 'Step-Up MFA Required';
    } else if (action === 'captcha' || score >= 30) {
      bannerDecisionBadge.classList.add('badge-captcha');
      bannerDecisionBadge.textContent = 'CAPTCHA (30–44)';
      bannerHeadline.textContent = 'Light Friction Challenge';
    } else {
      bannerDecisionBadge.classList.add('badge-allow');
      bannerDecisionBadge.textContent = 'ALLOW (0–29)';
      bannerHeadline.textContent = 'Frictionless Sign-In Approved';
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
          detail: r.detail || JSON.stringify(r)
        };
      } else {
        // String format parsing
        const str = String(r);
        const match = str.match(/\+(\d+)/);
        const pts = match ? parseInt(match[1], 10) : 0;
        return {
          points: pts,
          signal: 'TELEMETRY_ANOMALY',
          detail: str
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

      row.innerHTML = `
        <div class="reason-points-badge ${ptsClass}">${signStr} pts</div>
        <div class="reason-content">
          <div class="reason-signal">${escapeHtml(item.signal.toUpperCase())}</div>
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
    toast.className = `mail-toast ${type === 'threat' ? 'mail-toast-threat' : ''}`;

    const appName = app === 'bank' ? 'Apex Trust Bank' : 'Pulse Social';
    const isThreat = type === 'threat';

    toast.innerHTML = `
      <div class="mail-toast-header">
        <div class="toast-sender-badge">
          ${isThreat ? '🚨' : '✉️'} ${isThreat ? 'DIGNITAS INTRUSION MITIGATOR' : 'DIGNITAS IDENTITY MAIL'}
        </div>
        <button class="toast-btn-close" title="Dismiss notification">✕</button>
      </div>
      <div class="mail-toast-body">
        <div class="toast-subject">${isThreat ? '🚨 Intrusion Intercepted & Account Locked' : '🔐 Your Single-Use Sign-In Passcode'}</div>
        <div class="toast-snippet">
          ${isThreat
            ? `Blocked suspicious access attempt on <strong>${escapeHtml(appName)}</strong> for <code>${escapeHtml(email)}</code> from IP <code>${escapeHtml(ip || '185.220.101.5')}</code>.`
            : `Authentication challenge for <strong>${escapeHtml(appName)}</strong>. Enter the 6-digit code below to verify your login.`
          }
        </div>
        ${!isThreat && otp ? `
          <div class="toast-passcode-callout">
            <span class="toast-passcode-value">${escapeHtml(otp)}</span>
            <button class="toast-btn-copy" id="toast-btn-copy-action">📋 Copy Passcode</button>
          </div>
        ` : ''}
      </div>
      <div class="mail-toast-footer">
        <span class="toast-time">Just now</span>
        <div class="toast-actions-right">
          ${!isThreat ? `<button class="toast-btn-view" id="toast-btn-view-action">✉️ View Email</button>` : `<a href="soc.html" class="toast-btn-view" style="text-decoration:none;">Inspect SOC →</a>`}
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
          copyBtn.textContent = '✓ Copied & Filled!';
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

    // SUB-CASE 3A: Cloudflare Turnstile CAPTCHA (Score 30-44)
    if (data.action === 'captcha' || data.step_up_type === 'captcha') {
      if (activeChallengeType) activeChallengeType.textContent = 'CLOUDFLARE TURNSTILE CAPTCHA';
      activeChallengeContent.innerHTML = `
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

    // SUB-CASE 3B: Segmented 6-Box Email OTP / Password Reset (Score 45-79)
    if (data.action === 'email_otp' || data.action === 'otp_password_reset' || data.step_up_type === 'email_otp' || data.step_up_type === 'otp_password_reset') {
      const isReset = data.action === 'otp_password_reset' || data.step_up_type === 'otp_password_reset';
      if (activeChallengeType) {
        activeChallengeType.textContent = isReset ? 'OTP & PASSWORD RESET REQUIRED' : '6-DIGIT EMAIL PASSCODE';
      }

      activeChallengeContent.innerHTML = `
        <div class="otp-challenge-view">
          <div class="otp-view-instruction">
            Single-use verification passcode dispatched to <strong>${escapeHtml(email)}</strong>.
          </div>
          <div class="otp-pin-wrap" id="otp-pin-container">
            <input type="text" class="pin-digit" maxlength="1" data-index="0" inputmode="numeric" autocomplete="one-time-code" autofocus>
            <input type="text" class="pin-digit" maxlength="1" data-index="1" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="2" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="3" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="4" inputmode="numeric">
            <input type="text" class="pin-digit" maxlength="1" data-index="5" inputmode="numeric">
          </div>
          <div class="otp-actions-bar">
            <button type="button" class="btn-otp-action" id="btn-open-email-preview">✉️ View Email Preview</button>
            <button type="button" class="btn-otp-action btn-otp-verify-action" id="btn-submit-pin">Verify OTP →</button>
          </div>
        </div>
      `;

      // Trigger incoming email notification toast
      showMailToast({
        type: 'otp',
        email: email,
        otp: otpCode,
        app: currentApp,
        device: deviceId,
        loc: clientLoc,
        ip: clientIp
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

  // Initial Boot
  updateTelemetrySummary();
});
