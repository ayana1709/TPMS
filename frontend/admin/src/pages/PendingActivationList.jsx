import React, { useEffect, useState } from "react";
import echo from "@/echo";
import api from "@/api";
import Swal from "sweetalert2";

const PendingActivationList = () => {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchPendingManagers = async () => {
      try {
        const response = await api.get("/admin/pending-activations");
        console.log("Initial fetch:", response.data);
        setManagers(response.data); // set initial pending list
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchPendingManagers();

    // 🟢 Listen for real-time manager activation requests
    echo.channel("activation-channel").listen(".manager-requested", (e) => {
      console.log("Real-time activation request received:", e.manager);
      setManagers((prev) => [...prev, e.manager]);

      // Show a toast notification when a new activation request comes in
      Swal.fire({
        title: "New Activation Request!",
        text: `Manager ${e.manager.name} is requesting activation.`,
        icon: "info",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000, // Toast disappears after 3 seconds
        customClass: {
          popup: "toast-popup", // optional, add custom class if you want
        },
      });
    });

    // Cleanup on component unmount
    return () => {
      echo.leave("activation-channel");
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Managers Requesting Activation</h2>
      {managers.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="space-y-2">
          {managers.map((manager, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <p>
                <strong>Name:</strong> {manager.name}
              </p>
              <p>
                <strong>Username:</strong> {manager.username}
              </p>
              <p>
                <strong>Email:</strong> {manager.email}
              </p>
              <p>
                <strong>Status:</strong> {manager.status}
              </p>
              {/* You can add a button here to activate */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingActivationList;
