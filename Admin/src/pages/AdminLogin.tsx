import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMiniEyeSlash, HiOutlineEye } from "react-icons/hi2";
import { motion } from "framer-motion";
import api from "../api";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate for redirection

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Login Successful:", response.data);

      // Store token in local storage
      localStorage.setItem("token", response.data.token);

      alert("Login Successful!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error: any) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex bg-white w-[98%] h-[95%] m-auto border border-green-500 rounded-md overflow-hidden">
        {/* Left Side */}
        <motion.div
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100vw", opacity: 0 }}
          transition={{ type: "tween", duration: 0.9, ease: "easeOut" }}
          className="w-1/2 bg-login bg-center bg-cover text-white flex flex-col justify-center items-center p-10 rounded-md"
        >
          <h1 className="text-4xl text-center font-bold font-poppins">
            Traffic Police Management System
          </h1>
          <p className="mt-4 text-left text-lg font-poppins">
            Manage traffic fines efficiently and transparently.
          </p>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100vw", opacity: 0 }}
          transition={{ type: "tween", duration: 0.9, ease: "easeOut" }}
          className="w-1/2 h-screen flex flex-col justify-center items-center"
        >
          <form
            onSubmit={handleSubmit}
            className="w-[65%] p-4 h-[70%] flex flex-col justify-around border border-green-500 rounded-md"
          >
            <h2 className="text-3xl font-semibold font-poppins mb-6 text-green-600">
              Sign In
            </h2>

            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-green-600 focus:border-green-700 p-3 rounded-lg mb-4"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-green-600 focus:border-green-700 p-3 rounded-lg mb-4"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[40%] right-4 cursor-pointer"
              >
                {showPassword ? (
                  <HiOutlineEye size={20} className="text-green-600" />
                ) : (
                  <HiMiniEyeSlash size={20} className="text-green-600" />
                )}
              </div>
            </div>

            <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
