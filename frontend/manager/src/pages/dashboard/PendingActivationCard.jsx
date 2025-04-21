import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
// import echo from "@/utils/echo"; // adjust path as needed
import api from "@/api";
import echo from "@/echo";

const fetchPendingActivations = async () => {
  const response = await api.get("/manager/pending-activations");
  return response.data;
};

const activateUser = async (username) => await api.post(`/manager/activate/${username}`);
const denyUser = async (username) => await api.delete(`/manager/delete/${username}`);

export default function PendingActivationCard() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pendingActivations"],
    queryFn: fetchPendingActivations,
  });

  const activateMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingActivations"] });
      Swal.fire({
        icon: "success",
        title: "User Activated",
        toast: true,
        position: "top-end",
        timer: 6000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    },
  });

  const denyMutation = useMutation({
    mutationFn: denyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingActivations"] });
      Swal.fire({
        icon: "info",
        title: "User Denied",
        toast: true,
        position: "top-end",
        timer: 6000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    },
  });

  useEffect(() => {
    const channel = echo.channel("traffic-activations");

    channel.listen(".activation.requested", (event) => {
      Swal.fire({
        icon: "info",
        title: `New activation request from ${event.name}`,
        toast: true,
        position: "top-end",
        timer: 6000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Update the cached data directly
      queryClient.setQueryData(["pendingActivations"], (oldData) => {
        if (!oldData) return [event];
        const alreadyExists = oldData.some((u) => u.id === event.id);
        return alreadyExists ? oldData : [...oldData, event];
      });
    });

    return () => {
      channel.stopListening(".activation.requested");
    };
  }, [queryClient]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error loading data</div>;

  return (
    <div className="p-6">
      {data?.length === 0 ? (
        <div className="text-gray-500 text-center">No pending activations.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((user) => {
            const isExpanded = expandedId === user.id;

            return (
              <div
                key={user.id || user.username}
                className="bg-white border border-gray-200 shadow-md rounded-xl p-5 transition-all duration-300"
              >
                <div className="text-lg font-semibold text-gray-800 mb-1">{user.full_name || user.name}</div>
                <p className="text-sm text-gray-600">Badge: {user.badge_number || "N/A"}</p>

                {isExpanded && (
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <p>Rank: {user.rank}</p>
                    <p>Phone: {user.phone}</p>
                    <p>Email: {user.email}</p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-yellow-600">{user.status}</span>
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => activateMutation.mutate(user.username)}
                    disabled={activateMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {activateMutation.isPending ? "Activating..." : "Activate"}
                  </button>

                  <button
                    onClick={() => denyMutation.mutate(user.username)}
                    disabled={denyMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {denyMutation.isPending ? "Denying..." : "Deny"}
                  </button>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : user.id)}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  {isExpanded ? "View Less" : "View More"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
