import React from 'react';

// Example notification data (replace with API data)
const notifications = [
  {
    id: 1,
    title: 'Accident reported on Bole Road',
    type: 'alert',
    created_at: '2025-05-15T08:30:00',
  },
  {
    id: 2,
    title: 'Speed limit enforcement started in Addis Ababa',
    type: 'info',
    created_at: '2025-05-14T10:00:00',
  },
  {
    id: 3,
    title: 'Traffic awareness campaign this weekend',
    type: 'campaign',
    created_at: '2025-05-12T09:00:00',
  },
];

const typeColor = {
  alert: 'bg-red-500',
  info: 'bg-blue-500',
  campaign: 'bg-green-500',
  update: 'bg-yellow-500',
};

const NotificationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">🔔 Traffic Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold">{notification.title}</h2>
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full ${
                    typeColor[notification.type] || 'bg-gray-400'
                  }`}
                >
                  {notification.type}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
