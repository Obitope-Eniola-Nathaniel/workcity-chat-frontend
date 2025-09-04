import React, { useContext, useEffect, useState } from "react";
import api from "../api/apiClient";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Fetch profile
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/me"); // ✅ consistent endpoint
        setProfile(res.data);
        setName(res.data.name || "");
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Save updated profile
  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await api.patch(`/users/${profile._id}`, { name });
      setProfile(res.data); // ✅ directly update from response
      setEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  if (!profile) return <div className="p-4 text-red-600">No profile found</div>;

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold">Profile</h2>

      {error && <div className="mt-2 text-red-600">{error}</div>}
      {success && <div className="mt-2 text-green-600">{success}</div>}

      {/* Email (non-editable) */}
      <div className="mt-4">
        <label className="block text-sm">Email</label>
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
          {profile.email}
        </div>
      </div>

      {/* Name (editable) */}
      <div className="mt-4">
        <label className="block text-sm">Name</label>
        {editing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
              disabled={saving}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
              {profile.name || "Not set"}
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

      {/* Role */}
      <div className="mt-6 text-sm text-gray-500">
        Role: {profile.role || "user"}
      </div>
    </div>
  );
}
