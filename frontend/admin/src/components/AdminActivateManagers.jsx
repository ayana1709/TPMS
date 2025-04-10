import api from "@/api";
import React, { useEffect, useState } from "react";
// import api from "@/api";
import Swal from "sweetalert2";

const AdminActivateManagers = () => {
  const [pendingManagers, setPendingManagers] = useState([]);

  useEffect(() => {
    fetchPendingManagers();
  }, []);

  const fetchPendingManagers = async () => {
    try {
      const res = await api.get("/admin/pending-activations");
      setPendingManagers(res.data);
    } catch (err) {
      console.error("Failed to fetch pending managers:", err);
    }
  };

  const activateManager = async (username) => {
    try {
      await api.post(`/admin/activate-manager/${username}`);
      Swal.fire("Activated!", `Manager ${username} is now active.`, "success");
      fetchPendingManagers(); // refresh list
    } catch (err) {
      Swal.fire("Error", "Failed to activate manager", "error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Pending Manager Activations
      </h2>

      {pendingManagers.length === 0 ? (
        <p className="text-gray-500">No pending activation requests.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Region</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingManagers.map((manager) => (
              <tr key={manager.username}>
                <td className="p-2 border">{manager.name}</td>
                <td className="p-2 border">{manager.email}</td>
                <td className="p-2 border">{manager.username}</td>
                <td className="p-2 border">{manager.region}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => activateManager(manager.username)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Activate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminActivateManagers;
