import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // users | conversations | messages
  const [darkMode, setDarkMode] = useState(false);

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "agent",
  });

  useEffect(() => {
    fetchUsers();
    fetchConversations();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data } = await api.get("/admin/conversations");
      setConversations(data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  const fetchMessages = async (convoId) => {
    try {
      const { data } = await api.get(
        `/admin/conversations/${convoId}/messages`
      );
      setMessages(data);
      setSelectedConvo(convoId);
      setActiveTab("messages");
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", newUser);
      setNewUser({ username: "", email: "", password: "", role: "agent" });
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await api.delete(`/admin/messages/${id}`);
      fetchMessages(selectedConvo);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 ${
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("conversations")}
            className={`px-4 py-2 ${
              activeTab === "conversations"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            disabled={!selectedConvo}
            className={`px-4 py-2 ${
              activeTab === "messages"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : selectedConvo
                ? "text-gray-600 dark:text-gray-400"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Messages
          </button>
        </div>

        {/* ---------------- Users Tab ---------------- */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>

            {/* Create User */}
            <form
              onSubmit={handleCreateUser}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6"
            >
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="border dark:border-gray-600 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="border dark:border-gray-600 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="border dark:border-gray-600 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="border dark:border-gray-600 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <option value="agent">Agent</option>
                <option value="designer">Designer</option>
                <option value="merchant">Merchant</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add User
              </button>
            </form>

            {/* User List */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex justify-between items-center border dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                >
                  <div>
                    <p className="font-medium">{u.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {u.role}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Conversations Tab ---------------- */}
        {activeTab === "conversations" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6">Conversations</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {conversations.map((c) => (
                <div
                  key={c._id}
                  onClick={() => fetchMessages(c._id)}
                  className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer hover:shadow-sm transition"
                >
                  <p className="font-medium">Conversation ID: {c._id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {c.participants
                      .map((p) => `${p.username} (${p.role})`)
                      .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Messages Tab ---------------- */}
        {activeTab === "messages" && selectedConvo && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6">Messages</h2>
            <ul className="space-y-3">
              {messages.map((m) => (
                <li
                  key={m._id}
                  className="flex justify-between items-center p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <span>
                    <strong>{m.sender.username}:</strong> {m.content}
                  </span>
                  <button
                    onClick={() => handleDeleteMessage(m._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
