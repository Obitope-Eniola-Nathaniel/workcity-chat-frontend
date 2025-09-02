import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inbox from "./pages/Inbox";
import ChatView from "./pages/ChatView";
import { AuthContext } from "./contexts/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Inbox />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <ChatView />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
