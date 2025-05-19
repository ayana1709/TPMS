import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Eye, EyeOff, Pencil, Trash2, List, LayoutGrid, X } from "lucide-react";
import api from "@/api";

const ShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [expandedShiftId, setExpandedShiftId] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [userViews, setUserViews] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [editForm, setEditForm] = useState({});

  const managerId = localStorage.getItem("manager_id");
  const navigate = useNavigate();
const showToast = (message, icon = "success") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};



  useEffect(() => {
    fetchShifts();
  }, []);

  useEffect(() => {
    if (shifts.length > 0) {
      shifts.forEach((shift) => {
        if (!assignments[shift.id]) {
          fetchAssignedUsers(shift.id);
        }
      });
    }
  }, [shifts]);

  const fetchShifts = async () => {
    try {
      const response = await api.get(`/shifts`, { params: { manager_id: managerId } });
      setShifts(response.data);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    }
  };

  const fetchAssignedUsers = async (shiftId) => {
    try {
      const res = await api.get(`/assigned-traffic-users`, {
        params: {
          shift_id: shiftId,
          manager_id: managerId,
        },
      });
      setAssignments((prev) => ({
        ...prev,
        [shiftId]: res.data,
      }));
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

 const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This shift will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.delete(`/shifts/${id}`);
        fetchShifts();
        showToast("Shift deleted successfully!");
      } catch (error) {
        console.error("Failed to delete shift:", error);
        showToast("Failed to delete shift", "error");
      }
    }
  });
};



  const toggleExpandShift = (id) => {
    const newExpandedId = expandedShiftId === id ? null : id;
    setExpandedShiftId(newExpandedId);
  };

  const toggleUserView = (shiftId) => {
    setUserViews((prev) => ({
      ...prev,
      [shiftId]: prev[shiftId] === "avatar" ? "list" : "avatar",
    }));
  };

  const openEditModal = (shift) => {
    setSelectedShift(shift);
    setEditForm(shift);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

const handleEditSubmit = async (e) => {
  e.preventDefault();

  // Ensure Laravel gets time in 'HH:mm:ss' format
  const formatTime = (time) =>
    time && time.length === 5 ? `${time}:00` : time;

  const formattedData = {
    ...editForm,
    start_time: formatTime(editForm.start_time),
    end_time: formatTime(editForm.end_time),
    start_date: editForm.start_date || null,
    end_date: editForm.end_date || null,
  };

  try {
    await api.put(`/shifts/${selectedShift.id}`, formattedData);
    setShowEditModal(false);
    fetchShifts();
    showToast("Shift updated successfully!");
  } catch (error) {
    console.error("Failed to update shift:", error);
    const msg = error?.response?.data?.message || "Failed to update shift";
    showToast(msg, "error");
  }
};



  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">All Shifts</h2>
        <button
          onClick={() => navigate("/Dashboard/shifts-create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Create Shift
        </button>
      </div>

      {shifts.length === 0 ? (
        <div className="text-gray-400">No shifts found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shifts.map((shift) => (
            <div key={shift.id} className="bg-white rounded-2xl shadow-md border p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{shift.name}</h3>
                <div className="flex gap-2 items-center">
                  {expandedShiftId === shift.id ? (
                    <EyeOff size={18} className="text-blue-600 cursor-pointer" onClick={() => toggleExpandShift(shift.id)} />
                  ) : (
                    <Eye size={18} className="text-blue-600 cursor-pointer" onClick={() => toggleExpandShift(shift.id)} />
                  )}
                  <Pencil size={18} className="text-yellow-500 cursor-pointer" onClick={() => openEditModal(shift)} />
                  <Trash2 size={18} className="text-red-500 cursor-pointer" onClick={() => handleDelete(shift.id)} />
                </div>
              </div>

              {expandedShiftId === shift.id && (
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div><strong>Start Time:</strong> {shift.start_time}</div>
                  <div><strong>End Time:</strong> {shift.end_time}</div>
                  <div><strong>Start Date:</strong> {shift.start_date}</div>
                  <div><strong>End Date:</strong> {shift.end_date}</div>
                </div>
              )}

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Assigned Users</p>
                  <button onClick={() => toggleUserView(shift.id)} className="text-gray-500 hover:text-black">
                    {userViews[shift.id] === "list" ? <LayoutGrid size={18} /> : <List size={18} />}
                  </button>
                </div>

                {assignments[shift.id] ? (
                  assignments[shift.id].length === 0 ? (
                    <p className="text-gray-400 text-sm">No users assigned.</p>
                  ) : userViews[shift.id] === "list" ? (
                    <ul className="space-y-1 text-sm text-gray-600">
                      {assignments[shift.id].map((user) => (
                        <li key={user.id}>{user.full_name}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex -space-x-2">
                      {assignments[shift.id].map((user) => (
                        <img
                          key={user.id}
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}`}
                          alt={user.full_name}
                          title={user.full_name}
                          className="w-9 h-9 rounded-full border-2 border-white shadow"
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <p className="text-gray-400 text-sm">Loading...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-black" onClick={() => setShowEditModal(false)}>
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Edit Shift</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Shift Name"
                className="w-full border p-2 rounded"
              />
              <input
                type="time"
                name="start_time"
                value={editForm.start_time}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="time"
                name="end_time"
                value={editForm.end_time}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                name="start_date"
                value={editForm.start_date}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                name="end_date"
                value={editForm.end_date}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftList;
