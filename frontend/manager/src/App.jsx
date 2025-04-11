import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import TrafficAccount from "./pages/dashboard/TrafficAccount";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerWelcome from "./pages/ManagerWelcome";
import RequestActivation from "./pages/RequestActivation";

import 'leaflet/dist/leaflet.css';



// Helper component to protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("manager_token");
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Auth Pages */}
      <Route path="/auth/*" element={<Auth />} />

      {/* Public Pages */}
      <Route path="/create-account" element={<TrafficAccount />} />
      <Route path="/" element={<ManagerLogin />} />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
<Route path="/welcome" element={<ManagerWelcome />} />
<Route path="/request-activation" element={<RequestActivation />} />


      
    </Routes>
  );
}

export default App;



