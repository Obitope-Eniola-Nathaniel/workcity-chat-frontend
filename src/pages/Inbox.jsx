import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Inbox() {
  const { user, logout } = useContext(AuthContext);
  const [convs, setConvs] = useState([]);

  useEffect(() => {
    let mounted = true;
    api
      .get("/conversations")
      .then((res) => {
        if (mounted) setConvs(res.data);
      })
      .catch(console.error);
    return () => (mounted = false);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Inbox</h2>
        <div>
          <span className="mr-4">
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout} className="px-3 py-1 border rounded">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {convs.map((c) => (
          <Link
            to={`/chat/${c._id}`}
            key={c._id}
            className="block p-4 bg-white rounded shadow"
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{c.type}</div>
                <div className="text-sm text-gray-600">
                  {c.lastMessage || "No messages yet"}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(c.updatedAt).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
