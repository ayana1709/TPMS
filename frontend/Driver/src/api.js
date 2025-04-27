import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // or your backend API base
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // You may need to attach the token
  },
});

// If token is required:
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("manager_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
