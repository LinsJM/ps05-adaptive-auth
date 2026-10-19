import { createContext, useContext, useEffect, useState } from "react";
import api, { getDeviceId } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [lastRisk, setLastRisk] = useState(null);
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

  function finishLogin(data) {
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    setLastRisk(data.risk);
  }

  async function register(email, password) {
    await api.post("/auth/register", { email, password });
  }

  // Returns { stepUp: false } when logged in, or the challenge details when
  // extra verification is required.
  async function login(email, password) {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      device_id: getDeviceId(),
    });
    if (data.step_up_required) {
      return {
        stepUp: true,
        challengeId: data.challenge_id,
        demoCode: data.demo_code,
        risk: data.risk,
      };
    }
    finishLogin(data);
    return { stepUp: false };
  }

  async function verifyStepUp(challengeId, code, trustDevice) {
    const { data } = await api.post("/auth/verify-step-up", {
      challenge_id: challengeId,
      code,
      trust_device: trustDevice,
    });
    finishLogin(data);
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
    setLastRisk(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, lastRisk, loading, register, login, verifyStepUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);