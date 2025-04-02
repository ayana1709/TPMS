import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStores } from "@/contexts/storeContext";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useStores();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    try {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("adminToken", response.data.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      // setIsAuthenticated(false);
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <div className="relative w-full flex justify-center items-center h-screen bg-[#082f49] overflow-hidden">
      <div className="bg-[url('/images/addis.png')] bg-cover bg-center w-[95%] h-[95%] rounded-lg p-4">
        <motion.img
          src="/images/kido.png" // Replace with your actual image URL
          alt="Moving Image"
          className="absolute z-[99] -bottom-6 w-30 h-auto"
          animate={{ x: ["-100vw", "43vw", "43vw", "100vw"] }} // Moves in 3 stages
          transition={{
            duration: 20, // Total duration for the movement
            times: [0, 0.4, 0.6, 1], // When each stage happens (0% -> 50% -> 100%)
            ease: "linear", // Smooth movement
            repeat: Infinity, // Repeat forever
          }}
        />
        <img
          src="/images/traffic.png" // Replace with your actual image URL
          alt="Moving Image"
          className="absolute z-[9] left-[53%] -translate-x-1/2 bottom-2 w-55 h-auto"
          animate={{ x: ["-100vw", "5vw", "5vw", "100vw"] }} // Moves in 3 stages
          transition={{
            duration: 20, // Total duration for the movement
            times: [0, 0.4, 0.6, 1], // When each stage happens (0% -> 50% -> 100%)
            ease: "linear", // Smooth movement
            repeat: Infinity, // Repeat forever
          }}
        />
        <div className="absolute z-[9] inset-0 bg-gradient-to-b from-black/50 to-black/50"></div>

        <motion.div
          initial={{ x: -300, opacity: 0 }} // Start 200px left and invisible
          animate={{ x: 0, opacity: 1 }} // Move to the original position and become visible
          transition={{ duration: 0.8, ease: "easeOut" }} // Smooth animation
          className="absolute z-[999] left-1/2 -translate-x-1/2 h-[90%] w-[35%] bg-[rgba(0,0,0,0.5)] p-8 rounded-xl shadow-2xl overflow-hidden"
        >
          <h2 className="text-4xl font-bold text-center mb-2 text-white tracking-widest uppercase">
            Login
          </h2>
          {error && (
            <p className="text-red-800 text-xl tracking-wider text-center mb-4 bg-[rgba(0,0,0,0.3)] py-2 p-2 w-[90%] mx-auto rounded-sm">
              {error}
            </p>
          )}
          <form onSubmit={handleLogin} className="relative h-full">
            <div className="flex flex-col gap-6 absolute w-[80%] top-[30%] left-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="text" className="text-lg text-gray-300">
                  User Name
                </Label>
                <Input
                  type="text"
                  className="placeholder:text-gray-200 text-gray-200 w-full py-6 border-2 border-gray-200 focus:border-green-500 rounded-md focus:outline-none focus:ring-0 transition-all duration-150"
                  placeholder="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-lg text-gray-300">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Password"
                  className="placeholder:text-gray-200 text-gray-200 inline-block w-full border-2 py-6 border-gray-200 focus:border-green-500 rounded-md focus:outline-none focus:ring-0 transition-all duration-150"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                // disabled={loading}
                className="w-full py-6 bg-gray-900 text-white tracking-[4px] uppercase hover:bg-gray-950 disabled:opacity-50 cursor-pointer rounded-lg transition-all duration-500"
              >
                {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
