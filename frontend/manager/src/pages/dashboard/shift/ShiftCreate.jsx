import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "@/api";

const initialFormState = {
  name: "",
  start_time: "",
  end_time: "",
  start_date: "",
  end_date: "",
};

const ShiftCreate = () => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    try {
      const data = formatFormData();
      await api.post("/shifts", data);
      setForm(initialFormState);

      // ✅ Sweet Alert Success
      Swal.fire({
        title: "✅ Shift Created!",
        text: "Shift has been successfully registered.",
        icon: "success",
        confirmButtonColor: "#2563EB",
        confirmButtonText: "Go to Shift Management",
      }).then(() => {
        navigate("/dashboard/shift-management");
      });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">🕒 Create New Shift</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 border border-red-300">
          {error}
        </div>
      )}

      {["name", "start_time", "end_time", "start_date", "end_date"].map((field) => (
        <div key={field} className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
            {field.replace("_", " ")}
          </label>
          <input
            name={field}
            type={
              field.includes("time") ? "time" :
              field.includes("date") ? "date" : "text"
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={form[field] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition duration-300 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "✅ Create Shift"}
      </button>
    </div>
  );
};

export default ShiftCreate;
