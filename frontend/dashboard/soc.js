/**
 * DIGNITAS: Security Operations Center (SOC) Controller
 * Real-time event stream sync, multi-app metrics, emergency locks, and live demo triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentFilter = 'all';
  let pollInterval = null;

  // DOM Elements - Metrics
  const statTotal = document.getElementById('stat-total');
  const statBlocked = document.getElementById('stat-blocked');
  const statChallenged = document.getElementById('stat-challenged');
  const statAllowed = document.getElementById('stat-allowed');
  const statLatency = document.getElementById('stat-latency');
  const statHoneytoken = document.getElementById('stat-honeytoken');

  // DOM Elements - Ledger Table
  const ledgerTbody = document.getElementById('ledger-tbody');
  const btnRefreshLedger = document.getElementById('btn-refresh-ledger');
  const ledgerFilters = document.querySelectorAll('.ledger-filter');

  // DOM Elements - Emergency Controls
  const inputLockEmail = document.getElementById('input-lock-email');
  const btnDoLock = document.getElementById('btn-do-lock');
  const btnDoUnlock = document.getElementById('btn-do-unlock');
  const lockFeedback = document.getElementById('lock-feedback');

  // Scenarios Definition (for live attack simulation directly from SOC)
  const scenarios = {
    1: { name: 'Familiar Login', email: 'alice@example.com', pass: 'Password123!', app: 'bank', ip: '103.21.244.2', dev: 'dev-alice-laptop', city: 'Delhi', country: 'IN', hour: 10, mins: null, vpn: false },
    2: { name: 'New Device', email: 'alice@example.com', pass: 'Password123!', app: 'bank', ip: '103.21.244.2', dev: 'dev-alice-tablet-unseen', city: 'Delhi', country: 'IN', hour: 10, mins: null, vpn: false },
    3: { name: 'Tor 3 AM Intrusion', email: 'alice@example.com', pass: 'Password123!', app: 'bank', ip: '185.220.101.5', dev: 'dev-tor-attacker', city: 'Moscow', country: 'RU', hour: 3, mins: null, vpn: true },
    4: { name: 'Brute Force Defense', email: 'alice@example.com', pass: 'WrongPassword!', app: 'bank', ip: '103.21.244.2', dev: 'dev-alice-laptop', city: 'Delhi', country: 'IN', hour: 10, mins: null, vpn: false },
    5: { name: 'Cross-App Threat', email: 'bob@example.com', pass: 'Password123!', app: 'social', ip: '103.21.244.2', dev: 'dev-bob-laptop', city: 'Delhi', country: 'IN', hour: 10, mins: null, vpn: false },
    6: { name: 'Honeytoken Trap', email: 'backup_admin', pass: 'AdminSecret2024!', app: 'bank', ip: '45.154.255.99', dev: 'dev-honeypot-bot', city: 'St. Petersburg', country: 'RU', hour: 1, mins: null, vpn: true },
    7: { name: 'Adapted Baseline', email: 'alice@example.com', pass: 'Password123!', app: 'bank', ip: '103.21.244.2', dev: 'dev-alice-laptop', city: 'Delhi', country: 'IN', hour: 10, mins: null, vpn: false },
    8: { name: 'Impossible Velocity', email: 'alice@example.com', pass: 'Password123!', app: 'bank', ip: '185.86.151.11', dev: 'dev-alice-laptop', city: 'London', country: 'GB', hour: 11, mins: 15, vpn: false }
  };

  async function triggerScenario(num) {
    const sc = scenarios[num];
    if (!sc) return;

    // Visual button outline
    document.querySelectorAll('.btn-scenario').forEach(b => b.style.outline = 'none');
    const activeBtn = document.getElementById(`btn-sc-${num}`);
    if (activeBtn) {
      activeBtn.style.outline = '2px solid var(--accent-navy)';
      setTimeout(() => { activeBtn.style.outline = 'none'; }, 1000);
    }

    try {
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: sc.app,
          email: sc.email,
          password: sc.pass,
          ip_address: sc.ip,
          device_id: sc.dev,
          city: sc.city,
          country: sc.country,
          hour: sc.hour,
          minutes_since_last_login: sc.mins,
          is_vpn: sc.vpn
        })
      });
      // Refresh feed immediately
      refreshSocData();
    } catch (err) {
      console.error('Scenario execution error:', err);
    }
  }

  // Keyboard Shortcuts: Keys 1 to 8
  window.addEventListener('keydown', (e) => {
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

  // Expose globally for inline DOM calls
  window.triggerScenario = triggerScenario;

  // Refresh SOC Data
  async function refreshSocData() {
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/dashboard/stats');
      if (statsRes.ok) {
        const stats = await statsRes.json();
        if (statTotal) statTotal.textContent = stats.total_events || 0;
        if (statBlocked) statBlocked.textContent = stats.blocked_count || 0;
        if (statChallenged) statChallenged.textContent = stats.challenged_count || 0;
        if (statAllowed) statAllowed.textContent = stats.allowed_count || 0;
        if (statLatency) statLatency.textContent = `${stats.average_latency_ms || 9.2} ms`;
        if (statHoneytoken) statHoneytoken.textContent = stats.honeytoken_hits || 0;
      }

      // 2. Fetch Events
      const url = currentFilter === 'all' 
        ? '/api/dashboard/events?limit=40' 
        : `/api/dashboard/events?app_id=${currentFilter}&limit=40`;
      
      const eventsRes = await fetch(url);
      if (eventsRes.ok) {
        const events = await eventsRes.json();
        renderLedgerTable(events);
      }
    } catch (err) {
      console.error('Error refreshing SOC data:', err);
    }
  }

  function renderLedgerTable(events) {
    if (!ledgerTbody) return;
    if (!events || events.length === 0) {
      ledgerTbody.innerHTML = `
        <tr>
          <td colspan="8" class="table-empty">No authentication events recorded yet.</td>
        </tr>
      `;
      return;
    }

    ledgerTbody.innerHTML = events.map(ev => {
      const timeStr = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '--:--';
      const appBadge = ev.app_id === 'social' ? 'Pulse Social' : 'Apex Bank';
      const score = ev.score ?? 0;

      let tagClass = 'tag-allow';
      let tagText = 'ALLOW';
      if (ev.action === 'block' || ev.decision === 'restrict' || score >= 80) {
        tagClass = 'tag-block';
        tagText = 'BLOCK';
      } else if (ev.action !== 'allow' || score >= 30) {
        tagClass = 'tag-stepup';
        tagText = (ev.action || 'CHALLENGE').toUpperCase();
      }

      const reasonsSnippet = (ev.reasons || []).map(r => {
        const p = typeof r.points === 'number' ? `+${r.points} ` : '';
        const s = r.signal || r.detail || JSON.stringify(r);
        return `<span style="font-weight:600;">${escapeHtml(p)}${escapeHtml(s)}</span>`;
      }).join(', ') || 'Baseline pass';

      const vpnBadge = ev.is_vpn ? ' <span style="color:#DC2626; font-weight:700;">[VPN]</span>' : '';

      return `
        <tr>
          <td style="font-family: var(--font-mono);">${timeStr}</td>
          <td><strong>${appBadge}</strong></td>
          <td style="font-family: var(--font-mono);">${escapeHtml(ev.email_attempted || '')}</td>
          <td>${escapeHtml(ev.city || 'Unknown')}, ${escapeHtml(ev.country || '')}${vpnBadge}</td>
          <td style="font-family: var(--font-mono); font-size: 0.68rem;">${escapeHtml(ev.device_id || '')}</td>
          <td class="table-score">${score}</td>
          <td><span class="table-tag ${tagClass}">${tagText}</span></td>
          <td style="font-size: 0.68rem; color: var(--ink-secondary);">${reasonsSnippet}</td>
        </tr>
      `;
    }).join('');
  }

  if (btnRefreshLedger) {
    btnRefreshLedger.addEventListener('click', refreshSocData);
  }

  ledgerFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      ledgerFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      refreshSocData();
    });
  });

  // Emergency Account Lock / Unlock Controls
  if (btnDoLock) {
    btnDoLock.addEventListener('click', async () => {
      const email = inputLockEmail.value.trim();
      if (!email) return;
      try {
        const res = await fetch(`/api/dashboard/user/${encodeURIComponent(email)}/lock`, { method: 'POST' });
        if (res.ok) {
          lockFeedback.textContent = `Account ${email} locked.`;
          lockFeedback.style.color = '#DC2626';
          refreshSocData();
        }
      } catch (err) {
        lockFeedback.textContent = 'Error locking account.';
      }
    });
  }

  if (btnDoUnlock) {
    btnDoUnlock.addEventListener('click', async () => {
      const email = inputLockEmail.value.trim();
      if (!email) return;
      try {
        const res = await fetch(`/api/dashboard/user/${encodeURIComponent(email)}/unlock`, { method: 'POST' });
        if (res.ok) {
          lockFeedback.textContent = `Account ${email} unlocked.`;
          lockFeedback.style.color = '#16A34A';
          refreshSocData();
        }
      } catch (err) {
        lockFeedback.textContent = 'Error unlocking account.';
      }
    });
  }

  // Reset Demo State from SOC
  window.handleSocReset = async function() {
    try {
      await fetch('/api/dashboard/reset-demo', { method: 'POST' });
      refreshSocData();
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial load & Polling (every 2.5s)
  refreshSocData();
  pollInterval = setInterval(refreshSocData, 2500);

  window.addEventListener('beforeunload', () => {
    if (pollInterval) clearInterval(pollInterval);
  });
});
