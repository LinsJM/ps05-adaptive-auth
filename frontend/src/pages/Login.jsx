import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center p-4">
      {/* Quick Access Showcase Banner */}
      <div className="mb-6 w-full max-w-sm rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">DIGNITAS PS05 Portals</div>
        <div className="text-xs text-slate-300 mb-3">Explore the 5-tier architecture showcase and live interactive gateway:</div>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="/landing"
            className="rounded-lg bg-emerald-600/90 hover:bg-emerald-500 py-2 px-3 text-xs font-bold text-white shadow transition flex items-center justify-center gap-1"
          >
            🌐 Overview Site →
          </a>
          <a
            href="/dashboard"
            className="rounded-lg bg-indigo-600/90 hover:bg-indigo-500 py-2 px-3 text-xs font-bold text-white shadow transition flex items-center justify-center gap-1"
          >
            🛡️ Solution Site →
          </a>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {error && <p className="rounded bg-red-950 p-2 text-sm text-red-300">{error}</p>}
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-950 p-2"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-950 p-2"
        />
        <button
          disabled={busy}
          className="w-full rounded bg-emerald-600 p-2 font-medium hover:bg-emerald-500 disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-sm text-slate-400">
          No account?{" "}
          <Link to="/register" className="text-emerald-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}