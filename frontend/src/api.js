import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api" });

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On an expired or invalid token, clear it and go to login.
// (A wrong password on the login page also returns 401, so skip that one.)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLogin = err.config?.url?.includes("/auth/login");
    if (err.response?.status === 401 && !isLogin) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// A random ID saved in this browser, so the backend can recognise the device later
export function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

export function errorMessage(err) {
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (detail) return "Please check your input";
  return "Cannot reach the server";
}

export default api;