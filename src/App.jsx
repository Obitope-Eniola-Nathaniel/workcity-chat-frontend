import React, { useContext, createContext } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inbox from "./pages/Inbox";
import ChatView from "./pages/ChatView";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthContext } from "./contexts/AuthContext";
import { useAbly } from "./hooks/useAbly";

// ✅ Global Ably context
export const AblyContext = createContext(null);

// 🔒 Private route wrapper
function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}

export default function App() {
  const ably = useAbly();

  return (
    <AblyContext.Provider value={ably}>
      <Routes>
        <Route element={<Layout />}>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/inbox" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/chat/:id" element={<ChatView />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin-only */}
          <Route element={<PrivateRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AblyContext.Provider>
  );
}
