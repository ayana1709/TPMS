import React, { useEffect, useState } from "react";
import api from "@/api"; // Adjust the path as needed
import { XMarkIcon } from "@heroicons/react/24/solid";

const initialFormState = {
  name: "",
  start_time: "",
  end_time: "",
  start_date: "",
  end_date: "",
};

const ShiftManager = () => {
  const [shifts, setShifts] = useState([]);
  const [modalType, setModalType] = useState(null); // 'create' | 'edit' | 'view'
  const [selectedShift, setSelectedShift] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShifts = async () => {
    try {
      const res = await api.get("/shifts");
      setShifts(res.data);
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const openModal = (type, shift = null) => {
    setModalType(type);
    setSelectedShift(shift);
    setForm(
      shift || initialFormState
    );
    setError(null);
  };

  const closeModal = () => {
    setModalType(null);
    setForm(initialFormState);
    setSelectedShift(null);
    setError(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatFormData = () => ({
    ...form,
    start_time: form.start_time.length === 5 ? `${form.start_time}:00` : form.start_time,
    end_time: form.end_time.length === 5 ? `${form.end_time}:00` : form.end_time,
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const formattedData = formatFormData();

    try {
      if (modalType === "create") {
        await api.post("/shifts", formattedData);
      } else {
        await api.put(`/shifts/${selectedShift.id}`, formattedData);
      }
      closeModal();
      fetchShifts();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this shift?")) return;
    try {
      await api.delete(`/shifts/${id}`);
      fetchShifts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shift Management</h2>
        <button
          onClick={() => openModal("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Create Shift
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Start Time</th>
              <th className="px-4 py-3">End Time</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.length > 0 ? shifts.map((shift) => (
              <tr key={shift.id} className="border-b">
                <td className="px-4 py-2">{shift.name}</td>
                <td className="px-4 py-2">{shift.start_time}</td>
                <td className="px-4 py-2">{shift.end_time}</td>
                <td className="px-4 py-2">{shift.start_date}</td>
                <td className="px-4 py-2">{shift.end_date}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openModal("view", shift)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openModal("edit", shift)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(shift.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No shifts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4 capitalize">
              {modalType} Shift
            </h3>

            {modalType === "view" ? (
              <div className="space-y-2 text-sm">
                {Object.entries(selectedShift).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium capitalize">{key.replace("_", " ")}:</span>{" "}
                    {value}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-2 rounded-xl">
                    {error}
                  </div>
                )}
                {["name", "start_time", "end_time", "start_date", "end_date"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm capitalize">{field.replace("_", " ")}</label>
                    <input
                      name={field}
                      type={
                        field.includes("time") ? "time" :
                        field.includes("date") ? "date" : "text"
                      }
                      className="w-full border px-3 py-2 rounded-xl"
                      value={form[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-2 rounded-xl text-white ${
                    modalType === "create"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {loading
                    ? "Saving..."
                    : modalType === "create"
                    ? "Create Shift"
                    : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManager;
