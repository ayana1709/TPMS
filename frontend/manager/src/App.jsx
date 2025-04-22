import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import TrafficAccount from "./pages/dashboard/TrafficAccount";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerWelcome from "./pages/ManagerWelcome";
import 'leaflet/dist/leaflet.css';
import ManagerWaiting from "./pages/ManagerWaiting";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";
import Loading from "./pages/components/Loading";
import ShiftCreate from "./pages/dashboard/shift/ShiftCreate";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("manager_token");
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const checkManager = async () => {
      if (!token) {
        setIsAllowed(false);
        return;
      }

      try {
        const response = await api.get("/managers/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "Active") {
          setIsAllowed(true); // ✅ can access dashboard
        } else {
          window.location.href = "/welcome"; // ❌ send to welcome if not active
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsAllowed(false); // ❌ no access
      }
    };

    checkManager();
  }, [token]);

  if (isAllowed === null) {
    return <div> <Loading/></div>; // ⏳ loading state
  }

  return isAllowed ? children : <Navigate to="/" replace />;
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
      <Route path="/" element={<ManagerLogin />} /> 
      <Route path="/create-account" element={<TrafficAccount />} />
      <Route path="/welcome" element={<ManagerWelcome />} />
      <Route path="/manager/waiting" element={<ManagerWaiting />} />
      {/* <Route path="/shifts/create" element={<ShiftCreate />} /> */}


       {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
      
    </Routes>
  );
}

export default App;



