import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [u, c] = await Promise.all([
          api.get("/users"),
          api.get("/conversations"),
        ]);

        setUsers(u.data || []);
        setConvos(c.data || []);
      } catch (err) {
        console.error("Admin data fetch failed:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {loading && (
        <div className="text-center py-6 text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="text-center py-4 text-red-500 font-medium">{error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Users Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Users</h3>
            {users.length === 0 ? (
              <p className="mt-3 text-gray-500">No users found.</p>
            ) : (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="p-3 border rounded bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                    <div className="text-sm">Role: {u.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversations Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Recent Conversations</h3>
            {convos.length === 0 ? (
              <p className="mt-3 text-gray-500">No conversations found.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {convos.map((c) => (
                  <div
                    key={c._id}
                    className="p-3 border rounded bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="font-medium">
                      Participants:{" "}
                      {c.participants.map((p) => p.name).join(", ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last: {c.lastMessage || "—"}
                    </div>
                    {c.updatedAt && (
                      <div className="text-xs text-gray-400">
                        Updated: {new Date(c.updatedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
