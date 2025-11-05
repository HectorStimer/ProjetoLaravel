import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API,
  headers: { Accept: "application/json" },
});

// attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401: clear token and let app react
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }
    return Promise.reject(err);
  }
);

export default api;
