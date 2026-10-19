import { useEffect, useState } from "react";
import api from "../api";
import { SIGNAL_LABELS } from "../labels";

function Stat({ label, value, tone = "text-slate-100", note }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-2xl font-semibold ${tone}`}>{value}</div>
      {note && <div className="text-xs text-slate-500">{note}</div>}
    </div>
  );
}

export default function SecuritySummary() {
  const [s, setS] = useState(null);

  useEffect(() => {
    api
      .get("/events/summary")
      .then((res) => setS(res.data))
      .catch(() => {});
  }, []);

  if (!s) return null;
  const max = Math.max(1, ...s.top_signals.map((x) => x.count));

  return (
    <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-medium">Security Summary</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Login attempts" value={s.total} />
        <Stat label="Allowed" value={s.by_decision.allow} tone="text-emerald-400" />
        <Stat
          label="Step-up challenges"
          value={s.by_decision.step_up}
          tone="text-amber-400"
          note={`${s.verified} verified`}
        />
        <Stat label="Restricted" value={s.by_decision.restrict} tone="text-red-400" />
        <Stat label="Wrong passwords" value={s.wrong_password} />
      </div>

      <h3 className="mb-2 mt-4 text-sm font-medium text-slate-300">
        Most common risk signals
      </h3>
      {s.top_signals.length === 0 ? (
        <p className="text-sm text-slate-500">No risk signals have fired yet.</p>
      ) : (
        <ul className="space-y-2">
          {s.top_signals.map((t) => (
            <li key={t.signal} className="text-sm">
              <div className="flex justify-between text-slate-300">
                <span>{SIGNAL_LABELS[t.signal] || t.signal}</span>
                <span className="text-slate-400">{t.count}</span>
              </div>
              <div className="mt-1 h-1.5 rounded bg-slate-800">
                <div
                  className="h-1.5 rounded bg-amber-500"
                  style={{ width: `${(t.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}