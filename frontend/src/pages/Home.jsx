import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Home() {
  const { user, logout } = useAuth();
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
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {user?.email}</h1>
        <button
          onClick={handleLogout}
          className="rounded border border-slate-700 px-3 py-1 hover:bg-slate-800"
        >
          Logout
        </button>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-lg font-medium">Login Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-2">Time</th>
                <th className="p-2">Result</th>
                <th className="p-2">Reason</th>
                <th className="p-2">Network</th>
                <th className="p-2">Device</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-slate-800">
                  <td className="p-2">{new Date(e.created_at + "Z").toLocaleString()}</td>
                  <td className={`p-2 ${e.success ? "text-emerald-400" : "text-red-400"}`}>
                    {e.success ? "Success" : "Failed"}
                  </td>
                  <td className="p-2">{e.failure_reason || "-"}</td>
                  <td className="p-2">{e.ip_prefix}</td>
                  <td className="p-2">{e.device_id ? e.device_id.slice(0, 8) : "-"}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={5}>
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