// WaitingApproval.jsx
import api from "api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// your Axios instance

const WaitingApproval = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get("/check-status"); // e.g., /api/check-status
        const { status } = response.data;

        if (status === "Active") {
          clearInterval(interval);
          Swal.fire(
            "Approved!",
            "You can now access the dashboard.",
            "success"
          ).then(() => {
            navigate("/dashboard");
          });
        }
      } catch (error) {
        console.error("Error checking status", error);
      }
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-yellow-100">
      <h1 className="mb-4 text-3xl font-bold">Waiting for Approval</h1>
      <p className="text-gray-700">
        Please wait while we verify your account. This may take a few minutes.
      </p>
      {checking && (
        <p className="mt-4 animate-pulse text-sm text-gray-500">
          Checking status...
        </p>
      )}
    </div>
  );
};

export default WaitingApproval;
