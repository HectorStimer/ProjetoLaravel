import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    try {
      const res = await api.post("/login", { email, password });
      const token = res.data.token || res.data.access_token || null;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      setUser(res.data.user || res.data);
      return res;
    } catch (err) {
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      api
        .get("/me")
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
