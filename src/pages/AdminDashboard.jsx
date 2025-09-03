import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [convos, setConvos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const u = await api.get("/users");
        setUsers(u.data || []);
      } catch (err) {
        console.error(err);
      }
      try {
        const c = await api.get("/conversations");
        setConvos(c.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Users</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {users.map((u) => (
            <div key={u._id} className="p-3 border rounded">
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
              <div className="text-sm">Role: {u.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Recent Conversations</h3>
        <div className="mt-3 space-y-2">
          {convos.map((c) => (
            <div key={c._id} className="p-2 border rounded">
              <div className="font-medium">
                Participants: {c.participants.map((p) => p.name).join(", ")}
              </div>
              <div className="text-sm text-gray-500">
                Last: {c.lastMessage || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
