import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStores } from "@/contexts/storeContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useStores();
  // console.log(isAuthenticated);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { username, password });
      console.log(response);
      localStorage.setItem("adminToken", response.data.token);
      setIsAuthenticated(true); // Update authentication state
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsAuthenticated(false);
    }
  };
  if (isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-500 tracking-wide uppercase">
          Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="text" className="text-blue-500 ">
              User Name
            </Label>

            <input
              type="text"
              className="w-full border-3 border-blue-500 focus:border-blue-600 rounded-sm focus:outline-none focus:ring-0 transition-all duration-100"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-blue-500">
              Password
            </Label>
            <input
              type="password"
              placeholder="password"
              className="w-full border-3 border-blue-500 focus:border-blue-600 rounded-sm focus:outline-none focus:ring-0 transition-all duration-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white tracking-wider uppercase hover:bg-blue-700 cursor-pointer"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
