import React, { useContext, useEffect, useState } from "react";
import api from "../api/apiClient";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useAbly } from "../hooks/useAbly";

export default function Inbox() {
  const { user } = useContext(AuthContext);
  const ably = useAbly();
  const navigate = useNavigate();

  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Load conversations
  useEffect(() => {
    if (!user) return;
    const loadConvos = async () => {
      setLoading(true);
      try {
        const res = await api.get("/conversations");
        setConvos(res.data || []);
      } catch (err) {
        console.error("Error loading conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadConvos();
  }, [user]);

  // Realtime updates from Ably
  useEffect(() => {
    if (!ably || !user) return;

    const channel = ably.channels.get(`conversations:${user.id}`);
    const handler = (msg) => {
      const updatedConvo = msg.data;
      setConvos((prev) => {
        const filtered = prev.filter((c) => c._id !== updatedConvo._id);
        return [updatedConvo, ...filtered];
      });
    };

    channel.subscribe("update", handler);

    return () => {
      channel.unsubscribe("update", handler);
      channel.detach();
    };
  }, [ably, user]);

  // Load users by role when role changes
  useEffect(() => {
    const fetchUsersByRole = async () => {
      if (!selectedRole || !user) return;
      try {
        const res = await api.get(`/users/${selectedRole}s`);
        const list = res.data || [];
        // exclude logged-in user
        setParticipants(list.filter((u) => u._id !== user.id));
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };
    fetchUsersByRole();
  }, [selectedRole, user]);

  // Handle conversation creation
  const handleCreateConversation = async () => {
    if (!selectedRole || !selectedUser || !user) return;
    try {
      const res = await api.post("/conversations", {
        participants: [user.id, selectedUser],
        type: `buyer-${selectedRole}`,
      });

      setConvos([res.data, ...convos]);
      setShowModal(false);
      setSelectedRole("");
      setSelectedUser("");
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please log in to see your conversations.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Conversations</h3>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {loading && <div>Loading...</div>}
          {!loading && convos.length === 0 && (
            <div className="text-gray-500 text-sm">No conversations yet</div>
          )}
          {convos.map((c) => {
            const other =
              c?.participants?.find((p) => p && p._id !== user.id) || null;

            return (
              <Link
                key={c?._id || Math.random()}
                to={`/chat/${c?._id}`}
                className="block p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">
                      {other?.username || "Conversation"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                      {c?.lastMessage || "No messages yet"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {c?.updatedAt
                      ? new Date(c.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main panel */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Welcome</h3>
        <p className="text-sm text-gray-500 mt-2">
          Select a conversation to start chatting, or click{" "}
          <span className="font-medium">+ New</span> to begin one.
        </p>
      </div>

      {/* Start Chat Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h4 className="text-lg font-semibold mb-4">Start a Conversation</h4>

            {/* Step 1: Choose role */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setSelectedUser("");
              }}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="">Choose who to chat with</option>
              <option value="agent">Agent</option>
              <option value="designer">Designer</option>
              <option value="merchant">Merchant</option>
            </select>

            {/* Step 2: Choose user */}
            {selectedRole && (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full border rounded p-2 mb-4"
              >
                <option value="">Select a {selectedRole}</option>
                {participants.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.username} ({p.email})
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateConversation}
                disabled={!selectedRole || !selectedUser}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
