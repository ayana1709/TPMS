import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import DriverRegistrationForm from "layouts/DriverRegistrationForm";
import WaitingApproval from "layouts/WaitingApproval";
import DriverLogin from "layouts/DriverLogin";
const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}

      <Route path="/" element={<DriverRegistrationForm />} />
      {/* <Route path="/" element={<DriverRegistrationForm />} /> */}
      <Route path="/login" element={<DriverLogin />} />

      <Route path="/waiting-Approval" element={<WaitingApproval />} />
    </Routes>
  );
};

export default App;
