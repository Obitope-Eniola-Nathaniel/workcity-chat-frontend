import Ably from "ably";
import api from "../api/apiClient";

/**
 * getRealtime: fetch tokenRequest from backend and return Ably Realtime client
 * usage: const ably = await getRealtime();
 */
export async function getRealtime() {
  // backend returns tokenRequest with .token (or token string)
  const res = await api.get("/api/realtime/token");
  const token = res.data?.token || res.data?.tokenRequest?.token || res.data;
  // instantiate Ably Realtime client using token
  const realtime = new Ably.Realtime({ token });
  return realtime;
}
