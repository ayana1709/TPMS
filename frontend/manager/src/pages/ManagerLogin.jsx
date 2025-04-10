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
        // Save token
        localStorage.setItem("manager_token", response.data.token);
        localStorage.setItem("manager_name", response.data.manager.name);

        // Optional: Set default auth header for future axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

localStorage.setItem("manager_username", response.data.manager.username);
window.location.href = "/welcome";

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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Manager Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default ManagerLogin;
