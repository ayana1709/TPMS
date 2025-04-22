import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Update if needed
});

// Add a request interceptor to attach the Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('traffic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  },
);

export default api;
