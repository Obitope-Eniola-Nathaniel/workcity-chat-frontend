import React, { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; // safe decode
import api from "../api/apiClient";
import { createAblyClient } from "../ably/ablyClient"; // ✅ import ably client

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwt_decode(token);
      setUser({ id: decoded._id, role: decoded.role, ...decoded }); // ✅ fix: use _id from JWT
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
    }

    localStorage.setItem("token", token || "");
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

    // ✅ Cleanly close Ably connection on logout
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
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
