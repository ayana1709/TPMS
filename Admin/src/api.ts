import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Your Laravel API URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // If using authentication with cookies
});

export default api;
