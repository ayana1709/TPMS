import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // This is important for CSRF token
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // Your login token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Get CSRF token from cookie
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
  }

  return config;
});

export default api;
