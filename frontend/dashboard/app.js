/**
 * DIGNITAS: Adaptive Authentication & SOC Gateway
 * Google-Style Minimal Portal, Pixel Phone 2-Step Prompt, & Security Mail Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentApp = 'bank';
  let activePrompt = null;
  let currentFilter = 'all';

  // DOM Elements - Navigation
  const tabPortal = document.getElementById('tab-portal');
  const tabSoc = document.getElementById('tab-soc');
  const viewPortal = document.getElementById('view-portal');
  const viewSoc = document.getElementById('view-soc');

  // DOM Elements - App Chips
  const chipAppBank = document.getElementById('chip-app-bank');
  const chipAppSocial = document.getElementById('chip-app-social');
  const portalAppTitle = document.getElementById('portal-app-title');

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

  // DOM Elements - Portal Sign In
  const formPortalLogin = document.getElementById('form-portal-login');
  const portalEmail = document.getElementById('portal-email');
  const portalPassword = document.getElementById('portal-password');
  const btnPortalSubmit = document.getElementById('btn-portal-submit');
  const portalResult = document.getElementById('portal-result');

  // DOM Elements - Demo Scenario Buttons
  const btnDemoFamiliar = document.getElementById('btn-demo-familiar');
  const btnDemoNewdev = document.getElementById('btn-demo-newdev');
  const btnDemoTor = document.getElementById('btn-demo-tor');
  const btnDemoHoney = document.getElementById('btn-demo-honey');

  // DOM Elements - Alice's Trusted Pixel Phone
  const phoneIdle = document.getElementById('phone-idle');
  const phonePrompt = document.getElementById('phone-prompt');
  const phoneFeedback = document.getElementById('phone-feedback');
  const promptValAccount = document.getElementById('prompt-val-account');
  const promptValDevice = document.getElementById('prompt-val-device');
  const promptValLocation = document.getElementById('prompt-val-location');
  const promptValTime = document.getElementById('prompt-val-time');
  const promptNumberChip = document.getElementById('prompt-number-chip');
  const btnPromptApprove = document.getElementById('btn-prompt-approve');
  const btnPromptDeny = document.getElementById('btn-prompt-deny');
  const btnFeedbackDismiss = document.getElementById('btn-feedback-dismiss');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackDesc = document.getElementById('feedback-desc');
  const phoneClock = document.getElementById('phone-clock');

  // DOM Elements - Security Email Inbox Drawer
  const btnToggleInbox = document.getElementById('btn-toggle-inbox');
  const btnCloseInbox = document.getElementById('btn-close-inbox');
  const inboxDrawer = document.getElementById('inbox-drawer');
  const inboxList = document.getElementById('inbox-list');
  const inboxCountBadge = document.getElementById('inbox-count-badge');

  // DOM Elements - SOC Metrics & Feed
  const statTotal = document.getElementById('stat-total');
  const statBlocked = document.getElementById('stat-blocked');
  const statChallenged = document.getElementById('stat-challenged');
  const statAllowed = document.getElementById('stat-allowed');
  const statLatency = document.getElementById('stat-latency');
  const statHoneytoken = document.getElementById('stat-honeytoken');
  const eventsTbody = document.getElementById('events-tbody');
  const btnRefreshFeed = document.getElementById('btn-refresh-feed');
  const filterPills = document.querySelectorAll('.filter-pill');
  const globalLatencyBadge = document.getElementById('global-latency-badge');
  const gatewayDot = document.getElementById('gateway-dot');
  const gatewayStatusText = document.getElementById('gateway-status-text');

  // DOM Elements - Account Lock Controls
  const inputLockEmail = document.getElementById('input-lock-email');
  const btnDoLock = document.getElementById('btn-do-lock');
  const btnDoUnlock = document.getElementById('btn-do-unlock');
  const lockStatusMsg = document.getElementById('lock-status-msg');

  // -------------------------------------------------------------
  // 1. Navigation & App Switching
  // -------------------------------------------------------------
  function switchView(viewName) {
    [tabPortal, tabSoc].forEach(t => t.classList.remove('active'));
    [viewPortal, viewSoc].forEach(v => v.classList.remove('active'));

    if (viewName === 'portal') {
      tabPortal.classList.add('active');
      viewPortal.classList.add('active');
    } else if (viewName === 'soc') {
      tabSoc.classList.add('active');
      viewSoc.classList.add('active');
      refreshSocData();
    }
  }

  tabPortal.addEventListener('click', () => switchView('portal'));
  tabSoc.addEventListener('click', () => switchView('soc'));

  chipAppBank.addEventListener('click', () => {
    chipAppBank.classList.add('active');
    chipAppSocial.classList.remove('active');
    currentApp = 'bank';
    portalAppTitle.textContent = 'Apex Trust Bank';
  });

  chipAppSocial.addEventListener('click', () => {
    chipAppSocial.classList.add('active');
    chipAppBank.classList.remove('active');
    currentApp = 'social';
    portalAppTitle.textContent = 'Pulse Social Platform';
  });

  // -------------------------------------------------------------
  // 2. Simulated Telemetry Drawer
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
  // 3. Google-Style Sign In Form Submission
  // -------------------------------------------------------------
  formPortalLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLoginAttempt(portalEmail.value, portalPassword.value);
  });

  async function handleLoginAttempt(email, password) {
    portalResult.classList.remove('hidden');
    portalResult.innerHTML = `<div class="spinner-inline"></div> Evaluating dynamic risk policy...`;
    btnPortalSubmit.disabled = true;
    btnPortalSubmit.textContent = 'Verifying...';

    const telem = getClientTelemetry();
    const payload = {
      app_id: currentApp,
      email: email,
      password: password,
      ...telem
    };

    try {
      const data = await apiLogin(payload);
      renderPortalResult(data);
      refreshSocData();
      fetchNotifications();

      // IF 2-Step Verification Prompt is triggered (New device or medium risk)
      if (data.requires_step_up || (data.prompt_details && data.action !== 'block')) {
        triggerPhoneGooglePrompt(data.prompt_details || {
          email: email,
          device_id: telem.device_id,
          city: telem.city,
          country: telem.country,
          app_id: currentApp,
          time: 'Just now',
          number_match: '42'
        });
      } else if (data.action === 'block') {
        // High-risk or honeytoken blocked: open security inbox drawer!
        setTimeout(() => {
          inboxDrawer.classList.add('open');
        }, 600);
      }
    } catch (err) {
      portalResult.innerHTML = `<div class="callout callout-danger">Login evaluation error: ${escapeHtml(err.message)}</div>`;
    } finally {
      btnPortalSubmit.disabled = false;
      btnPortalSubmit.textContent = 'Next';
    }
  }

  function renderPortalResult(data) {
    const actionClass = getActionBadgeClass(data.action);
    const scoreClass = getScoreClass(data.score ?? data.risk_score ?? 0);
    const reasons = (data.reasons || []).map(r => {
      let t = typeof r === 'object' && r !== null ? (r.detail || r.signal || JSON.stringify(r)) : String(r);
      return `<li>${escapeHtml(t)}</li>`;
    }).join('');

    const score = data.score ?? data.risk_score ?? 0;
    const latency = data.latency_ms ? data.latency_ms.toFixed(1) : '9.2';

    portalResult.innerHTML = `
      <div class="result-header">
        <span class="action-badge ${actionClass}">${(data.action || 'allow').toUpperCase()}</span>
        <span class="score-badge ${scoreClass}">Risk Score: ${score}/100</span>
        <span class="latency-tag">⚡ ${latency} ms</span>
      </div>
      <p class="result-msg">${escapeHtml(data.message || '')}</p>
      ${reasons ? `<ul class="reasons-bullet-list">${reasons}</ul>` : ''}
    `;
  }

  // -------------------------------------------------------------
  // 4. Alice's Trusted Phone Mockup: Google 2-Step Push Prompt
  // -------------------------------------------------------------
  function triggerPhoneGooglePrompt(prompt) {
    activePrompt = prompt;

    // Fill phone UI
    promptValAccount.textContent = prompt.email || 'alice@example.com';
    promptValDevice.textContent = prompt.device_id || 'Windows PC (Chrome)';
    promptValLocation.textContent = `${prompt.city || 'Delhi'}, ${prompt.country || 'IN'}`;
    promptValTime.textContent = prompt.time || 'Just now';
    promptNumberChip.textContent = prompt.number_match || '42';

    // Switch phone screen state
    phoneIdle.classList.add('hidden');
    phoneFeedback.classList.add('hidden');
    phonePrompt.classList.remove('hidden');

    // Subtle vibration visual
    phonePrompt.style.animation = 'none';
    phonePrompt.offsetHeight; // trigger reflow
    phonePrompt.style.animation = null;
  }

  // User taps [Yes, it's me] on Trusted Phone
  btnPromptApprove.addEventListener('click', async () => {
    if (!activePrompt) return;
    btnPromptApprove.disabled = true;
    btnPromptApprove.textContent = 'Verifying...';

    try {
      const res = await apiVerifyPrompt({
        email: activePrompt.email,
        device_id: activePrompt.device_id,
        app_id: activePrompt.app_id || currentApp,
        approved: true
      });

      // Show phone feedback
      phonePrompt.classList.add('hidden');
      phoneFeedback.classList.remove('hidden');
      feedbackIcon.textContent = '✅';
      feedbackTitle.textContent = 'Sign-in Approved';
      feedbackDesc.textContent = `Device "${activePrompt.device_id}" is now trusted in Alice's baseline.`;

      // Update Portal Card
      portalResult.innerHTML = `
        <div class="result-header">
          <span class="action-badge act-allow">APPROVED</span>
          <span class="score-badge sc-minimal">Risk Score: 0/100</span>
          <span class="latency-tag">⚡ 6.8 ms</span>
        </div>
        <p class="result-msg">Google 2-Step Prompt Approved! Welcome back, Alice.</p>
        <div class="callout callout-success" style="margin-top: 0.5rem; font-size: 0.8rem;">
          Device has been verified on Alice's primary phone and added to trusted baseline. Subsequent logins will be frictionless!
        </div>
      `;

      refreshSocData();
      fetchNotifications();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      btnPromptApprove.disabled = false;
      btnPromptApprove.textContent = "Yes, it's me";
    }
  });

  // User taps [No, it's not me] on Trusted Phone
  btnPromptDeny.addEventListener('click', async () => {
    if (!activePrompt) return;
    btnPromptDeny.disabled = true;
    btnPromptDeny.textContent = 'Locking...';

    try {
      const res = await apiVerifyPrompt({
        email: activePrompt.email,
        device_id: activePrompt.device_id,
        app_id: activePrompt.app_id || currentApp,
        approved: false
      });

      // Show phone feedback
      phonePrompt.classList.add('hidden');
      phoneFeedback.classList.remove('hidden');
      feedbackIcon.textContent = '🚨';
      feedbackTitle.textContent = 'Sign-in Rejected & Account Locked';
      feedbackDesc.textContent = `Unauthorized sign-in rejected. Account locked and intruder IP blacklisted.`;

      // Update Portal Card
      portalResult.innerHTML = `
        <div class="result-header">
          <span class="action-badge act-block">BLOCK & LOCK</span>
          <span class="score-badge sc-critical">Risk Score: 100/100</span>
          <span class="latency-tag">⚡ 8.0 ms</span>
        </div>
        <p class="result-msg">Security Alert: Login rejected by user on trusted phone. Account locked.</p>
      `;

      refreshSocData();
      fetchNotifications();
      setTimeout(() => { inboxDrawer.classList.add('open'); }, 800);
    } catch (err) {
      alert(`Rejection error: ${err.message}`);
    } finally {
      btnPromptDeny.disabled = false;
      btnPromptDeny.textContent = "No, it's not me";
    }
  });

  btnFeedbackDismiss.addEventListener('click', () => {
    phoneFeedback.classList.add('hidden');
    phonePrompt.classList.add('hidden');
    phoneIdle.classList.remove('hidden');
    activePrompt = null;
  });

  // -------------------------------------------------------------
  // 5. 1-Click Demo Buttons on Portal Card
  // -------------------------------------------------------------
  btnDemoFamiliar.addEventListener('click', () => {
    portalEmail.value = 'alice@example.com';
    portalPassword.value = 'Password123!';
    ctxIp.value = '103.21.244.2';
    ctxDevice.value = 'dev-alice-laptop';
    ctxCity.value = 'Delhi';
    ctxCountry.value = 'IN';
    ctxHour.value = 10;
    ctxVpn.checked = false;
    updatePillSummary();
    handleLoginAttempt('alice@example.com', 'Password123!');
  });

  btnDemoNewdev.addEventListener('click', () => {
    portalEmail.value = 'alice@example.com';
    portalPassword.value = 'Password123!';
    ctxIp.value = '103.21.244.2';
    ctxDevice.value = 'dev-alice-new-tablet';
    ctxCity.value = 'Delhi';
    ctxCountry.value = 'IN';
    ctxHour.value = 10;
    ctxVpn.checked = false;
    updatePillSummary();
    handleLoginAttempt('alice@example.com', 'Password123!');
  });

  btnDemoTor.addEventListener('click', () => {
    portalEmail.value = 'alice@example.com';
    portalPassword.value = 'Password123!';
    ctxIp.value = '185.220.101.5';
    ctxDevice.value = 'dev-tor-attacker';
    ctxCity.value = 'Moscow';
    ctxCountry.value = 'RU';
    ctxHour.value = 3;
    ctxVpn.checked = true;
    updatePillSummary();
    handleLoginAttempt('alice@example.com', 'Password123!');
  });

  btnDemoHoney.addEventListener('click', () => {
    portalEmail.value = 'backup_admin';
    portalPassword.value = 'AdminSecret2024!';
    ctxIp.value = '45.154.255.99';
    ctxDevice.value = 'dev-honeypot-bot';
    ctxCity.value = 'St. Petersburg';
    ctxCountry.value = 'RU';
    ctxHour.value = 1;
    ctxVpn.checked = true;
    updatePillSummary();
    handleLoginAttempt('backup_admin', 'AdminSecret2024!');
  });

  // -------------------------------------------------------------
  // 6. Instagram / Google Style Security Email Inbox Drawer
  // -------------------------------------------------------------
  btnToggleInbox.addEventListener('click', () => {
    inboxDrawer.classList.toggle('open');
  });

  btnCloseInbox.addEventListener('click', () => {
    inboxDrawer.classList.remove('open');
  });

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const notifs = await res.json();

      inboxCountBadge.textContent = notifs.length;

      if (!notifs || notifs.length === 0) {
        inboxList.innerHTML = `<div class="empty-state" style="padding: 2rem; color: #64748b; text-align: center;">No security alerts yet.</div>`;
        return;
      }

      inboxList.innerHTML = notifs.map(n => {
        const timeStr = n.timestamp ? new Date(n.timestamp).toLocaleTimeString() : 'Just now';
        const isThreat = (n.type === 'threat_blocked' || n.risk_score >= 80);
        const isPrompt = (n.type === 'new_device');
        const cardClass = isThreat ? 'card-alert-threat' : (isPrompt ? 'card-alert-prompt' : '');

        const reasonsHtml = (n.reasons || []).map(r => `<li>• ${escapeHtml(r)}</li>`).join('');

        return `
          <div class="email-card ${cardClass}">
            <div class="email-meta">
              <span class="email-sender">🛡️ Dignitas Security Service</span>
              <span>${timeStr}</span>
            </div>
            <div class="email-subject">${escapeHtml(n.subject)}</div>
            <div class="email-body">${escapeHtml(n.preview_body)}</div>
            ${reasonsHtml ? `<ul class="email-bullets">${reasonsHtml}</ul>` : ''}
            <div class="email-footer-actions">
              <button class="btn-email-action ${isThreat ? 'btn-email-danger' : ''}">Review Details</button>
              <button class="btn-email-action">Secure Account</button>
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  }

  // -------------------------------------------------------------
  // 7. SOC Live Telemetry & Feed (Metrics & Table)
  // -------------------------------------------------------------
  async function refreshSocData() {
    checkGatewayHealth();
    fetchStats();
    fetchEvents();
  }

  async function checkGatewayHealth() {
    try {
      const t0 = performance.now();
      const res = await fetch('/api/health');
      const latency = Math.round(performance.now() - t0);
      if (res.ok) {
        gatewayDot.className = 'status-dot online';
        gatewayStatusText.textContent = 'Gateway Online';
        globalLatencyBadge.textContent = `${latency} ms`;
      }
    } catch {
      gatewayDot.className = 'status-dot offline';
      gatewayStatusText.textContent = 'Gateway Offline';
      globalLatencyBadge.textContent = 'ERR';
    }
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
        eventsTbody.innerHTML = `<tr><td colspan="8" class="empty-state">No login events recorded yet. Trigger a simulated login!</td></tr>`;
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
          if (typeof r === 'string') text = r;
          else if (typeof r === 'object' && r !== null) text = r.detail || r.signal || JSON.stringify(r);
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

  // Filter Pills in SOC view
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
    refreshSocData();
    setTimeout(() => { btnRefreshFeed.textContent = '↻ Refresh'; }, 600);
  });

  // -------------------------------------------------------------
  // 8. Emergency Account Lock / Unlock
  // -------------------------------------------------------------
  btnDoLock.addEventListener('click', async () => {
    const email = inputLockEmail.value.trim();
    if (!email) return;
    try {
      const res = await fetch(`/api/dashboard/users/${encodeURIComponent(email)}/lock`, { method: 'POST' });
      const data = await res.json();
      lockStatusMsg.className = 'lock-status status-danger';
      lockStatusMsg.textContent = `🔒 ${data.message || 'Account locked'}`;
      refreshSocData();
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
      refreshSocData();
    } catch {
      lockStatusMsg.className = 'lock-status status-danger';
      lockStatusMsg.textContent = 'Unlock action failed.';
    }
  });

  // -------------------------------------------------------------
  // 9. API HTTP Wrappers & Helpers
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

  function getActionBadgeClass(action) {
    if (!action) return 'act-allow';
    const a = action.toLowerCase();
    if (a.includes('block')) return 'act-block';
    if (a.includes('reset')) return 'act-reset';
    if (a.includes('otp')) return 'act-otp';
    if (a.includes('captcha') || a.includes('prompt')) return 'act-captcha';
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
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initialize Clock & Polling
  function updatePhoneClock() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    if (phoneClock) phoneClock.textContent = `${hrs}:${mins}`;
  }
  updatePhoneClock();
  setInterval(updatePhoneClock, 30000);

  refreshSocData();
  fetchNotifications();
  setInterval(() => {
    refreshSocData();
    fetchNotifications();
  }, 3500);
});
