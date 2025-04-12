import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import echo from "@/echo";

const ManagerWaiting = () => {
  const username = localStorage.getItem("manager_username");
  const navigate = useNavigate();

  useEffect(() => {
    const channel = echo.channel("activation-channel");

    channel.listen(".manager-activated", (event) => {
      if (event.manager.username === username) {
        console.log("✅ Activated manager detected:", event.manager);

        // Show beautiful toast before redirect
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Your account has been activated!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#f0f9ff",
          color: "#1e3a8a",
          iconColor: "#22c55e",
        });

        setTimeout(() => {
          navigate("/dashboard/home");
        }, 3000);
      }
    });

    return () => {
      channel.stopListening(".manager-activated");
    };
  }, [username, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-center">
      <div className="bg-white shadow-lg p-10 rounded-xl border border-blue-100 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">Waiting for Admin Activation...</h1>
        <p className="text-gray-600 text-sm">
          Please be patient while we verify your credentials. <br />
          You'll be redirected automatically once activated.
        </p>

        <div className="relative">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ManagerWaiting;
