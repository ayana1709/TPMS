// layouts/Auth.jsx
import { Outlet } from "react-router-dom";

export default function Auth() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Outlet />
    </div>
  );
}
