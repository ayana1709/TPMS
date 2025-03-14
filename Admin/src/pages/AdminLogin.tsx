// import { useState } from "react";
import { useState } from "react";
import { HiMiniEyeSlash } from "react-icons/hi2";
import { HiOutlineEye } from "react-icons/hi2";
import { motion } from "framer-motion";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  // const [loading, setLoading] = useState(false);
  console.log(formData);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://your-backend.com/api/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login Successful:", response.data);
      alert("Login Successful!"); // Replace with better UX like redirecting
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex bg-white w-[98%] h-[95%] m-auto border border-green-500 rounded-md overflow-hidden">
        {/* Left Side */}
        <motion.div
          initial={{ x: "100vw", opacity: 0 }} // Start off-screen (right)
          animate={{ x: 0, opacity: 1 }} // Move to final position
          exit={{ x: "-100vw", opacity: 0 }} // Exit to the left (optional)
          transition={{ type: "tween", duration: 0.9, ease: "easeOut" }}
          className="w-1/2 bg-login bg-center bg-cover text-white flex flex-col justify-center items-center p-10 rounded-md"
        >
          <h1 className="text-4xl text-center font-bold font-poppins">
            Traffic Police Management System
          </h1>
          <p className="mt-4 text-left text-lg font-poppins">
            The Traffic Penalty Management System simplifies tracking, managing,
            and processing traffic fines, ensuring efficiency and transparency
            for both authorities and the public.
          </p>
        </motion.div>
        {/* Right Side */}
        <motion.div
          initial={{ x: "-100vw", opacity: 0 }} // Start off-screen (left)
          animate={{ x: 0, opacity: 1 }} // Move to final position
          exit={{ x: "100vw", opacity: 0 }} // Exit animation (optional)
          transition={{ type: "tween", duration: 0.9, ease: "easeOut" }}
          className="w-1/2 h-screen flex flex-col justify-center items-center"
        >
          <form
            onSubmit={handleSubmit}
            className="w-[65%] p-4 h-[70%] flex flex-col justify-around border border-green-500 rounded-md hover:shadow-sm shadow-green-200 transition-all duration-500"
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
                className="placeholder:text-lg w-full bg-transparent outline-none ring-0 border-2 border-green-600 focus:border-green-700 p-3 rounded-lg mb-4 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <input
                type={`${showPassword ? "password" : "text"}`}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full placeholder:text-lg bg-transparent outline-none ring-0 border-2 border-green-600 focus:border-green-700 p-3 rounded-lg mb-4 transition-all duration-200"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[40%] right-4 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <HiOutlineEye size={20} className="text-green-600" />
                ) : (
                  <HiMiniEyeSlash size={20} className="text-green-600" />
                )}
              </div>
            </div>
            <div>
              <button className="w-full font-poppins bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
                Login
              </button>
              <p className="mt-4 text-gray-500 cursor-pointer font-poppins">
                Forgot your password?
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
