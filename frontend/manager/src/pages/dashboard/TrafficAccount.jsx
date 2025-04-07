import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/api';

export default function TrafficAccount() {
  const [formData, setFormData] = useState({
    fullName: '',
    badgeNumber: '',
    rank: '',
    phone: '',
    email: '',
    station: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    let password = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setFormData({ ...formData, password, confirmPassword: password });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      full_name: formData.fullName,
      badge_number: formData.badgeNumber,
      rank: formData.rank,
      phone: formData.phone,
      email: formData.email,
      station: formData.station,
      username: formData.username,
      password: formData.password,
    };
  
    try {
      const response = await api.post('/traffic-users', payload);
  
      // Axios doesn't use response.ok — success is in try block
      alert('Account created successfully!');
      setFormData({
        fullName: '',
        badgeNumber: '',
        rank: '',
        phone: '',
        email: '',
    
        username: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage =
        err.response?.data?.message || 'Something went wrong.';
      alert('Error: ' + errorMessage);
    }
  };
  
  

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Create Traffic Police Account
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {/* Left Side - Personal Info */}
        <div className="space-y-6">
          {[
            ['Full Name', 'fullName', 'e.g., Ayana Basha'],
            ['Badge Number', 'badgeNumber', 'e.g., 123456'],
            ['Rank', 'rank', 'e.g., Inspector'],
            ['Phone', 'phone', 'e.g., +251900000000'],
            ['Email', 'email', 'e.g., example@gmail.com'],
          ].map(([label, name, placeholder]) => (
            <div key={name}>
              <label className="block text-gray-800 font-semibold mb-2">{label}</label>
              <input
                type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          ))}
        </div>

        {/* Right Side - Account Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full px-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-gray-800 font-semibold mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <div
              onClick={togglePassword}
              className="absolute top-10 right-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="block text-gray-800 font-semibold mb-2">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-4 py-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <div
              onClick={toggleConfirmPassword}
              className="absolute top-10 right-3 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            type="button"
            onClick={generatePassword}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-800 transition font-semibold"
          >
            Generate Random Password
          </button>
        </div>

        {/* Submit Button - spans both sides */}
        <div className="lg:col-span-2 flex justify-center pt-6">
          <button
            type="submit"
            className="bg-green-600 text-white py-3 px-12 rounded-xl shadow hover:bg-green-700 transition text-lg font-bold"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
