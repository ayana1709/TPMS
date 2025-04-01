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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("adminToken", response.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="relative flex justify-center items-center h-screen bg-[#082f49]">
      <div className="absolute right-20 h-[90%] w-[40%] bg-sky-900 p-8 rounded-xl shadow-2xl overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-2 text-white tracking-widest uppercase">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="relative h-full">
          <div className="flex flex-col gap-4 absolute w-[80%] top-[30%] left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="text" className="text-xl text-white">
                User Name
              </Label>
              <Input
                type="text"
                className="w-full py-6 border-2 border-gray-200 focus:border-green-500 rounded-md focus:outline-none focus:ring-0 transition-all duration-150"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-xl text-white">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Password"
                className="inline-block w-full border-2 py-6 border-gray-200 focus:border-green-500 rounded-md focus:outline-none focus:ring-0 transition-all duration-150"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full py-6 bg-sky-800 text-white tracking-wide uppercase hover:bg-sky-950 cursor-pointer rounded-lg transition-all duration-200"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
