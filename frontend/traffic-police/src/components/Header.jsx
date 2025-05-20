import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Switch } from './ui/switch';
import { Bell, Search, LogOut } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="sticky top-0 z-50 flex h-18 w-full items-center justify-between bg-white px-4 py-2 shadow-md dark:bg-gray-900 md:px-6">
      {/* Sidebar Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(!sidebarOpen);
          }}
          className="block rounded-md border border-gray-300 p-2 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 lg:hidden"
        >
          <div className="space-y-1">
            <span className="block h-0.5 w-6 bg-black dark:bg-white" />
            <span className="block h-0.5 w-6 bg-black dark:bg-white" />
            <span className="block h-0.5 w-6 bg-black dark:bg-white" />
          </div>
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:block">
          Traffic officer Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Switch
          id="theme-toggle"
          checked={isDarkMode}
          onCheckedChange={setIsDarkMode}
        />

        {/* Notification */}
        <div className="relative">
          <Bell className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        {/* User Info (No dropdown now) */}
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${
              user?.full_name || 'User'
            }&background=random`}
            alt="User Avatar"
            className="h-10 w-10 rounded-full border border-gray-300 object-cover dark:border-gray-700"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              {user?.full_name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
