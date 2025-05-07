import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts";

import TrafficAccount from "./pages/dashboard/TrafficAccount";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerWelcome from "./pages/ManagerWelcome";
import ManagerWaiting from "./pages/ManagerWaiting";
import CheackerLogin from "./pages/CheackerLogin";
import ShiftCreate from "./pages/dashboard/shift/ShiftCreate";

import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from "react";
import api from "./api";
import Loading from "./pages/components/Loading";
import CheckerDriverTable from "./pages/dashboard/CheckerDriverTable";

// Manager protected route
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
          setIsAllowed(true);
        } else {
          window.location.href = "/welcome";
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsAllowed(false);
      }
    };

    checkManager();
  }, [token]);

  if (isAllowed === null) {
    return <div><Loading /></div>;
  }

  return isAllowed ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* Default Manager Login */}
      <Route path="/" element={<ManagerLogin />} />

      {/* Cheacker Login */}
      <Route path="/cheacker/login" element={<CheackerLogin />} />

      {/* Manager dashboard (protected) */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Other Public Routes */}
      <Route path="/create-account" element={<TrafficAccount />} />
      <Route path="/welcome" element={<ManagerWelcome />} />
      <Route path="/manager/waiting" element={<ManagerWaiting />} />
      <Route path="/cheack-driver" element={<CheckerDriverTable />} />


      {/* Catch-all: redirect all unknown routes to / */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default App;
