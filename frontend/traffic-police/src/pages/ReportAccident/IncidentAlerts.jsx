import React, { useEffect, useState } from 'react';
import {
  BellAlertIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import api from '/src/api'; // your Axios instance

const IncidentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [seenIds, setSeenIds] = useState([]);

  useEffect(() => {
    api
      .get('/accidents')
      .then((res) => {
        const formatted = res.data.map((item) => ({
          id: item.id,
          lat: item.location_lat,
          lng: item.location_lng,
          time: item.time_of_accident,
          plate: item.vehicle_plate_number,
          description: item.description,
        }));
        setAlerts(formatted);
      })
      .catch((err) => console.error('Failed to fetch accidents:', err));
  }, []);

  const handleMarkAsSeen = (id) => {
    setSeenIds((prev) => [...prev, id]);
    // Optional: send update to server that it's been seen
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BellAlertIcon className="w-8 h-8 text-red-500" />
          Incident Alerts
        </h1>
        <p className="text-gray-500 mt-1">
          Live traffic-related incident notifications for officers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert) => {
          const seen = seenIds.includes(alert.id);

          return (
            <div
              key={alert.id}
              className={`relative bg-white border-l-4 ${
                seen ? 'border-green-500' : 'border-red-400'
              } shadow-lg rounded-xl p-5 transition hover:shadow-xl`}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-red-400" />
                {`Lat: ${Number(alert.lat).toFixed(4)}, Lng: ${Number(
                  alert.lng,
                ).toFixed(4)}`}
              </h2>
              {alert.plate && (
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Plate:</strong> {alert.plate}
                </p>
              )}
              <p className="text-gray-600 mb-3">{alert.description}</p>

              <div className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                <ClockIcon className="w-4 h-4" />
                {new Date(alert.time).toLocaleString()}
              </div>

              <div className="mt-2 text-right">
                {seen ? (
                  <span className="inline-flex items-center text-sm text-green-600 font-medium">
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    Marked as Seen
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkAsSeen(alert.id)}
                    className="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm px-4 py-1.5 rounded-md shadow transition"
                  >
                    Mark as Seen
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidentAlerts;
