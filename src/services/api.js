import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const api = {
  get: (url, opts) => API.get(url, opts),
  post: (url, data, opts) => API.post(url, data, opts),
  patch: (url, data, opts) => API.patch(url, data, opts),
  delete: (url, opts) => API.delete(url, opts),
  setToken: (token) => {
    if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete API.defaults.headers.common["Authorization"];
  },
};

export default api;
