import { useEffect } from "react";

export default function useOfflineQueue(apiSendFn) {
  useEffect(() => {
    const processQueue = async () => {
      const q = JSON.parse(localStorage.getItem("outbox") || "[]");
      if (q.length && navigator.onLine) {
        for (const item of q) {
          try {
            await apiSendFn(item);
            // remove from queue
            const newQ = JSON.parse(
              localStorage.getItem("outbox") || "[]"
            ).filter((i) => i.id !== item.id);
            localStorage.setItem("outbox", JSON.stringify(newQ));
          } catch (err) {
            // keep in queue
          }
        }
      }
    };
    window.addEventListener("online", processQueue);
    processQueue();
    return () => window.removeEventListener("online", processQueue);
  }, [apiSendFn]);
}
