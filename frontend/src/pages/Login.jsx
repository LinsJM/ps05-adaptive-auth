import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api";
import { SIGNAL_LABELS } from "../labels";

export default function Login() {
  const { login, verifyStepUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Set when the server asks for extra verification
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [trust, setTrust] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await login(email, password);
      if (result.stepUp) {
        setChallenge(result);
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyStepUp(challenge.challengeId, code, trust);
      navigate("/home");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    setChallenge(null);
    setCode("");
    setTrust(false);
    setPassword("");
    setError("");
  }

  const card =
    "w-full max-w-sm space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6";
  const input = "w-full rounded border border-slate-700 bg-slate-950 p-2";

  if (challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <form onSubmit={handleVerify} className={card}>
          <h1 className="text-2xl font-semibold">Verify it's you</h1>
          <p className="text-sm text-slate-400">
            Your password was correct, but this sign-in looks different from your usual
            ones, so we need one more step.
          </p>

          {challenge.risk.reasons.length > 0 && (
            <ul className="space-y-1 rounded bg-slate-950 p-3 text-xs text-slate-400">
              {challenge.risk.reasons.map((r, i) => (
                <li key={i}>• {SIGNAL_LABELS[r.signal] || r.signal}</li>
              ))}
            </ul>
          )}

          {challenge.demoCode && (
            <p className="rounded border border-amber-800 bg-amber-950/40 p-2 text-xs text-amber-300">
              Demo mode: no email is sent, so your code is{" "}
              <span className="font-mono text-sm font-semibold">{challenge.demoCode}</span>
            </p>
          )}

          {error && <p className="rounded bg-red-950 p-2 text-sm text-red-300">{error}</p>}

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${input} text-center font-mono tracking-widest`}
          />

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={trust}
              onChange={(e) => setTrust(e.target.checked)}
            />
            Trust this device (skip this step here next time)
          </label>

          <button
            disabled={busy || code.length !== 6}
            className="w-full rounded bg-emerald-600 p-2 font-medium hover:bg-emerald-500 disabled:opacity-50"
          >
            {busy ? "Verifying..." : "Verify and sign in"}
          </button>
          <button
            type="button"
            onClick={startOver}
            className="w-full text-sm text-slate-400 hover:text-slate-200"
          >
            Start over
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleLogin} className={card}>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {error && <p className="rounded bg-red-950 p-2 text-sm text-red-300">{error}</p>}
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
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