import React from 'react';

const mockNotices = [
  {
    title: 'New Speed Limit in City Center',
    content:
      'Effective immediately, the maximum speed limit in the city center is now 30 km/h.',
    type: 'alert',
  },
  {
    title: 'Eid Holiday Traffic Diversion Plan',
    content:
      'Some roads will be closed or rerouted during Eid celebrations. Follow official signage.',
    type: 'info',
  },
  {
    title: 'Seatbelt Awareness Campaign',
    content:
      'Always wear your seatbelt. Failure to comply results in a fine of 500 birr.',
    type: 'campaign',
  },
  {
    title: 'Online Fine Payment Now Available',
    content:
      'Drivers can now pay traffic fines through the mobile app or via the government website.',
    type: 'update',
  },
];

const badgeColors = {
  alert: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  campaign: 'bg-yellow-100 text-yellow-700',
  update: 'bg-green-100 text-green-700',
};

const TrafficInfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          🚦 Traffic Public Information Board
        </h1>

        {mockNotices.map((notice, idx) => (
          <div
            key={idx}
            className={`p-4 rounded shadow border ${
              badgeColors[notice.type]
            } transition hover:scale-[1.01]`}
          >
            <h2 className="text-lg font-semibold">{notice.title}</h2>
            <p className="mt-1">{notice.content}</p>
          </div>
        ))}

        <div className="text-center pt-10 text-sm text-gray-500">
          Updated regularly by the Traffic Police Department. For questions,
          visit your nearest office.
        </div>
      </div>
    </div>
  );
};

export default TrafficInfoPage;
