import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Pencil, Trash2, List, LayoutGrid } from "lucide-react";
import api from "@/api";

const ShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [expandedShiftId, setExpandedShiftId] = useState(null);
  const [assignments, setAssignments] = useState({});
  // const [userView, setUserView] = useState("avatar");
  const [userViews, setUserViews] = useState({});

  const managerId = localStorage.getItem("manager_id");

  const navigate = useNavigate();

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
    console.log("Fetching assigned users with shiftId:", shiftId, "and managerId:", managerId); // 👈
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
    if (!confirm("Are you sure you want to delete this shift?")) return;
    try {
      await api.delete(`/shifts/${id}`);
      fetchShifts();
    } catch (error) {
      console.error("Failed to delete shift:", error);
    }
  };

  const toggleExpandShift = (id) => {
    const newExpandedId = expandedShiftId === id ? null : id;
    setExpandedShiftId(newExpandedId);

  //   if (newExpandedId && !assignments[newExpandedId]) {
  //     fetchAssignedUsers(newExpandedId);
  //   }
};

const toggleUserView = (shiftId) => {
  setUserViews((prev) => ({
    ...prev,
    [shiftId]: prev[shiftId] === "avatar" ? "list" : "avatar",
  }));
};

  // if (newExpandedId && !assignments[newExpandedId]) {
  //   fetchAssignedUsers(newExpandedId);
  // }
  

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
              {/* Shift Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{shift.name}</h3>
                <div className="flex gap-2 items-center">
                  {expandedShiftId === shift.id ? (
                    <EyeOff
                      size={18}
                      className="text-blue-600 cursor-pointer hover:scale-110 transition"
                      title="Hide"
                      onClick={() => toggleExpandShift(shift.id)}
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-blue-600 cursor-pointer hover:scale-110 transition"
                      title="View"
                      onClick={() => toggleExpandShift(shift.id)}
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

              {/* Expanded Shift Info */}
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
                  <p className="text-sm font-semibold text-gray-700">Assigned Users</p>
                  <button
  onClick={() => toggleUserView(shift.id)}
  className="text-gray-500 hover:text-black"
  title="Toggle View"
>
  {userViews[shift.id] === "list" ? <LayoutGrid size={18} /> : <List size={18} />}
</button>

                </div>

                {assignments[shift.id] ? (
  assignments[shift.id].length === 0 ? (
    <p className="text-gray-400 text-sm">No users assigned.</p>
  ) : userViews[shift.id] === "list" ? (
    <ul className="space-y-1 text-sm text-gray-600">
      {assignments[shift.id].map((user) => (
        <li key={user.id} className="flex items-center gap-2">
          <span>{user.full_name}</span>
        </li>
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
          className="w-9 h-9 rounded-full border-2 border-white shadow hover:scale-105 transition"
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
    </div>
  );
};

export default ShiftList;
