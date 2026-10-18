import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");
    try {
      await register(email, password);
      setSuccess("Account created. You can sign in now.");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        <h1 className="text-2xl font-semibold">Create account</h1>
        {error && <p className="rounded bg-red-950 p-2 text-sm text-red-300">{error}</p>}
        {success && (
          <p className="rounded bg-emerald-950 p-2 text-sm text-emerald-300">{success}</p>
        )}
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
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-950 p-2"
        />
        <input
          type="password"
          required
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-950 p-2"
        />
        <button className="w-full rounded bg-emerald-600 p-2 font-medium hover:bg-emerald-500">
          Register
        </button>
        <p className="text-sm text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="text-emerald-400">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}