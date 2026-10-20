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

  // DOM Elements - Verification / Challenge Panel
  const panelStateIdle = document.getElementById('panel-state-idle');
  const panelStateActive = document.getElementById('panel-state-active');
  const activeChallengeType = document.getElementById('active-challenge-type');
  const activeChallengeUser = document.getElementById('active-challenge-user');
  const activeChallengeContent = document.getElementById('active-challenge-content');



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
  // 6. Challenge & Verification Panel
  // -------------------------------------------------------------
  function handleChallengeDisplay(data, email) {
    const isStepUp = data.requires_step_up || data.decision === 'step_up' || (data.action && data.action !== 'allow' && data.action !== 'block');

    if (!isStepUp) {
      panelStateActive.classList.add('hidden');
      panelStateIdle.classList.remove('hidden');

      if (data.action === 'block') {
        panelStateIdle.innerHTML = `
          <div class="idle-icon-wrap" style="color: #DC2626; border-color: #FCA5A5;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <div class="idle-text-wrap">
            <div class="idle-heading" style="color: #7F1D1D;">Intrusion Mitigated • Account Locked</div>
            <div class="idle-sub">Intruder IP blacklisted. Access blocked until SOC administrator manually unlocks.</div>
          </div>
        `;
      } else {
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

    // Step-up is active!
    panelStateIdle.classList.add('hidden');
    panelStateActive.classList.remove('hidden');

    activeChallengeUser.textContent = email;
    activeChallenge = {
      email: email,
      action: data.action,
      device_id: ctxDevice.value.trim() || 'dev-unknown',
      app_id: currentApp
    };

    if (data.prompt_details || data.action === 'captcha' || data.action === 'email_otp') {
      activeChallengeType.textContent = 'TRUSTED DEVICE PROMPT';
      activeChallengeContent.innerHTML = `
        <div class="challenge-body-prompt">
          <div class="prompt-details-summary">
            <div class="prompt-title-bold">Is this you signing in?</div>
            <div class="prompt-context-snippet">Device: <strong>${escapeHtml(activeChallenge.device_id)}</strong> near ${escapeHtml(ctxCity.value)}, ${escapeHtml(ctxCountry.value)}</div>
          </div>
          <div class="prompt-action-btns">
            <button class="btn-prompt-yes" id="btn-challenge-approve">✓ Yes, it's me</button>
            <button class="btn-prompt-no" id="btn-challenge-deny">✕ No, lock</button>
          </div>
        </div>
      `;

      document.getElementById('btn-challenge-approve').addEventListener('click', () => submitPromptVerification(true));
      document.getElementById('btn-challenge-deny').addEventListener('click', () => submitPromptVerification(false));
    } else {
      activeChallengeType.textContent = 'MFA PASSCODE';
      activeChallengeContent.innerHTML = `
        <div class="challenge-body-input">
          <input type="text" id="input-stepup-code" placeholder="123456" maxlength="6" value="123456">
          <button class="btn-challenge-submit" id="btn-submit-code">Verify Code</button>
        </div>
      `;
      document.getElementById('btn-submit-code').addEventListener('click', submitOtpVerification);
    }
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

  async function submitOtpVerification() {
    if (!activeChallenge) return;
    const code = document.getElementById('input-stepup-code')?.value || '123456';
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
      handleChallengeDisplay({ requires_step_up: false, action: 'allow' }, 'alice@example.com');
    } catch (err) {
      console.error('Reset error:', err);
    }
  }

  btnTopReset.addEventListener('click', handleDemoReset);
  btnDockReset.addEventListener('click', handleDemoReset);

  // Initial Boot
  updateTelemetrySummary();
});
