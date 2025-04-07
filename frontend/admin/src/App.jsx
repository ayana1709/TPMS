import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import { StoreProvider } from "./contexts/storeContext";
import Header from "./partials/Header";
import Sidebar from "./partials/Sidebar"; // Ensure this is correctly imported
import CreateManager from "./pages/CreateManager";
import ViewManagers from "./pages/ViewManagers";

function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Outlet will render the nested route (Dashboard, etc.) */}
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Routes>
        {/* Login Page (No Sidebar/Header) */}
        <Route path="/" element={<Login />} />

        {/* Protected Layout for Other Pages */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-account" element={<CreateManager />} />
          <Route path="/view-managers" element={<ViewManagers />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </StoreProvider>
  );
}

export default App;
