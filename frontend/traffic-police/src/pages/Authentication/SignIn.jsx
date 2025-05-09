import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'react-feather';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import api from '../../api';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no saved theme, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme on mount and when it changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/traffic-user/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate(user.status === 'Active' ? '/dashboard' : '/traffic-welcome');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      {/* Animated Grid Background */}
      <div
        className={`absolute inset-0 bg-grid-pattern transition-opacity duration-300 ${
          isDarkMode ? 'opacity-30' : 'opacity-20'
        }`}
      >
        <div className="absolute inset-0 animate-grid-move"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div
            className={`backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border transition-colors duration-300 ${
              isDarkMode
                ? 'bg-gray-800/90 border-gray-700/20'
                : 'bg-white/90 border-gray-200/20'
            }`}
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h2
                  className={`text-3xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } mb-2`}
                >
                  Welcome Back
                </h2>
                <p
                  className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Sign in to your traffic police account
                </p>
              </div>

              {error && (
                <div
                  className={`mb-6 p-4 rounded-lg backdrop-blur-sm transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-red-900/20 border-red-800'
                      : 'bg-red-50/80 border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}
                  >
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className={`rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50 border-gray-600' : ''
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className={`rounded-lg pr-12 ${
                        isDarkMode ? 'bg-gray-700/50 border-gray-600' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        isDarkMode
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="font-semibold">Signing in...</span>
                    </>
                  ) : (
                    <span className="flex items-center justify-center font-semibold">
                      <span className="mr-2">Sign In</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            currentColor 2px,
            transparent 2px
          );
          background-size: 25px 25px;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(12.5px, 12.5px);
          }
        }

        .animate-grid-move {
          animation: grid-move 12s linear infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
