import React, { useState } from 'react';
import api from '../../api';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First: get CSRF cookie
      await api.get('/sanctum/csrf-cookie');

      // Then: login
      const response = await api.post('/api/traffic-user/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        const { user } = response.data;

        localStorage.setItem('traffic_name', user.full_name);
        localStorage.setItem('traffic_username', user.username);

        // Redirect based on status
        if (user.status === 'Active') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/traffic-welcome';
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login error');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800">
          Traffic Police Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-100 px-3 py-2 rounded">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
