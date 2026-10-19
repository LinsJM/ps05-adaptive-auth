/**
 * DIGNITAS: Adaptive Authentication & SOC Gateway Dashboard
 * Interactive Client Logic & Demo Simulation Suite
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentFilter = 'all';
  let activeChallenge = null;
  let pollInterval = null;

  // DOM Elements - Navigation
  const tabDashboard = document.getElementById('tab-dashboard');
  const tabBank = document.getElementById('tab-bank');
  const tabSocial = document.getElementById('tab-social');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewBank = document.getElementById('view-bank');
  const viewSocial = document.getElementById('view-social');

  // DOM Elements - Telemetry Drawer
  const btnToggleContext = document.getElementById('btn-toggle-context');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const contextDrawer = document.getElementById('context-drawer');
  const pillSummary = document.getElementById('pill-summary');
  const ctxIp = document.getElementById('ctx-ip');
  const ctxDevice = document.getElementById('ctx-device');
  const ctxCity = document.getElementById('ctx-city');
  const ctxCountry = document.getElementById('ctx-country');
  const ctxHour = document.getElementById('ctx-hour');
  const ctxMins = document.getElementById('ctx-mins');
  const ctxVpn = document.getElementById('ctx-vpn');
  const presetButtons = document.querySelectorAll('.btn-preset');

  // DOM Elements - Stats
  const statTotal = document.getElementById('stat-total');
  const statBlocked = document.getElementById('stat-blocked');
  const statChallenged = document.getElementById('stat-challenged');
  const statAllowed = document.getElementById('stat-allowed');
  const statLatency = document.getElementById('stat-latency');
  const statHoneytoken = document.getElementById('stat-honeytoken');
  const globalLatencyBadge = document.getElementById('global-latency-badge');
  const gatewayDot = document.getElementById('gateway-dot');
  const gatewayStatusText = document.getElementById('gateway-status-text');

  // DOM Elements - Feed
  const eventsTbody = document.getElementById('events-tbody');
  const btnRefreshFeed = document.getElementById('btn-refresh-feed');
  const filterPills = document.querySelectorAll('.filter-pill');

  // DOM Elements - Lock Controls
  const inputLockEmail = document.getElementById('input-lock-email');
  const btnDoLock = document.getElementById('btn-do-lock');
  const btnDoUnlock = document.getElementById('btn-do-unlock');
  const lockStatusMsg = document.getElementById('lock-status-msg');

  // DOM Elements - Simulator
  const simButtons = document.querySelectorAll('.btn-sim');
  const btnResetDemo = document.getElementById('btn-reset-demo');

  // DOM Elements - Mock Bank & Social
  const formBank = document.getElementById('form-bank-login');
  const bankEmail = document.getElementById('bank-email');
  const bankPassword = document.getElementById('bank-password');
  const bankResult = document.getElementById('bank-result');
  const linkFillAlice = document.getElementById('link-fill-alice');
  const linkFillHoneytoken = document.getElementById('link-fill-honeytoken');

  const formSocial = document.getElementById('form-social-login');
  const socialEmail = document.getElementById('social-email');
  const socialPassword = document.getElementById('social-password');
  const socialResult = document.getElementById('social-result');

  // DOM Elements - Step Up Modal
  const stepUpModal = document.getElementById('step-up-modal');
  const btnCloseStepup = document.getElementById('btn-close-stepup');
  const modalRiskScore = document.getElementById('modal-risk-score');
  const modalRiskAction = document.getElementById('modal-risk-action');
  const modalInstructions = document.getElementById('modal-instructions');
  const challengeContent = document.getElementById('challenge-content');
  const demoCodeVal = document.getElementById('demo-code-val');
  const btnPasteCode = document.getElementById('btn-paste-code');

  // -------------------------------------------------------------
  // 1. Navigation / View Switching
  // -------------------------------------------------------------
  function switchView(viewName) {
    [tabDashboard, tabBank, tabSocial].forEach(t => t.classList.remove('active'));
    [viewDashboard, viewBank, viewSocial].forEach(v => v.classList.remove('active'));

    if (viewName === 'dashboard') {
      tabDashboard.classList.add('active');
      viewDashboard.classList.add('active');
      refreshAll();
    } else if (viewName === 'bank') {
      tabBank.classList.add('active');
      viewBank.classList.add('active');
    } else if (viewName === 'social') {
      tabSocial.classList.add('active');
      viewSocial.classList.add('active');
    }
  }

  tabDashboard.addEventListener('click', () => switchView('dashboard'));
  tabBank.addEventListener('click', () => switchView('bank'));
  tabSocial.addEventListener('click', () => switchView('social'));

  // -------------------------------------------------------------
  // 2. Simulated Context Drawer
  // -------------------------------------------------------------
  btnToggleContext.addEventListener('click', () => {
    contextDrawer.classList.toggle('open');
  });
  btnCloseDrawer.addEventListener('click', () => {
    contextDrawer.classList.remove('open');
  });

  function updatePillSummary() {
    const city = ctxCity.value || 'Unknown';
    const country = ctxCountry.value || 'XX';
    const dev = ctxDevice.value || 'unknown-device';
    const hr = ctxHour.value ? `${ctxHour.value}:00 UTC` : 'Now';
    const vpn = ctxVpn.checked ? ' • 🛡️ VPN/Tor' : '';
    pillSummary.textContent = `${city}, ${country} • ${dev} • ${hr}${vpn}`;
  }

  [ctxIp, ctxDevice, ctxCity, ctxCountry, ctxHour, ctxMins, ctxVpn].forEach(input => {
    input.addEventListener('change', updatePillSummary);
  });

  const presets = {
    normal: { ip: '103.21.244.2', device: 'dev-alice-laptop', city: 'Delhi', country: 'IN', hour: 10, mins: '', vpn: false },
    'new-device': { ip: '103.21.244.2', device: 'dev-alice-phone-new', city: 'Delhi', country: 'IN', hour: 10, mins: '', vpn: false },
    'tor-foreign': { ip: '185.220.101.5', device: 'dev-unknown-attacker', city: 'Moscow', country: 'RU', hour: 3, mins: '', vpn: true },
    impossible: { ip: '185.86.151.11', device: 'dev-alice-laptop', city: 'London', country: 'GB', hour: 11, mins: 5, vpn: false }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = presets[btn.dataset.preset];
      if (p) {
        ctxIp.value = p.ip;
        ctxDevice.value = p.device;
        ctxCity.value = p.city;
        ctxCountry.value = p.country;
        ctxHour.value = p.hour;
        ctxMins.value = p.mins;
        ctxVpn.checked = p.vpn;
        updatePillSummary();
      }
    });
  });

  function getClientTelemetry() {
    return {
      ip_address: ctxIp.value.trim() || '127.0.0.1',
      device_id: ctxDevice.value.trim() || 'dev-unknown',
      city: ctxCity.value.trim() || 'Delhi',
      country: ctxCountry.value.trim() || 'IN',
      simulated_hour: ctxHour.value !== '' ? parseInt(ctxHour.value, 10) : null,
      minutes_since_last_login: ctxMins.value !== '' ? parseInt(ctxMins.value, 10) : null,
      is_vpn: ctxVpn.checked
    };
  }

  // -------------------------------------------------------------
  // 3. API Health & Gateway Polling
  // -------------------------------------------------------------
  async function checkGatewayHealth() {
    try {
      const t0 = performance.now();
      const res = await fetch('/api/health');
      const latency = Math.round(performance.now() - t0);
      if (res.ok) {
        gatewayDot.className = 'status-dot online';
        gatewayStatusText.textContent = 'Gateway Online';
        globalLatencyBadge.textContent = `${latency} ms`;
        return true;
      }
    } catch {
      gatewayDot.className = 'status-dot offline';
      gatewayStatusText.textContent = 'Gateway Offline';
      globalLatencyBadge.textContent = 'ERR';
    }
    return false;
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        const total = (data.total_events !== undefined) ? data.total_events : (data.total_logins || 0);
        const blocked = (data.blocked_count !== undefined) ? data.blocked_count : (data.blocked_logins || 0);
        const challenged = (data.challenged_count !== undefined) ? data.challenged_count : (data.challenged_logins || 0);
        const allowed = (data.allowed_count !== undefined) ? data.allowed_count : (data.allowed_logins || 0);
        const latency = (data.average_latency_ms !== undefined) ? data.average_latency_ms : 8.4;
        const honeytoken = (data.honeytoken_hits !== undefined) ? data.honeytoken_hits : 0;

        statTotal.textContent = total.toLocaleString();
        statBlocked.textContent = blocked.toLocaleString();
        statChallenged.textContent = challenged.toLocaleString();
        statAllowed.textContent = allowed.toLocaleString();
        statLatency.textContent = `${latency.toFixed(1)} ms`;
        statHoneytoken.textContent = honeytoken.toLocaleString();
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }

  async function fetchEvents() {
    try {
      const url = currentFilter === 'all' 
        ? '/api/dashboard/events?limit=40' 
        : `/api/dashboard/events?limit=40&app_id=${currentFilter}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const events = await res.json();

      if (!events || events.length === 0) {
        eventsTbody.innerHTML = `<tr><td colspan="8" class="empty-state">No login events recorded yet. Trigger a simulated login above!</td></tr>`;
        return;
      }

      eventsTbody.innerHTML = events.map(ev => {
        const rawTime = ev.timestamp || ev.created_at;
        const timeStr = rawTime ? new Date(rawTime).toLocaleTimeString() : 'Just now';
        const rawAction = ev.action || ev.decision || 'allow';
        const actionClass = getActionBadgeClass(rawAction);
        const score = (ev.score !== undefined) ? ev.score : (ev.risk_score || 0);
        const scoreClass = getScoreClass(score);
        const userIdentifier = ev.email_attempted || ev.user_identifier || 'unknown';
        const isHoney = (userIdentifier === 'backup_admin') ? ' <span class="honey-pill">HONEYTOKEN</span>' : '';
        const appBadge = (ev.app_id === 'bank') 
          ? '<span class="badge-app app-bank">🏦 BANK</span>' 
          : '<span class="badge-app app-social">🌐 SOCIAL</span>';

        const reasonsList = (ev.reasons || []).map(r => {
          let text = '';
          if (typeof r === 'string') {
            text = r;
          } else if (typeof r === 'object' && r !== null) {
            text = r.detail || r.signal || JSON.stringify(r);
          }
          return `<span class="reason-tag">${escapeHtml(text)}</span>`;
        }).join('');

        return `
          <tr class="${score >= 80 ? 'tr-high-risk' : ''}">
            <td class="cell-time">${timeStr}</td>
            <td>${appBadge}</td>
            <td class="cell-user"><strong>${escapeHtml(userIdentifier)}</strong>${isHoney}</td>
            <td>${escapeHtml(ev.city || '')}${ev.country ? `, ${escapeHtml(ev.country)}` : ''} <span class="text-muted">(${escapeHtml(ev.ip_address)})</span></td>
            <td><code class="device-tag">${escapeHtml(ev.device_id || 'unknown')}</code></td>
            <td><span class="score-badge ${scoreClass}">${score}</span></td>
            <td><span class="action-badge ${actionClass}">${rawAction.toUpperCase()}</span></td>
            <td class="cell-reasons">${reasonsList || '<span class="text-muted">None (Normal Baseline)</span>'}</td>
          </tr>
        `;
      }).join('');
    } catch (e) {
      console.error('Failed to fetch events:', e);
    }
  }

  function getActionBadgeClass(action) {
    if (!action) return 'act-allow';
    const a = action.toLowerCase();
    if (a.includes('block')) return 'act-block';
    if (a.includes('reset')) return 'act-reset';
    if (a.includes('otp')) return 'act-otp';
    if (a.includes('captcha')) return 'act-captcha';
    return 'act-allow';
  }

  function getScoreClass(score) {
    if (score >= 80) return 'sc-critical';
    if (score >= 61) return 'sc-high';
    if (score >= 45) return 'sc-medium';
    if (score >= 30) return 'sc-low';
    return 'sc-minimal';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function refreshAll() {
    checkGatewayHealth();
    fetchStats();
    fetchEvents();
  }

  // Filter Buttons
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      fetchEvents();
    });
  });

  btnRefreshFeed.addEventListener('click', () => {
    btnRefreshFeed.textContent = '↻ Syncing...';
    refreshAll();
    setTimeout(() => { btnRefreshFeed.textContent = '↻ Refresh'; }, 600);
  });

  // Start polling
  refreshAll();
  pollInterval = setInterval(refreshAll, 3000);

  // -------------------------------------------------------------
  // 4. Emergency Account Lock / Unlock
  // -------------------------------------------------------------
  btnDoLock.addEventListener('click', async () => {
    const email = inputLockEmail.value.trim();
    if (!email) return;
    try {
      const res = await fetch(`/api/dashboard/users/${encodeURIComponent(email)}/lock`, { method: 'POST' });
      const data = await res.json();
      lockStatusMsg.className = 'lock-status status-danger';
      lockStatusMsg.textContent = `🔒 ${data.message || 'Account locked'}`;
      refreshAll();
    } catch {
      lockStatusMsg.className = 'lock-status status-danger';
      lockStatusMsg.textContent = 'Lock action failed.';
    }
  });

  btnDoUnlock.addEventListener('click', async () => {
    const email = inputLockEmail.value.trim();
    if (!email) return;
    try {
      const res = await fetch(`/api/dashboard/users/${encodeURIComponent(email)}/unlock`, { method: 'POST' });
      const data = await res.json();
      lockStatusMsg.className = 'lock-status status-success';
      lockStatusMsg.textContent = `🔓 ${data.message || 'Account unlocked'}`;
      refreshAll();
    } catch {
      lockStatusMsg.className = 'lock-status status-danger';
      lockStatusMsg.textContent = 'Unlock action failed.';
    }
  });

  // -------------------------------------------------------------
  // 5. 8-Scenario Live Attack Simulator Buttons
  // -------------------------------------------------------------
  simButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const simId = btn.dataset.sim;
      if (!simId) return;
      btn.disabled = true;
      const originalText = btn.innerHTML;
      btn.innerHTML = `⏳ Executing...`;

      try {
        await executeSimulatorScenario(parseInt(simId, 10));
        refreshAll();
      } catch (err) {
        console.error('Simulator scenario failed:', err);
      } finally {
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 800);
      }
    });
  });

  async function executeSimulatorScenario(id) {
    switch (id) {
      case 1:
        // Scenario 1: Normal Login (Alice, Bank)
        await apiLogin({
          app_id: 'bank',
          email: 'alice@example.com',
          password: 'Password123!',
          ip_address: '103.21.244.2',
          device_id: 'dev-alice-laptop',
          city: 'Delhi',
          country: 'IN',
          simulated_hour: 10,
          is_vpn: false
        });
        break;

      case 2:
        // Scenario 2: New Device (Alice, Bank -> step-up)
        const resp2 = await apiLogin({
          app_id: 'bank',
          email: 'alice@example.com',
          password: 'Password123!',
          ip_address: '103.21.244.2',
          device_id: 'dev-alice-new-tablet',
          city: 'Delhi',
          country: 'IN',
          simulated_hour: 10,
          is_vpn: false
        });
        if (resp2.action !== 'allow') {
          showStepUpModal(resp2, 'bank', 'alice@example.com', 'dev-alice-new-tablet');
        }
        break;

      case 3:
        // Scenario 3: Foreign Tor 3AM (Bob, Bank -> block)
        await apiLogin({
          app_id: 'bank',
          email: 'bob@example.com',
          password: 'Password123!',
          ip_address: '185.220.101.5',
          device_id: 'dev-unknown-attacker',
          city: 'Moscow',
          country: 'RU',
          simulated_hour: 3,
          is_vpn: true
        });
        break;

      case 4:
        // Scenario 4: Rapid Brute Force (5 rapid failures)
        for (let i = 0; i < 4; i++) {
          await apiLogin({
            app_id: 'bank',
            email: 'bob@example.com',
            password: 'WrongPassword!',
            ip_address: '198.51.100.22',
            device_id: 'dev-brute-tool',
            city: 'Berlin',
            country: 'DE',
            simulated_hour: 14,
            is_vpn: false
          });
        }
        // 5th attempt triggers lockout
        await apiLogin({
          app_id: 'bank',
          email: 'bob@example.com',
          password: 'WrongPassword!',
          ip_address: '198.51.100.22',
          device_id: 'dev-brute-tool',
          city: 'Berlin',
          country: 'DE',
          simulated_hour: 14,
          is_vpn: false
        });
        break;

      case 5:
        // Scenario 5: Cross-App Correlation (Attack Bank, then log into Social)
        // 1. Attack on Bank
        await apiLogin({
          app_id: 'bank',
          email: 'alice@example.com',
          password: 'WrongPassword!',
          ip_address: '198.51.100.44',
          device_id: 'dev-cross-tool',
          city: 'London',
          country: 'GB',
          simulated_hour: 2,
          is_vpn: true
        });
        // 2. Immediate login to Social from unknown context
        const resp5 = await apiLogin({
          app_id: 'social',
          email: 'alice@example.com',
          password: 'Password123!',
          ip_address: '198.51.100.44',
          device_id: 'dev-cross-tool',
          city: 'London',
          country: 'GB',
          simulated_hour: 2,
          is_vpn: true
        });
        if (resp5.action !== 'allow') {
          showStepUpModal(resp5, 'social', 'alice@example.com', 'dev-cross-tool');
        }
        break;

      case 6:
        // Scenario 6: Hit Honeytoken (backup_admin)
        await apiLogin({
          app_id: 'bank',
          email: 'backup_admin',
          password: 'AdminPassword123!',
          ip_address: '45.154.255.99',
          device_id: 'dev-honeypot-bot',
          city: 'St. Petersburg',
          country: 'RU',
          simulated_hour: 1,
          is_vpn: true
        });
        break;

      case 7:
        // Scenario 7: Post-MFA Baseline Adaptation
        // 1. New device triggers challenge
        const resp7 = await apiLogin({
          app_id: 'bank',
          email: 'alice@example.com',
          password: 'Password123!',
          ip_address: '103.21.244.2',
          device_id: 'dev-alice-ipad-pro',
          city: 'Delhi',
          country: 'IN',
          simulated_hour: 10,
          is_vpn: false
        });
        // 2. Automatically solve step-up
        if (resp7.challenge_id) {
          await apiVerifyStepUp(resp7.challenge_id, '123456');
          // 3. Second login with newly trusted device -> Risk 0 ALLOW!
          await apiLogin({
            app_id: 'bank',
            email: 'alice@example.com',
            password: 'Password123!',
            ip_address: '103.21.244.2',
            device_id: 'dev-alice-ipad-pro',
            city: 'Delhi',
            country: 'IN',
            simulated_hour: 10,
            is_vpn: false
          });
        }
        break;
    }
  }

  // One-Click Demo Reset
  btnResetDemo.addEventListener('click', async () => {
    btnResetDemo.disabled = true;
    btnResetDemo.innerHTML = '⏳ Resetting Data...';
    try {
      const res = await fetch('/api/dashboard/reset-demo', { method: 'POST' });
      if (res.ok) {
        refreshAll();
      }
    } catch (e) {
      console.error('Reset failed:', e);
    } finally {
      setTimeout(() => {
        btnResetDemo.disabled = false;
        btnResetDemo.innerHTML = '🔄 One-Click Demo Reset';
      }, 700);
    }
  });

  // -------------------------------------------------------------
  // 6. Mock Application Login Forms (Bank & Social)
  // -------------------------------------------------------------
  linkFillAlice.addEventListener('click', () => {
    bankEmail.value = 'alice@example.com';
    bankPassword.value = 'Password123!';
  });

  linkFillHoneytoken.addEventListener('click', () => {
    bankEmail.value = 'backup_admin';
    bankPassword.value = 'AdminSecret2024!';
  });

  formBank.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleAppLoginSubmit('bank', bankEmail.value, bankPassword.value, bankResult);
  });

  formSocial.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleAppLoginSubmit('social', socialEmail.value, socialPassword.value, socialResult);
  });

  async function handleAppLoginSubmit(appId, email, password, resultEl) {
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `<div class="spinner-inline"></div> Evaluating security telemetry...`;

    const telem = getClientTelemetry();
    const payload = {
      app_id: appId,
      email: email,
      password: password,
      ...telem
    };

    try {
      const data = await apiLogin(payload);
      renderLoginResultCallout(resultEl, data);
      refreshAll();

      if (data.action !== 'allow' && data.challenge_id) {
        setTimeout(() => {
          showStepUpModal(data, appId, email, telem.device_id);
        }, 700);
      }
    } catch (err) {
      resultEl.innerHTML = `<div class="callout callout-danger">Login failed: ${escapeHtml(err.message)}</div>`;
    }
  }

  function renderLoginResultCallout(container, data) {
    const actionClass = getActionBadgeClass(data.action);
    const scoreClass = getScoreClass(data.risk_score);
    const reasonsHtml = (data.reasons || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');

    container.innerHTML = `
      <div class="result-header">
        <span class="action-badge ${actionClass}">${(data.action || 'allow').toUpperCase()}</span>
        <span class="score-badge ${scoreClass}">Risk Score: ${data.risk_score} / 100</span>
        <span class="latency-tag">⚡ ${data.latency_ms ? data.latency_ms.toFixed(1) : 10} ms</span>
      </div>
      <p class="result-msg">${escapeHtml(data.message || '')}</p>
      ${reasonsHtml ? `<ul class="reasons-bullet-list">${reasonsHtml}</ul>` : ''}
    `;
  }

  // -------------------------------------------------------------
  // 7. Adaptive Step-Up Verification Modal
  // -------------------------------------------------------------
  function showStepUpModal(data, appId, email, deviceId) {
    activeChallenge = {
      challenge_id: data.challenge_id,
      challenge_type: data.challenge_type || 'email_otp',
      app_id: appId,
      email: email,
      device_id: deviceId
    };

    modalRiskScore.textContent = data.risk_score;
    modalRiskAction.textContent = (data.action || 'CHALLENGE').toUpperCase();
    modalRiskAction.className = `badge-action ${getActionBadgeClass(data.action)}`;

    demoCodeVal.textContent = data.challenge_id ? data.challenge_id.substring(0, 6).toUpperCase() : '849201';

    if (data.action === 'captcha') {
      modalInstructions.textContent = 'Light verification required. Solve the security verification below.';
      challengeContent.innerHTML = `
        <div class="captcha-box">
          <div class="captcha-math">What is <strong>7 + 5</strong> ?</div>
          <input type="text" id="input-captcha-answer" class="challenge-input" placeholder="Enter answer (12)" autofocus>
          <button class="btn-verify-submit" id="btn-submit-challenge">Verify & Complete Login</button>
        </div>
      `;
    } else if (data.action === 'otp_and_reset') {
      modalInstructions.textContent = 'High risk context detected. One-Time Password and password reset required.';
      challengeContent.innerHTML = `
        <div class="otp-box">
          <input type="text" id="input-otp-code" class="challenge-input" placeholder="6-digit OTP Code" maxlength="6" autofocus>
          <input type="password" id="input-new-password" class="challenge-input" placeholder="New Password (min 8 chars)">
          <button class="btn-verify-submit" id="btn-submit-challenge">Verify & Reset Password</button>
        </div>
      `;
    } else {
      // email_otp default
      modalInstructions.textContent = 'Step-up authentication required. Enter the 6-digit verification code sent to your registered device.';
      challengeContent.innerHTML = `
        <div class="otp-box">
          <input type="text" id="input-otp-code" class="challenge-input" placeholder="6-digit OTP Code (e.g. 123456)" maxlength="6" autofocus>
          <button class="btn-verify-submit" id="btn-submit-challenge">Verify & Continue</button>
        </div>
      `;
    }

    stepUpModal.classList.remove('hidden');

    const submitBtn = document.getElementById('btn-submit-challenge');
    submitBtn.addEventListener('click', handleStepUpSubmit);
  }

  btnPasteCode.addEventListener('click', () => {
    const inputOtp = document.getElementById('input-otp-code');
    const inputCaptcha = document.getElementById('input-captcha-answer');
    if (inputOtp) inputOtp.value = '123456';
    if (inputCaptcha) inputCaptcha.value = '12';
  });

  btnCloseStepup.addEventListener('click', () => {
    stepUpModal.classList.add('hidden');
    activeChallenge = null;
  });

  async function handleStepUpSubmit() {
    if (!activeChallenge) return;
    const submitBtn = document.getElementById('btn-submit-challenge');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';

    const inputOtp = document.getElementById('input-otp-code');
    const inputCaptcha = document.getElementById('input-captcha-answer');
    const inputNewPass = document.getElementById('input-new-password');

    let answer = '123456';
    if (inputOtp && inputOtp.value.trim()) answer = inputOtp.value.trim();
    if (inputCaptcha && inputCaptcha.value.trim()) answer = inputCaptcha.value.trim();

    try {
      const res = await apiVerifyStepUp(activeChallenge.challenge_id, answer, inputNewPass ? inputNewPass.value : null);
      if (res.verified) {
        stepUpModal.classList.add('hidden');
        alert(`✅ Step-Up Verification Successful!\nDevice "${activeChallenge.device_id}" is now trusted in Alice's baseline.`);
        refreshAll();
      } else {
        alert(`❌ Verification Failed: ${res.message || 'Incorrect response'}`);
      }
    } catch (err) {
      alert(`Verification error: ${err.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Verify';
    }
  }

  // -------------------------------------------------------------
  // 8. Gateway HTTP Client Wrappers
  // -------------------------------------------------------------
  async function apiLogin(payload) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async function apiVerifyStepUp(challengeId, code, newPassword = null) {
    const payload = {
      challenge_id: challengeId,
      code: code
    };
    if (newPassword) payload.new_password = newPassword;

    const res = await fetch('/api/verify-stepup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }
});
