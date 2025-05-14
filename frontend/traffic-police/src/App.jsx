import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
      <Toaster position="top-right" />
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
          <Route path="order" element={<Order />} />
          <Route path="complain" element={<Complain />} />
          <Route path="report-accident" element={<ReportAccident />} />
          <Route path="register-accident" element={<RegisterAccident />} />
          <Route path="traffic-laws" element={<TrafficLaws />} />
        </Route>
        {/* Catch all route */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
