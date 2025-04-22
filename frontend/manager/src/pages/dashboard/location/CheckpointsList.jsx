import { useEffect, useState } from 'react';
import api from '@/api';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // If using React Router

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const CheckpointsList = () => {
  const [checkpoints, setCheckpoints] = useState([]);

  useEffect(() => {
    const fetchCheckpoints = async () => {
      try {
        const response = await api.get('/checkpoints');
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setCheckpoints(data);
      } catch (error) {
        console.error('Error fetching checkpoints:', error);
        setCheckpoints([]); // fallback to empty array
      }
    };
  
    fetchCheckpoints();
  }, []);
  

 

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this checkpoint?')) {
      try {
        await api.delete(`/checkpoints/${id}`);
        setCheckpoints((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        console.error('Failed to delete checkpoint:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📍 Registered Checkpoints</h2>
        <Link
          to="/create-checkpoint"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Create Checkpoint
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {checkpoints.map((checkpoint) => (
          <div key={checkpoint.id} className="bg-white shadow-md rounded-xl p-4 space-y-3 border border-gray-200">
            <div className="text-xl font-semibold text-blue-700">{checkpoint.name}</div>

            <div className="h-48 rounded overflow-hidden">
              <MapContainer
                center={[checkpoint.latitude, checkpoint.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[checkpoint.latitude, checkpoint.longitude]} />
                <Circle
                  center={[checkpoint.latitude, checkpoint.longitude]}
                  radius={checkpoint.radius}
                  pathOptions={{ color: 'blue', fillColor: '#60a5fa', fillOpacity: 0.3 }}
                />
              </MapContainer>
            </div>

            {checkpoint.description && (
              <p className="text-gray-600 text-sm">{checkpoint.description}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => alert('Edit functionality coming soon!')}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(checkpoint.id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckpointsList;
