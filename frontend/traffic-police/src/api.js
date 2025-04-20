// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // update with your backend
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traffic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
