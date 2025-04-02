import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Automatically attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); // Retrieve token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 errors (expired token, unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("adminToken"); // Clear expired token
      // window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
