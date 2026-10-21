/**
 * DIGNITAS: Security Operations Center (SOC) Controller
 * Real-time event stream sync, multi-app metrics, emergency locks, and live demo triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentFilter = 'all';
  let pollInterval = null;
  const API_BASE = (window.location.protocol === 'file:') ? 'http://127.0.0.1:8000' : '';

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
      await fetch(`${API_BASE}/api/login`, {
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
      const statsRes = await fetch(`${API_BASE}/api/dashboard/stats`);
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
        ? `${API_BASE}/api/dashboard/events?limit=40` 
        : `${API_BASE}/api/dashboard/events?app_id=${currentFilter}&limit=40`;
      
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
      if (ev.action === 'block' || ev.decision === 'restrict' || score >= 80) {
        tagClass = 'tag-block';
        tagText = 'BLOCK';
      } else if (ev.action === 'quarantine_verify' || ev.action === 'otp_password_reset' || score >= 60) {
        tagClass = 'tag-reset';
        tagText = 'QUARANTINE';
      } else if (ev.action === 'email_otp' || score >= 45) {
        tagClass = 'tag-otp';
        tagText = 'EMAIL OTP';
      } else if (ev.action === 'captcha' || score >= 30) {
        tagClass = 'tag-captcha';
        tagText = 'CAPTCHA';
      } else {
        tagClass = 'tag-allow';
        tagText = 'ALLOW';
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
        const res = await fetch(`${API_BASE}/api/dashboard/user/${encodeURIComponent(email)}/lock`, { method: 'POST' });
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
        const res = await fetch(`${API_BASE}/api/dashboard/user/${encodeURIComponent(email)}/unlock`, { method: 'POST' });
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
      await fetch(`${API_BASE}/api/dashboard/reset-demo`, { method: 'POST' });
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

  // -------------------------------------------------------------
  // Real Database Explorer (ACID SQL Schema & Table Inspector)
  // -------------------------------------------------------------
  const tabBtnStream = document.getElementById('tab-btn-stream');
  const tabBtnDb = document.getElementById('tab-btn-db');
  const socViewStream = document.getElementById('soc-view-stream');
  const socViewDatabase = document.getElementById('soc-view-database');

  const dbEngineName = document.getElementById('db-engine-name');
  const dbLocationMeta = document.getElementById('db-location-meta');
  const dbFileSize = document.getElementById('db-file-size');
  const dbCountUsers = document.getElementById('db-count-users');
  const dbCountLogins = document.getElementById('db-count-logins');
  const dbCountDevices = document.getElementById('db-count-devices');
  const dbCountFlagged = document.getElementById('db-count-flagged');

  const dbTableTabs = document.querySelectorAll('.db-table-tab');
  const dbSearchFilter = document.getElementById('db-search-filter');
  const btnRefreshDb = document.getElementById('btn-refresh-db');
  const dbTableThead = document.getElementById('db-table-thead');
  const dbTableTbody = document.getElementById('db-table-tbody');

  let currentDbTable = 'users';
  let cachedTableData = null;

  function setSocView(viewName) {
    if (viewName === 'database') {
      tabBtnStream?.classList.remove('active');
      tabBtnDb?.classList.add('active');
      socViewStream?.classList.add('hidden');
      socViewDatabase?.classList.remove('hidden');
      refreshDatabaseExplorer();
    } else {
      tabBtnDb?.classList.remove('active');
      tabBtnStream?.classList.add('active');
      socViewDatabase?.classList.add('hidden');
      socViewStream?.classList.remove('hidden');
      refreshSocData();
    }
  }

  if (tabBtnStream) tabBtnStream.addEventListener('click', () => setSocView('stream'));
  if (tabBtnDb) tabBtnDb.addEventListener('click', () => setSocView('database'));

  async function refreshDatabaseExplorer() {
    try {
      // 1. Fetch Status & Table Counts
      const statusRes = await fetch(`${API_BASE}/api/database/status`);
      if (statusRes.ok) {
        const status = await statusRes.json();
        if (dbEngineName) dbEngineName.textContent = status.engine || 'SQLite 3.42 (Local ACID Engine)';
        if (dbLocationMeta) dbLocationMeta.textContent = status.database_location || 'adaptive_auth.db';
        if (dbFileSize) dbFileSize.textContent = status.file_size_formatted || '68.0 KB';

        if (status.tables) {
          if (dbCountUsers) dbCountUsers.textContent = status.tables.users ?? 0;
          if (dbCountLogins) dbCountLogins.textContent = status.tables.login_events ?? 0;
          if (dbCountDevices) dbCountDevices.textContent = status.tables.known_devices ?? 0;
          if (dbCountFlagged) dbCountFlagged.textContent = status.tables.flagged_ips ?? 0;
        }
      }

      // 2. Fetch Selected Table Rows
      await loadTableRows(currentDbTable);
    } catch (err) {
      console.error('Error refreshing database explorer:', err);
    }
  }

  async function loadTableRows(tableName) {
    if (!dbTableTbody) return;
    try {
      const res = await fetch(`${API_BASE}/api/database/table/${encodeURIComponent(tableName)}?limit=100`);
      if (res.ok) {
        cachedTableData = await res.json();
        renderTableRows(cachedTableData, dbSearchFilter?.value || '');
      } else {
        dbTableTbody.innerHTML = `<tr><td colspan="8" class="table-empty text-danger">Failed to load table ${escapeHtml(tableName)}</td></tr>`;
      }
    } catch (err) {
      console.error('Error loading table rows:', err);
    }
  }

  function renderTableRows(tableData, filterKeyword) {
    if (!tableData || !dbTableThead || !dbTableTbody) return;

    const cols = tableData.columns || [];
    const rows = tableData.rows || [];
    const keyword = (filterKeyword || '').trim().toLowerCase();

    // Render Columns
    dbTableThead.innerHTML = `<tr>${cols.map(c => `<th>${escapeHtml(c.replace(/_/g, ' '))}</th>`).join('')}</tr>`;

    // Filter Rows
    const filtered = rows.filter(r => {
      if (!keyword) return true;
      return Object.values(r).some(val => String(val || '').toLowerCase().includes(keyword));
    });

    if (filtered.length === 0) {
      dbTableTbody.innerHTML = `<tr><td colspan="${cols.length}" class="table-empty">No matching records found in table '${escapeHtml(tableData.table)}'.</td></tr>`;
      return;
    }

    dbTableTbody.innerHTML = filtered.map(row => {
      const isJudge = String(row.email || row.email_attempted || row.device_id || '').toLowerCase().includes('judge');
      const rowClass = isJudge ? 'highlight-judge' : '';

      const cells = cols.map(c => {
        let val = row[c];
        if (val === null || val === undefined) return '<span style="color:var(--ink-faint);">NULL</span>';

        if (c === 'created_at' || c === 'flagged_at' || c === 'first_seen_at' || c === 'last_seen_at') {
          return `<span style="font-size:0.65rem;">${new Date(val).toLocaleString()}</span>`;
        }

        if (c === 'password_hash') {
          return `<span style="color:#0284C7; font-weight:700; font-size:0.65rem;">${escapeHtml(val)}</span>`;
        }

        if (c === 'is_locked') {
          return val ? '<span class="badge-db-locked">LOCKED</span>' : '<span class="badge-db-active">ACTIVE</span>';
        }

        if (c === 'trusted') {
          return val ? '<span class="badge-db-active">TRUE</span>' : '<span class="badge-db-locked">FALSE</span>';
        }

        if (c === 'success') {
          return val ? '<span class="badge-db-active">SUCCESS</span>' : '<span class="badge-db-locked">FAILED</span>';
        }

        return escapeHtml(String(val));
      }).join('</td><td>');

      return `<tr class="${rowClass}"><td>${cells}</td></tr>`;
    }).join('');
  }

  // Hook Table Tabs
  dbTableTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dbTableTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentDbTable = tab.dataset.table || 'users';
      loadTableRows(currentDbTable);
    });
  });

  // Search Filter in DB Explorer
  if (dbSearchFilter) {
    dbSearchFilter.addEventListener('input', () => {
      if (cachedTableData) {
        renderTableRows(cachedTableData, dbSearchFilter.value);
      }
    });
  }

  if (btnRefreshDb) {
    btnRefreshDb.addEventListener('click', refreshDatabaseExplorer);
  }

  // Initial load & Polling (every 2.5s)
  refreshSocData();
  pollInterval = setInterval(() => {
    if (socViewStream && !socViewStream.classList.contains('hidden')) {
      refreshSocData();
    } else if (socViewDatabase && !socViewDatabase.classList.contains('hidden')) {
      refreshDatabaseExplorer();
    }
  }, 2500);

  window.addEventListener('beforeunload', () => {
    if (pollInterval) clearInterval(pollInterval);
  });
});
