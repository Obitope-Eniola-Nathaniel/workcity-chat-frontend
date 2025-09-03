import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inbox from "./pages/Inbox";
import ChatView from "./pages/ChatView";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthContext } from "./contexts/AuthContext";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={user ? <Navigate to="/inbox" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/inbox"
          element={user ? <Inbox /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:id"
          element={user ? <ChatView /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Route>
    </Routes>
  );
}
