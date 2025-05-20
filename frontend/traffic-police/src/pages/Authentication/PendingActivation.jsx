import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import echo from '../../echo';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const PendingActivation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const username = user.username;

  const checkActivationStatus = async () => {
    try {
      const response = await api.get(`/check-activation-status/${username}`);
      const status = response.data.status;

      if (status === 'Active') {
        Swal.fire({
          icon: 'success',
          title: 'Account Activated',
          text: 'Redirecting to dashboard...',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else if (status === 'Denied' || status === 'Inactive') {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Your activation request was denied. Redirecting to login...',
          confirmButtonColor: '#dc2626',
          background: '#fef2f2',
          color: '#7f1d1d',
          iconColor: '#dc2626',
          timer: 3000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          localStorage.clear();
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      console.error('Error checking status:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkActivationStatus, 5000);

    const channel = echo.channel('traffic-activation-status');
    channel.listen('.activation.status.updated', (event) => {
      if (event.username === username) {
        if (event.status === 'Active') {
          Swal.fire({
            icon: 'success',
            title: 'Account Activated',
            text: 'Redirecting to dashboard...',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          });

          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else if (event.status === 'Denied' || event.status === 'Inactive') {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Your activation request was denied. Redirecting to login...',
            confirmButtonColor: '#dc2626',
            background: '#fef2f2',
            color: '#7f1d1d',
            iconColor: '#dc2626',
            timer: 3000,
            showConfirmButton: false,
          });

          setTimeout(() => {
            localStorage.clear();
            navigate('/');
          }, 3000);
        }
      }
    });

    return () => {
      clearInterval(interval);
      channel.stopListening('.activation.status.updated');
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      <div className="bg-white shadow-xl p-10 rounded-3xl w-full max-w-md text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-yellow-600">
          Hello, {name} 👋
        </h1>
        <p className="text-gray-600">
          Your account{' '}
          <span className="text-yellow-800 font-medium hover:underline transition-all">
            ({username})
          </span>{' '}
          is currently{' '}
          <strong className="text-yellow-700">pending activation</strong>.
        </p>

        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
        </div>

        <p className="text-sm text-gray-500 italic animate-pulse">
          Waiting for manager approval...
        </p>
      </div>
    </div>
  );
};

export default PendingActivation;
