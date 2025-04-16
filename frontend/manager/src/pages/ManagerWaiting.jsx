import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import echo from "@/echo";
import api from "@/api"; // make sure this points to your axios instance

const ManagerWaiting = () => {
  const username = localStorage.getItem("manager_username");
  const navigate = useNavigate();

  useEffect(() => {
    let pollingInterval = null;

    const handleActivation = () => {
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
    };

    // 🔄 Start polling every 5 seconds
    const startPolling = () => {
      pollingInterval = setInterval(async () => {
        try {
          const response = await api.get(`/managers/status/${username}`);
          if (response.data.status === "Active") {
            clearInterval(pollingInterval);
            handleActivation();
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);
    };

    // ⚡ Listen to WebSocket events
    const channel = echo.channel("activation-channel");
    channel.listen(".manager-activated", (event) => {
      if (event.manager.username === username) {
        clearInterval(pollingInterval); // Stop polling if socket works
        handleActivation();
      }
    });

    // Start polling in parallel
    startPolling();

    return () => {
      channel.stopListening(".manager-activated");
      if (pollingInterval) clearInterval(pollingInterval);
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
