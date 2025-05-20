import React, { useState } from 'react';

const SettingsPage = () => {
  const [form, setForm] = useState({
    fullName: 'Ayana Basha',
    email: 'ayana@example.com',
    notifications: true,
    smsAlerts: false,
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings submitted:', form);
    // Save settings to backend here
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">⚙️ Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="notifications"
                checked={form.notifications}
                onChange={handleChange}
              />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="smsAlerts"
                checked={form.smsAlerts}
                onChange={handleChange}
              />
              <span>SMS Alerts</span>
            </label>
          </div>
        </div>

        {/* Password */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
