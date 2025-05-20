import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  LockClosedIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const TrafficWelcome = () => {
  const { user } = useAuth();
  const username = user.username;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log(username);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      await api.post('/traffic/update-credentials', {
        username,
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      Swal.fire({
        title: 'Success!',
        text: 'Password updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-yellow-200', // Background color
          confirmButton:
            'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300', // Confirm button styling
        },
      });

      setUpdated(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleActivationRequest = async () => {
    try {
      const res = await api.post(`/traffic/request-activation/${username}`);

      Swal.fire({
        icon: 'success',
        title: 'Activation Requested',
        text: res.data.message,
        timer: 2500, // auto-close after 2.5 seconds
        timerProgressBar: true,
        showConfirmButton: true,
        customClass: {
          popup: 'bg-gray-200', // Background color
          confirmButton:
            'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300', // Confirm button styling
        },
        toast: false,
        position: 'center',
        didClose: () => {
          navigate('/pending-activation');
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to request activation.',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center',
      });
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-10 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Welcome, {name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please update your password to secure your traffic account.
        </p>
      </div>

      <form onSubmit={handlePasswordUpdate} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 font-semibold">
            Username
          </label>
          <input
            type="text"
            value={username}
            disabled
            className="w-full mt-1 p-2 bg-gray-100 text-gray-600 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 font-semibold">
            Old Password
          </label>
          <input
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <label className="text-sm text-gray-600 font-semibold">
            New Password
          </label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
          >
            {showNewPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        <div className="relative">
          <label className="text-sm text-gray-600 font-semibold">
            Confirm New Password
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          <LockClosedIcon className="w-5 h-5 mr-2" />
          Update Password
        </button>
      </form>

      {updated && (
        <div className="mt-6">
          <button
            onClick={handleActivationRequest}
            className="flex items-center justify-center w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all animate-bounce"
          >
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Request Account Activation
          </button>
        </div>
      )}
    </div>
  );
};

export default TrafficWelcome;
