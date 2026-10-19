import { useEffect, useState } from "react";
import api, { getDeviceId } from "../api";

export default function TrustedDevices() {
  const [devices, setDevices] = useState([]);
  const myDevice = getDeviceId();

  function load() {
    api
      .get("/devices")
      .then((res) => setDevices(res.data))
      .catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

  async function revoke(id) {
    await api.post(`/devices/${id}/revoke`);
    load();
  }

  return (
    <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-1 text-lg font-medium">Trusted Devices</h2>
      <p className="mb-3 text-xs text-slate-400">
        Trusted devices skip the extra verification step. Removing trust means that
        device has to verify with a code next time.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="p-2">Device</th>
              <th className="p-2">Status</th>
              <th className="p-2">First seen</th>
              <th className="p-2">Last seen</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id} className="border-t border-slate-800">
                <td className="p-2">
                  {d.ua_summary || "Unknown"}
                  <div className="text-xs text-slate-500">
                    {d.device_id.slice(0, 8)}
                    {d.device_id === myDevice && (
                      <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                        This device
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      d.trusted
                        ? "bg-emerald-950 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {d.trusted ? "Trusted" : "Not trusted"}
                  </span>
                </td>
                <td className="p-2">
                  {new Date(d.first_seen_at + "Z").toLocaleDateString()}
                </td>
                <td className="p-2">
                  {new Date(d.last_seen_at + "Z").toLocaleString()}
                </td>
                <td className="p-2 text-right">
                  {d.trusted && (
                    <button
                      onClick={() => revoke(d.id)}
                      className="rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
                    >
                      Remove trust
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td className="p-2 text-slate-500" colSpan={5}>
                  No devices yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}