import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    console.log("Token from localStorage:", token); // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request headers:", config.headers); // Debug log
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error); // Debug log
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response); // Debug log
    return response;
  },
  (error) => {
    console.error("Response error:", error.response); // Debug log
    if (error.response?.status === 401) {
      console.log("Unauthorized - removing token"); // Debug log
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
