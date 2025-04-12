import React, { useEffect, useState } from "react";
import echo from "@/echo";
import api from "@/api";
import Swal from "sweetalert2";

const PendingActivationList = () => {
  const [managers, setManagers] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchPendingManagers = async () => {
      try {
        const response = await api.get("/admin/pending-activations");
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchPendingManagers();

    const activationChannel = echo.channel("activation-channel");

    activationChannel.listen(".manager-requested", (e) => {
      setManagers((prev) => [...prev, e.manager]);
      Swal.fire({
        title: "New Activation Request!",
        text: `Manager ${e.manager.name} is requesting activation.`,
        icon: "info",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    });

    activationChannel.listen(".manager-activated", (e) => {
      setManagers((prev) => prev.filter((m) => m.id !== e.manager.id));
      Swal.fire({
        title: "Manager Activated",
        text: `${e.manager.name} has been activated.`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    });

    return () => {
      echo.leave("activation-channel");
    };
  }, []);

  const handleActivate = async (username) => {
    try {
      const response = await api.post(`/admin/activate/${username}`);
      console.log("Activation Success:", response.data);

      Swal.fire(
        "Activated!",
        `Manager ${username} activated and email sent successfully.`,
        "success"
      );
    } catch (error) {
      console.error("Activation Error:", error);

      let message = "Activation failed.";
      if (error.response) {
        // Server responded with error
        message =
          error.response.data.error || error.response.data.message || message;
      } else if (error.request) {
        // Request made but no response
        message = "No response from server.";
      } else {
        // Error during setting up the request
        message = error.message;
      }

      Swal.fire("Error", message, "error");
    }
  };

  const handleDeny = async (username) => {
    try {
      await api.delete(`/admin/delete/${username}`);
      setManagers((prev) => prev.filter((m) => m.username !== username));
      Swal.fire("Denied", `Manager ${username} denied.`, "info");
    } catch (error) {
      Swal.fire("Error", "Deny failed.", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Managers Requesting Activation
      </h2>

      {managers.length === 0 ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managers.map((manager, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={manager.id}
                className="border rounded-2xl shadow-md p-4 bg-white hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="space-y-1 text-sm text-gray-800">
                    <p>
                      <strong>Name:</strong> {manager.name}
                    </p>
                    <p>
                      <strong>Username:</strong> {manager.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {manager.email}
                    </p>
                  </div>
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    {isExpanded ? "Hide" : "View More"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Phone:</strong> {manager.phone}
                    </p>
                    <p>
                      <strong>Region:</strong> {manager.region}
                    </p>
                    <p>
                      <strong>Zone:</strong> {manager.zone}
                    </p>
                    <p>
                      <strong>Woreda:</strong> {manager.woreda}
                    </p>
                    <p>
                      <strong>Status:</strong> {manager.status}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleActivate(manager.username)}
                        className="bg-green-500 text-white px-4 py-1 rounded-xl hover:bg-green-600"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleDeny(manager.username)}
                        className="bg-red-500 text-white px-4 py-1 rounded-xl hover:bg-red-600"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingActivationList;
