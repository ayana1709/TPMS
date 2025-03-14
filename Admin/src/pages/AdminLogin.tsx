// import { useState } from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex bg-white w-[98%] h-[95%] m-auto border border-green-500 rounded-md overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-login bg-center bg-cover text-white flex flex-col justify-center items-center p-10 rounded-md">
          <h1 className="text-4xl font-bold">
            Traffic Police Management System
          </h1>
          <p className="mt-4 text-center text-lg">
            The Traffic Penalty Management System simplifies tracking, managing,
            and processing traffic fines, ensuring efficiency and transparency
            for both authorities and the public.
          </p>
        </div>
        {/* Right Side */}
        <div className="w-1/2 h-screen flex flex-col justify-center items-center">
          <div className="w-[65%] p-4 h-[70%] flex flex-col justify-around border border-green-500 rounded-md hover:shadow-sm shadow-green-200 transition-all duration-500">
            <h2 className="text-3xl font-semibold mb-6 text-green-600">
              Sign In
            </h2>
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full outline-none ring-0 border-2 border-green-600 focus:border-green-700 p-3 rounded-lg mb-4 transition-all duration-200"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full outline-none ring-0 border-2 border-green-600 focus:border-green-700 p-3 rounded-lg mb-4 transition-all duration-200"
              />
            </div>
            <div>
              <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
                Login
              </button>
              <p className="mt-4 text-gray-500 cursor-pointer">
                Forgot your password?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
