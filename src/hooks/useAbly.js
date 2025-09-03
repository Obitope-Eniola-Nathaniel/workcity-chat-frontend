import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { createAblyClient } from "../ably/ablyClient";

export function useAbly() {
  const { token } = useContext(AuthContext);
  const [ably, setAbly] = useState(null);

  useEffect(() => {
    if (!token) return;

    // ✅ Create or reuse existing Ably client
    const client = createAblyClient(token);

    const handleConnected = () => {
      console.log("✅ Ably connected");
    };

    const handleFailed = (err) => {
      console.error("❌ Ably connection failed", err);
    };

    client.connection.on("connected", handleConnected);
    client.connection.on("failed", handleFailed);

    setAbly(client);

    // ✅ Cleanup only event listeners, not the entire connection
    return () => {
      client.connection.off("connected", handleConnected);
      client.connection.off("failed", handleFailed);
    };
  }, [token]);

  return ably;
}
