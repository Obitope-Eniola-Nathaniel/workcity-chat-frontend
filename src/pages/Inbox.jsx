import React, { useContext, useEffect, useState } from "react";
import api from "../api/apiClient";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Inbox() {
  const { user } = useContext(AuthContext);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/conversations");
        setConvos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Conversations</h3>
        <div className="mt-4 space-y-2">
          {loading ? <div>Loading...</div> : null}
          {convos.map((c) => {
            const other = c.participants.filter((p) => p._id !== user.id)[0];
            return (
              <Link
                key={c._id}
                to={`/chat/${c._id}`}
                className="block p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">
                      {other?.name || "Conversation"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {c.lastMessage || "No messages yet"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(c.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Welcome</h3>
        <p className="text-sm text-gray-500 mt-2">
          Select a conversation to start chatting. You can also create one via
          the API for now.
        </p>
      </div>
    </div>
  );
}
