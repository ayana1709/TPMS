import React, { useState } from 'react';

const DriverEnforcementForm = () => {
  const [form, setForm] = useState({
    driverName: '',
    plateNumber: '',
    actionType: '',
    reason: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Enforcement:', form);
    // Integrate API or state logic here
    alert('Enforcement issued successfully!');
    setForm({
      driverName: '',
      plateNumber: '',
      actionType: '',
      reason: '',
      message: '',
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Issue Driver Enforcement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Driver Name
            </label>
            <input
              type="text"
              name="driverName"
              value={form.driverName}
              onChange={handleChange}
              placeholder="e.g. Ali Musa"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Plate Number
            </label>
            <input
              type="text"
              name="plateNumber"
              value={form.plateNumber}
              onChange={handleChange}
              placeholder="e.g. AB 1234"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Action Type
          </label>
          <select
            name="actionType"
            value={form.actionType}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">-- Select Action --</option>
            <option value="fine">Fine</option>
            <option value="warning">Warning</option>
            <option value="info">Information</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason / Offense
          </label>
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="e.g. Over speeding, illegal parking"
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Message (optional)
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Write any specific instruction or info..."
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit Enforcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverEnforcementForm;
