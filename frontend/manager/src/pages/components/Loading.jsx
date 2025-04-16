import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-spin border-t-transparent"></div>
          <div className="absolute inset-2 rounded-full bg-white shadow-inner"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading, please wait...
        </h2>
      </div>
    </div>
  );
};

export default Loading;
