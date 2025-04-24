import { useEffect, useState } from 'react';
import api from '@/api';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pencil, Trash2, PlusCircle, List,  Grid } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const CheckpointsList = () => {
  const [checkpoints, setCheckpoints] = useState([]);
  console.log(checkpoints);
  const managerId = localStorage.getItem("manager_id");


  useEffect(() => {
    const fetchCheckpoints = async () => {
      try {
        const response = await api.get(`/checkpoints?manager_id=${managerId}`);
        const data = Array.isArray(response.data) ? response.data : response.data.data;

        const enriched = data.map((checkpoint) => ({
          ...checkpoint,
          isExpanded: false,
          assignedPolice: [
            { id: 1, name: 'Officer Abdi', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: 2, name: 'Officer Hana', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { id: 3, name: 'Officer Meron', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
          ],
        }));

        setCheckpoints(enriched);
      } catch (error) {
        console.error('Error fetching checkpoints:', error);
        setCheckpoints([]);
      }
    };

    fetchCheckpoints();
  }, []);

  const handleToggleView = (id) => {
    setCheckpoints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
      )
    );
  };

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
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📍 Registered Checkpoints</h2>
        <Link
          to="/dashboard/cheackpoint-create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Create Checkpoint
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {checkpoints.map((checkpoint) => (
          <div key={checkpoint.id} className="bg-white shadow-md rounded-xl p-4 space-y-3 border border-gray-200 hover:shadow-lg transition">
            {/* Header */}
            <div className="flex justify-between items-center">
  <div className="text-xl font-semibold text-blue-700">{checkpoint.name}</div>
  <div className="flex gap-2">
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

              
            {/* Map */}
            <div className="h-48 rounded overflow-hidden border border-gray-300">
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

            {/* Description */}
            {checkpoint.description && (
              <p className="text-gray-600 text-sm">{checkpoint.description}</p>
            )}
            
            

            {/* Assigned Police Section */}
            <div className="mt-4 space-y-2">
  {/* Title and Toggle Icon aligned side by side */}
  <div className="flex justify-between items-center">
    <h4 className="text-sm font-semibold text-gray-700">Assigned to this place:</h4>
    <button
      onClick={() => handleToggleView(checkpoint.id)}
      className="text-gray-500 hover:text-blue-600 transition"
    >
      {checkpoint.isExpanded ? <Grid size={20} /> : <List size={20} />}
    </button>
  </div>

  {/* List View */}
  {checkpoint.isExpanded ? (
    <ul className="space-y-2">
      {checkpoint.assignedPolice.map((officer) => (
        <li key={officer.id} className="flex items-center gap-3">
          <img src={officer.avatar} className="w-8 h-8 rounded-full" alt={officer.name} />
          <span className="text-gray-800 text-sm">{officer.name}</span>
        </li>
      ))}
    </ul>
  ) : (
    // Grid (avatar only) View
    <div className="flex gap-2 overflow-x-auto">
      {checkpoint.assignedPolice.map((officer) => (
        <div key={officer.id} className="relative group">
          <img
            src={officer.avatar}
            className="w-8 h-8 rounded-full border border-gray-300"
            alt={officer.name}
          />
          <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10">
            {officer.name}
          </div>
        </div>
      ))}
    </div>
  )}
</div>


           
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckpointsList;
