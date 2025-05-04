// import api from "../utils/api"; // Adjust path as needed
import api from "api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const WaitingApproval = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const driverId = localStorage.getItem("driver_id");
  console.log("Driver ID:", driverId);

  useEffect(() => {
    if (!driverId) {
      Swal.fire("Error", "Driver ID not found.", "error");
      setChecking(false);
      return;
    }

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/drivers/${driverId}/status`);
        const { status } = response.data;

        if (status.toLowerCase() === "active") {
          clearInterval(interval);
          setChecking(false);
          if (isMounted) {
            Swal.fire(
              "Approved!",
              "You can now access the dashboard.",
              "success"
            ).then(() => {
              navigate("/admin/*");
            });
          }
        } else if (status.toLowerCase() === "rejected") {
          clearInterval(interval);
          setChecking(false);
          if (isMounted) {
            Swal.fire(
              "Rejected",
              "Your account has been rejected. Please contact support.",
              "error"
            );
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
        clearInterval(interval);
        if (isMounted) {
          setChecking(false);
          Swal.fire("Error", "Failed to check approval status.", "error");
        }
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [driverId, navigate]);

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
