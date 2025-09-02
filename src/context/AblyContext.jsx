import React, { createContext, useContext, useEffect, useState } from "react";
import Ably from "ably";
import { AuthContext } from "./AuthContext";

export const AblyContext = createContext();

export function AblyProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [ablyRealtime, setAblyRealtime] = useState(null);

  useEffect(() => {
    if (!user) {
      if (ablyRealtime) {
        ablyRealtime.close();
        setAblyRealtime(null);
      }
      return;
    }

    // Auth URL should point to backend token endpoint
    const client = new Ably.Realtime({
      authUrl: `${import.meta.env.VITE_API_URL}/api/realtime/token`,
      clientId: user._id,
    });
    setAblyRealtime(client);

    return () => client.close();
  }, [user]);

  return (
    <AblyContext.Provider value={{ ably: ablyRealtime }}>
      {children}
    </AblyContext.Provider>
  );
}

export const useAbly = () => useContext(AblyContext);
