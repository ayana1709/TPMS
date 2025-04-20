import React from 'react';
import { useNavigate } from 'react-router-dom';

const PendingActivation = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('traffic_name') || 'User';
  const username = localStorage.getItem('traffic_username') || '';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-200">
      <div className="bg-white shadow-2xl p-8 rounded-2xl max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold text-yellow-700">Welcome, {name}</h1>
        <p className="text-gray-700 text-sm">
          Your account (<strong>{username}</strong>) is currently pending
          activation. Please wait for your manager to approve your access.
        </p>

        <div className="text-yellow-600 text-sm bg-yellow-100 px-4 py-2 rounded-lg">
          Activation usually takes a short time. If it takes too long, please
          contact your manager.
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PendingActivation;
