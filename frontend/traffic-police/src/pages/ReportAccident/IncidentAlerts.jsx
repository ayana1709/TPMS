import React from 'react';
import {
  BellAlertIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const mockAlerts = [
  {
    id: 1,
    location: 'Addis Ababa, Bole Road',
    time: '2025-05-16 14:25',
    description: 'Multiple car collision reported. Ambulance dispatched.',
  },
  {
    id: 2,
    location: 'Mexico Square Roundabout',
    time: '2025-05-16 13:50',
    description: 'Hit and run reported. Suspect vehicle seen heading north.',
  },
  {
    id: 3,
    location: 'Gullele Bridge',
    time: '2025-05-16 13:20',
    description: 'Two-car accident blocking left lane. No injuries reported.',
  },
];

const IncidentAlerts = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BellAlertIcon className="w-8 h-8 text-red-500" />
          Incident Alerts
        </h1>
        <p className="text-gray-500 mt-1">
          Live traffic-related incident notifications for officers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white shadow-lg rounded-xl p-5 border-l-4 border-red-400 hover:shadow-xl transition"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-red-400" />
              {alert.location}
            </h2>
            <p className="text-gray-600 mb-3">{alert.description}</p>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              {alert.time}
            </div>
            <div className="mt-4 text-right">
              <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md shadow">
                Mark as Seen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentAlerts;
