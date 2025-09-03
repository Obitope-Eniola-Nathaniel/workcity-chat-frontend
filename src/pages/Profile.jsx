import React, { useContext, useEffect, useState } from "react";
import api from "../api/apiClient";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data);
        setName(res.data.name || "");
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const save = async () => {
    try {
      await api.patch(`/api/users/${profile._id}`, { name });
      setEditing(false);
      const res = await api.get("/api/auth/me");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mt-4">
        <label className="block text-sm">Email</label>
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
          {profile.email}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm">Name</label>
        {editing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={save}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
              {profile.name}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          </>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">Role: {profile.role}</div>
    </div>
  );
}
