import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Pencil, Trash2, List, LayoutGrid } from "lucide-react";
import api from "@/api";

const mockUsers = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3" },
];

const ShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [expandedShiftId, setExpandedShiftId] = useState(null);
  const [userView, setUserView] = useState("avatar"); // avatar | list

  const navigate = useNavigate();

  const fetchShifts = async () => {
    try {
      const res = await api.get("/shifts");
      setShifts(res.data);
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this shift?")) return;
    try {
      await api.delete(`/shifts/${id}`);
      fetchShifts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const toggleView = (id) => {
    setExpandedShiftId((prev) => (prev === id ? null : id));
  };

  const toggleUserView = () => {
    setUserView((prev) => (prev === "avatar" ? "list" : "avatar"));
  };

  useEffect(() => {
    fetchShifts();
  }, []);

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
            <div
              key={shift.id}
              className="bg-white rounded-2xl shadow-md border p-4 transition-all"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{shift.name}</h3>
                <div className="flex gap-2 items-center">
                  {expandedShiftId === shift.id ? (
                    <EyeOff
                      size={18}
                      className="text-blue-600 cursor-pointer hover:scale-110 transition"
                      title="Hide"
                      onClick={() => toggleView(shift.id)}
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-blue-600 cursor-pointer hover:scale-110 transition"
                      title="View"
                      onClick={() => toggleView(shift.id)}
                    />
                  )}
                  <Pencil
                    size={18}
                    className="text-yellow-500 cursor-pointer hover:scale-110 transition"
                    title="Edit"
                    onClick={() => navigate(`/Dashboard/shifts/${shift.id}/edit`)}
                  />
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer hover:scale-110 transition"
                    title="Delete"
                    onClick={() => handleDelete(shift.id)}
                  />
                </div>
              </div>

              {/* Expanded View */}
              {expandedShiftId === shift.id && (
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div>
                    <strong>Start Time:</strong> {shift.start_time}
                  </div>
                  <div>
                    <strong>End Time:</strong> {shift.end_time}
                  </div>
                  <div>
                    <strong>Start Date:</strong> {shift.start_date}
                  </div>
                  <div>
                    <strong>End Date:</strong> {shift.end_date}
                  </div>
                </div>
              )}

              {/* Assigned Users */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Assigned Users
                  </p>
                  <button
                    className="text-gray-500 hover:text-black"
                    onClick={toggleUserView}
                    title="Toggle View"
                  >
                    {userView === "avatar" ? (
                      <List size={18} />
                    ) : (
                      <LayoutGrid size={18} />
                    )}
                  </button>
                </div>

                {userView === "avatar" ? (
                  <div className="flex -space-x-2">
                    {mockUsers.map((user) => (
                      <img
                        key={user.id}
                        src={user.avatar}
                        alt={user.name}
                        title={user.name}
                        className="w-9 h-9 rounded-full border-2 border-white shadow hover:scale-105 transition"
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1 text-sm text-gray-600">
                    {mockUsers.map((user) => (
                      <li key={user.id} className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShiftList;
