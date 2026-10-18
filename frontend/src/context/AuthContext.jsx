import { createContext, useContext, useEffect, useState } from "react";
import api, { getDeviceId } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  // On page load (or token change), fetch the user's profile
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function register(email, password) {
    await api.post("/auth/register", { email, password });
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      device_id: getDeviceId(),
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // token may already be invalid; still log out locally
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);