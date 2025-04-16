import React, { useEffect, useState } from "react";
import echo from "@/echo";
import api from "@/api";
import Swal from "sweetalert2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PendingActivationList = () => {
  const [managers, setManagers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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
        timer: 6000,
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
      await api.post(`/admin/activate/${username}`);
      Swal.fire(
        "Activated!",
        `Manager ${username} activated and email sent successfully.`,
        "success"
      );
    } catch (error) {
      let message = "Activation failed.";
      if (error.response) {
        message =
          error.response.data.error || error.response.data.message || message;
      } else if (error.request) {
        message = "No response from server.";
      } else {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {managers.map((manager) => {
            const isExpanded = expandedId === manager.id;

            return (
              <Card
                key={manager.id}
                className="flex flex-col justify-between min-h-[220px] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{manager.name}</CardTitle>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Username:</strong> {manager.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {manager.email}
                    </p>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="text-sm text-gray-700 space-y-1">
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
                  </CardContent>
                )}

                <CardFooter className="flex flex-col gap-2 mt-auto">
                  <div className="flex justify-between w-full">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleActivate(manager.username)}
                    >
                      Activate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeny(manager.username)}
                    >
                      Deny
                    </Button>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : manager.id)
                    }
                    className="text-xs text-blue-600 hover:underline self-start"
                  >
                    {isExpanded ? "Hide Details" : "View More"}
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingActivationList;
