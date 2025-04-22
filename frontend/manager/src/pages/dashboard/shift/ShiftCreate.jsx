import React, { useState } from "react";
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
      alert("Shift created successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Create Shift</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {["name", "start_time", "end_time", "start_date", "end_date"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block mb-1 capitalize">{field.replace("_", " ")}</label>
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
        className={`w-full py-2 text-white rounded-xl ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Saving..." : "Create Shift"}
      </button>
    </div>
  );
};

export default ShiftCreate;
