import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CheckpointTable() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [form, setForm] = useState({ name: '', latitude: '', longitude: '', radius: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCheckpoints = async () => {
    const response = await axios.get('/api/checkpoints');
    setCheckpoints(response.data.data);
  };

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/checkpoints/${editingId}`, form);
    } else {
      await axios.post('/api/checkpoints', form);
    }
    setForm({ name: '', latitude: '', longitude: '', radius: '' });
    setEditingId(null);
    fetchCheckpoints();
  };

  const handleEdit = (checkpoint) => {
    setForm(checkpoint);
    setEditingId(checkpoint.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/checkpoints/${id}`);
    fetchCheckpoints();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Checkpoints</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border rounded px-2 py-1" />
          <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" className="border rounded px-2 py-1" />
          <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" className="border rounded px-2 py-1" />
          <input name="radius" value={form.radius} onChange={handleChange} placeholder="Radius" className="border rounded px-2 py-1" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Latitude</th>
            <th className="border border-gray-300 px-4 py-2">Longitude</th>
            <th className="border border-gray-300 px-4 py-2">Radius</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {checkpoints.map((cp) => (
            <tr key={cp.id}>
              <td className="border border-gray-300 px-4 py-2">{cp.id}</td>
              <td className="border border-gray-300 px-4 py-2">{cp.name}</td>
              <td className="border border-gray-300 px-4 py-2">{cp.latitude}</td>
              <td className="border border-gray-300 px-4 py-2">{cp.longitude}</td>
              <td className="border border-gray-300 px-4 py-2">{cp.radius}</td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2">
                <button onClick={() => handleEdit(cp)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(cp.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
