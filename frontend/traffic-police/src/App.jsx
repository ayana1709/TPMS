import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Fine from './pages/Fine';
import PenaltyChecking from './pages/PenaltyChecking';
import WorkAssignment from './pages/WorkAssignment';
import Order from './pages/Order';
import Complain from './pages/Complain';
import ReportAccident from './pages/ReportAccident';
import RegisterAccident from './pages/RegisterAccident';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import TrafficLaws from './pages/TrafficLaws';
import Layout from './components/Layout';
import TrafficWelcome from './pages/Authentication/TrafficWelcome';
import PendingActivation from './pages/Authentication/PendingActivation';
import ComplaintForm from './pages/Complain/ComplaintForm';
import UserComplaintsTable from './pages/Complain/UserComplaintsTable';
import DriverComplaintsTable from './pages/Complain/DriverComplaintsTable';
import ManagerDirectivesPage from './pages/Order/ManagerDirectivesPage';
import DriverEnforcementForm from './pages/Order/DriverEnforcementForm';
import IncidentAlerts from './pages/ReportAccident/IncidentAlerts';
import AccidentRegistration from './pages/RegisterAccident/AccidentRegistration';
import AccidentList from './pages/RegisterAccident/AccidentList';
import TrafficInfoPage from './pages/TrafficInfoPage';
import PostTrafficInfoForm from './pages/PostTrafficInfoForm';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/signin" />;
};

function App() {
  return (
    <AuthProvider>
      {/* <Toaster position="top-right" /> */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="traffic-welcome" element={<TrafficWelcome />} />
        <Route path="pending-activation" element={<PendingActivation />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="fine" element={<Fine />} />
          <Route path="penalty-checking" element={<PenaltyChecking />} />
          <Route path="work-assignment" element={<WorkAssignment />} />

          {/* <Route path="complain-to-manager" element={<ComplaintForm />} /> */}
          <Route path="user-complain" element={<UserComplaintsTable />} />
          <Route path="driver-complain" element={<DriverComplaintsTable />} />

          <Route
            path="manager-directives"
            element={<ManagerDirectivesPage />}
          />
          <Route path="order-to-driver" element={<DriverEnforcementForm />} />
          <Route path="incident-alerts" element={<IncidentAlerts />} />
          <Route path="register-accident" element={<AccidentRegistration />} />
          <Route path="list-of Accident" element={<AccidentList />} />
          {/* <Route path="post-info" element={<PostTrafficInfoForm />} /> */}
          {/* <Route path="notification" element={<NotificationsPage />} /> */}
          <Route path="traffic-laws" element={<TrafficLaws />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        {/* Catch all route */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
