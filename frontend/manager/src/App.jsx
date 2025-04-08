import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import TrafficAccount from "./pages/dashboard/TrafficAccount";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      {/* <Route path="/create-account" element={<TrafficAccount/>} /> */}


    </Routes>
  );
}

export default App;
