import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { SIGNAL_LABELS } from "../labels";

// Separate client: the simulator must not touch your real session or redirects
const sim = axios.create({
  baseURL: "http://localhost:8000/api",
  validateStatus: () => true, // we handle every status code ourselves
});

const PASSWORD = "StrongPass123!";
const rand = () => Math.random().toString(36).slice(2, 8);
const octet = () => Math.floor(Math.random() * 256);

async function attempt({ email, device, ip, country = "IN", hour, password = PASSWORD }) {
  const headers = { "X-Demo-Country": country, "X-Demo-IP": ip };
  if (hour !== undefined) headers["X-Demo-Hour"] = String(hour);
  return sim.post("/auth/login", { email, password, device_id: device }, { headers });
}

// A fresh account with a short, normal history from one home device
async function prepareAccount() {
  const email = `sim${rand()}@example.com`;
  const ip = `10.${octet()}.${octet()}.7`;
  const reg = await sim.post("/auth/register", { email, password: PASSWORD });
  if (reg.status !== 201) throw new Error("Could not create the demo account");
  for (let i = 0; i < 5; i++) await attempt({ email, device: "sim-home", ip });
  return { email, ip };
}

function interpret(res) {
  const d = res.data || {};
  if (res.status === 200 && d.step_up_required) {
    return {
      decision: "step_up",
      score: d.risk.score,
      reasons: d.risk.reasons,
      note: `A code is required before sign-in (demo code: ${d.demo_code})`,
    };
  }
  if (res.status === 200) {
    return { decision: d.risk.decision, score: d.risk.score, reasons: d.risk.reasons, note: "Signed in" };
  }
  if (res.status === 429) {
    return { decision: "restrict", score: null, reasons: [], note: d.detail };
  }
  return { decision: "error", score: null, reasons: [], note: d.detail || `HTTP ${res.status}` };
}

const SCENARIOS = [
  {
    id: "familiar",
    title: "1. Familiar login",
    setup: "Known device, usual country, usual hour.",
    expect: "allow",
    why: "Nothing is unusual, so the user sees no extra friction.",
    run: (a) => attempt({ email: a.email, device: "sim-home", ip: a.ip }),
  },
  {
    id: "new-device",
    title: "2. First-time device",
    setup: "Correct password from a device this account has never verified, same country.",
    expect: "step_up",
    why: "A new phone is common and usually innocent, so the response is one extra step, not a rejection.",
    run: (a) => attempt({ email: a.email, device: `sim-${rand()}`, ip: a.ip }),
  },
  {
    id: "travel",
    title: "3. Legitimate travel",
    setup: "Known device, signing in from a different country.",
    expect: "allow",
    why: "The trusted device vouches for the user, and a new country alone is a weak signal. It is scored and recorded, but not interrupted.",
    run: (a) => attempt({ email: a.email, device: "sim-home", ip: a.ip, country: "US" }),
  },
  {
    id: "failures",
    title: "4. Repeated failures",
    setup: "Five wrong passwords in a row, then the correct one.",
    expect: "restrict",
    why: "Guessing is slowed with a temporary cooldown, not a permanent lock, so a real user who mistyped is only inconvenienced for about 15 minutes.",
    run: async (a) => {
      for (let i = 0; i < 5; i++) {
        await attempt({ email: a.email, device: "sim-home", ip: a.ip, password: "WrongPassword!" });
      }
      return attempt({ email: a.email, device: "sim-home", ip: a.ip });
    },
  },
  {
    id: "takeover",
    title: "5. Possible account takeover",
    setup: "Correct password from a new device, in a new country, at an unusual hour.",
    expect: "step_up",
    why: "Several weak signals together make a strong one. The attacker still has the password but is stopped at verification, while the real user is never locked out.",
    run: (a) =>
      attempt({
        email: a.email,
        device: `sim-${rand()}`,
        ip: a.ip,
        country: "RU",
        hour: (new Date().getUTCHours() + 12) % 24,
      }),
  },
];

const BADGE = {
  allow: "bg-emerald-950 text-emerald-300",
  step_up: "bg-amber-950 text-amber-300",
  restrict: "bg-red-950 text-red-300",
  error: "bg-slate-800 text-slate-300",
};
const LABEL = { allow: "Allow", step_up: "Step-up", restrict: "Restricted", error: "Error" };

export default function Simulator() {
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState(false);

  async function runOne(s) {
    setResults((r) => ({ ...r, [s.id]: { running: true } }));
    try {
      const account = await prepareAccount();
      const res = await s.run(account);
      setResults((r) => ({ ...r, [s.id]: { account, ...interpret(res) } }));
    } catch {
      setResults((r) => ({
        ...r,
        [s.id]: {
          decision: "error",
          reasons: [],
          note: "Could not reach the backend, or the demo account could not be created",
        },
      }));
    }
  }

  async function runSingle(s) {
    setBusy(true);
    await runOne(s);
    setBusy(false);
  }

  async function runAll() {
    setBusy(true);
    for (const s of SCENARIOS) await runOne(s);
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Scenario Simulator</h1>
          <p className="mt-1 text-sm text-slate-400">
            Plays the five login situations against your local backend, each on its own
            fresh demo account. Demo mode only: location, hour and network are simulated
            with request headers.
          </p>
        </div>
        <Link to="/login" className="shrink-0 text-sm text-emerald-400">
          Back to sign in
        </Link>
      </header>

      <button
        onClick={runAll}
        disabled={busy}
        className="mb-6 rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500 disabled:opacity-50"
      >
        {busy ? "Running..." : "Run all five scenarios"}
      </button>

      <div className="space-y-4">
        {SCENARIOS.map((s) => {
          const r = results[s.id];
          return (
            <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">{s.title}</h2>
                  <p className="text-sm text-slate-400">{s.setup}</p>
                </div>
                <button
                  onClick={() => runSingle(s)}
                  disabled={busy}
                  className="shrink-0 rounded border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  Run
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Expected: <span className="text-slate-300">{LABEL[s.expect]}</span>. {s.why}
              </p>

              {r?.running && <p className="mt-3 text-sm text-slate-400">Running...</p>}

              {r && !r.running && (
                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${BADGE[r.decision]}`}>
                      {LABEL[r.decision]}
                    </span>
                    {r.score !== null && r.score !== undefined && (
                      <span className="text-slate-400">Risk score: {r.score}/100</span>
                    )}
                    <span className={r.decision === s.expect ? "text-emerald-400" : "text-red-400"}>
                      {r.decision === s.expect ? "Matches expected" : "Differs from expected"}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-300">{r.note}</p>
                  {r.reasons?.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-slate-400">
                      {r.reasons.map((x, i) => (
                        <li key={i}>
                          +{x.points} {SIGNAL_LABELS[x.signal] || x.signal}: {x.detail}
                        </li>
                      ))}
                    </ul>
                  )}
                  {r.account && (
                    <p className="mt-2 text-xs text-slate-500">
                      Demo account: {r.account.email} (password {PASSWORD})
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}