import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '@/api';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

const LocationRegistrationForm = () => {
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([9.42349, 42.15766]);
  const [radius, setRadius] = useState(100);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');


  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  };

  const [accuracy, setAccuracy] = useState(null);
  const [zoom, setZoom] = useState(15); // Start at zoom 15


  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ Your browser doesn't support geolocation.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
  
        setAccuracy(accuracy); // Store accuracy if needed
  
        // Adjust zoom based on accuracy (or hard set a zoom)
        if (accuracy < 50) {
          setZoom(15); // Very accurate, zoom in a bit
        } else if (accuracy < 500) {
          setZoom(13); // Moderate accuracy, zoom out slightly
        } else {
          setZoom(11); // Low accuracy, zoom out more
        }
  
        setMapCenter([latitude, longitude]);
        setPosition({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("❌ Failed to get your location. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };
  

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position || !name || !radius) {
      return alert('Please fill in all fields and select a location.');
    }
  
    const payload = {
      name,
      latitude: position.lat,
      longitude: position.lng,
      radius,
      description, // ✅ Include it here
    };
    
  
    try {
      const response = await api.post('/checkpoints', payload);
      console.log('✅ Location registered:', response.data);
      alert('✅ Location registered successfully!');
    } catch (error) {
      console.error('❌ Error submitting location:', error);
      alert('❌ Failed to register location.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-6">📍 Register Traffic Checkpoint</h2>

      <div className="flex justify-end mb-4">
      <button
  onClick={fetchUserLocation}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>
  📍 Get My Location
</button>

      </div>

      <div className="h-96 mb-6 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && <RecenterMap lat={position.lat} lng={position.lng} />}
          <LocationSelector />
          {position && (
            <Circle
              center={position}
              radius={radius}
              pathOptions={{ color: 'blue', fillColor: '#3b82f6', fillOpacity: 0.2 }}
            />
          )}
        </MapContainer>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Checkpoint Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Bole Checkpoint"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Radius (meters)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={10}
            required
          />
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-700">Description</label>
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="e.g., Located near the roundabout, heavy traffic in peak hours"
    rows={3}
  ></textarea>
</div>


        <button
          type="submit"
          className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          🚀 Register Location
        </button>
      </form>
    </div>
  );
};

export default LocationRegistrationForm;
