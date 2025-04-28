import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Report Accident",
      description: "Report a traffic accident",
      path: "/report-accident",
      icon: "🚨",
    },
    {
      title: "Submit Complaint",
      description: "File a complaint about traffic issues",
      path: "/submit-complaint",
      icon: "📝",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening in your area
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">{action.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {action.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
