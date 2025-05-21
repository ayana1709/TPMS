import api from '/src/api';
import React, { useState } from 'react';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    message: '',
    attachment: null,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('message', formData.message);
      if (formData.attachment) {
        data.append('attachment', formData.attachment);
      }

      const response = await api('/complaints/manager', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg('Complaint sent successfully!');
        setFormData({ type: '', title: '', message: '', attachment: null });
      } else {
        setErrorMsg(result.message || 'Something went wrong.');
      }
    } catch (error) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Send Complaint or Request to Manager
      </h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select type</option>
            <option value="complaint">Complaint</option>
            <option value="request">Request</option>
          </select>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter a short title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            rows="5"
            placeholder="Describe the issue or request in detail..."
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachment (optional)
          </label>
          <input
            type="file"
            name="attachment"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className={`px-6 py-2 text-white rounded-md shadow transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send to Manager'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;
