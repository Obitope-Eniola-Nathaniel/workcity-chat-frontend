import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AblyProvider } from "./contexts/AblyContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AblyProvider>
          <App />
        </AblyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
