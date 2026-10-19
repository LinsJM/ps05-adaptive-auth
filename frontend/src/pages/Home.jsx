import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { SIGNAL_LABELS } from "../labels";
import TrustedDevices from "../components/TrustedDevices";


const DECISION_STYLES = {
  allow: "bg-emerald-950 text-emerald-300",
  step_up: "bg-amber-950 text-amber-300",
  restrict: "bg-red-950 text-red-300",
};

const DECISION_LABELS = {
  allow: "Allow",
  step_up: "Step-up",
  restrict: "Restricted",
};

function Badge({ decision }) {
  if (!decision) return <span className="text-slate-500">-</span>;
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${DECISION_STYLES[decision]}`}>
      {DECISION_LABELS[decision] || decision}
    </span>
  );
}

function parseReasons(json) {
  try {
    return JSON.parse(json || "[]");
  } catch {
    return [];
  }
}

function RiskBanner({ risk }) {
  if (!risk) return null;
  const styles = {
    allow: "border-emerald-800 bg-emerald-950/40",
    step_up: "border-amber-800 bg-amber-950/40",
    restrict: "border-red-800 bg-red-950/40",
  };
  const titles = {
    allow: "This login looked normal",
    step_up: risk.enforced
      ? "This login looked unusual, and you verified it with a code"
      : "This login looked unusual",
    restrict: "Too many failed attempts",
  };
  return (
    <div className={`mb-6 rounded-xl border p-4 ${styles[risk.decision]}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{titles[risk.decision]}</h2>
        <span className="text-sm text-slate-400">Risk score: {risk.score}/100</span>
      </div>
      {risk.reasons.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          {risk.reasons.map((r, i) => (
            <li key={i}>
              <span className="text-slate-400">+{r.points}</span>{" "}
              {SIGNAL_LABELS[r.signal] || r.signal}: {r.detail}
            </li>
          ))}
        </ul>
      )}
      {risk.decision === "step_up" && !risk.enforced && (
        <p className="mt-2 text-xs text-slate-400">
          Shadow mode: extra verification is scored but not yet required. It will be
          enforced once the OTP step is added.
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const { user, lastRisk, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api
      .get("/events/recent")
      .then((res) => setEvents(res.data))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {user?.email}</h1>
        <button
          onClick={handleLogout}
          className="rounded border border-slate-700 px-3 py-1 hover:bg-slate-800"
        >
          Logout
        </button>
      </header>

      <RiskBanner risk={lastRisk} />

      <TrustedDevices />


      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-lg font-medium">Login Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-2">Time</th>
                <th className="p-2">Result</th>
                <th className="p-2">Score</th>
                <th className="p-2">Decision</th>
                <th className="p-2">Why</th>
                <th className="p-2">Country</th>
                <th className="p-2">Device</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const reasons = parseReasons(e.reasons_json);
                return (
                  <tr key={e.id} className="border-t border-slate-800 align-top">
                    <td className="p-2">{new Date(e.created_at + "Z").toLocaleString()}</td>
                                        <td
                      className={`p-2 ${
                        e.success
                          ? "text-emerald-400"
                          : e.failure_reason === "step_up_required"
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {e.success
                        ? "Success"
                        : e.failure_reason === "step_up_required"
                        ? "Challenged"
                        : "Failed"}
                      {e.failure_reason && e.failure_reason !== "step_up_required" && (
                        <div className="text-xs text-slate-500">{e.failure_reason}</div>
                      )}
                    </td>
                    <td className="p-2">{e.risk_score ?? "-"}</td>
                    <td className="p-2">
                      <Badge decision={e.decision} />
                    </td>
                    <td className="p-2 text-xs text-slate-400">
                      {reasons.length === 0
                        ? "-"
                        : reasons.map((r) => SIGNAL_LABELS[r.signal] || r.signal).join(", ")}
                    </td>
                    <td className="p-2">{e.country || "-"}</td>
                    <td className="p-2">
                      {e.device_id ? e.device_id.slice(0, 8) : "-"}
                      {e.ua_summary && (
                        <div className="text-xs text-slate-500">{e.ua_summary}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={7}>
                    No events yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}