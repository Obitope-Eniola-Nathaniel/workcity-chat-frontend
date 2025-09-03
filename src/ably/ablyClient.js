// utils/ablyClient.js
import Ably from "ably";

// Use Vite-compatible env variable
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let ablyInstance = null;

/**
 * Create or reuse an Ably Realtime client.
 * Requires a valid JWT token (from your backend auth).
 *
 * @param {string} token - JWT token of the logged-in user
 * @returns {Ably.Realtime} - Ably client
 */
export function createAblyClient(token) {
  if (!token) {
    throw new Error("❌ No token provided for Ably client");
  }

  // ✅ Reuse same client instance if already created
  if (ablyInstance) {
    return ablyInstance;
  }

  ablyInstance = new Ably.Realtime({
    // Make sure backend route matches this path
    authUrl: `${API_BASE}/realtime/token`,
    authHeaders: {
      Authorization: `Bearer ${token}`, // Pass JWT to backend auth middleware
    },
    autoConnect: true,
    closeOnUnload: true,
  });

  // Debugging connection states
  ablyInstance.connection.on((stateChange) => {
    console.log("🔌 Ably connection state:", stateChange.current);
  });

  ablyInstance.connection.on("disconnected", () => {
    console.warn("⚠️ Ably disconnected, will retry...");
  });

  ablyInstance.connection.on("failed", (err) => {
    console.error("❌ Ably failed:", err);
  });

  return ablyInstance;
}

/**
 * Optionally allow manual cleanup (on logout).
 */
export function closeAblyClient() {
  if (ablyInstance) {
    ablyInstance.close();
    ablyInstance = null;
    console.log("🛑 Ably client closed");
  }
}
