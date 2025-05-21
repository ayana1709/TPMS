import React, { useState } from "react";
import axios from "axios";
import api from "@/api";

const ManagerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/managers/login", {
        username,
        password,
      });

      if (response.data.status === "success") {
        const { token, manager } = response.data;

        localStorage.setItem("manager_token", token);
        localStorage.setItem("manager_name", manager.name);
        localStorage.setItem("manager_username", manager.username);
        localStorage.setItem("manager_id", manager.id);

        if (manager.status === "Active") {
          window.location.href = "/dashboard/home";
        } else {
          window.location.href = "/welcome";
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login error");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Manager Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 animate-pulse">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium text-white transition duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="loader ease-linear rounded-full border-2 border-t-2 border-white h-4 w-4 animate-spin" />
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Loading spinner CSS */}
      <style>{`
        .loader {
          border-color: transparent;
          border-top-color: white;
        }
      `}</style>
    </div>
  );
};

export default ManagerLogin;
