import React, { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import api from "../api/apiClient";
import { createAblyClient } from "../ably/ablyClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // 👈 NEW

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwt_decode(token);

      // 👇 Check if token expired
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired");
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } else {
        setUser({ id: decoded._id, role: decoded.role, ...decoded });
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }

    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signup = async (payload) => {
    try {
      const res = await api.post("/auth/signup", payload);
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      return res.data;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");

    try {
      const client = createAblyClient(token);
      if (client) {
        client.close();
        console.log("👋 Ably disconnected on logout");
      }
    } catch (err) {
      console.warn("No active Ably client to close:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, loading }}
    >
      {!loading && children} {/* 👈 Don’t render until auth is checked */}
    </AuthContext.Provider>
  );
}
