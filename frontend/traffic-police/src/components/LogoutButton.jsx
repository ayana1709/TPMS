// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Inform backend to revoke the token
      await api.post('/traffic-user/logout');

      // Remove token and user info from localStorage
      localStorage.removeItem('traffic_token');
      localStorage.removeItem('traffic_name');
      localStorage.removeItem('traffic_username');

      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
