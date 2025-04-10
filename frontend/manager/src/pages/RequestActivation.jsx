import React, { useEffect, useState } from "react";
import axios from "axios";

const RequestActivation = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleRequest = async () => {
    try {
      const token = localStorage.getItem("manager_token");

      const response = await axios.post(
        "/api/request-activation",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setSent(true);
      } else {
        setError(response.data.message || "Failed to request activation");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error sending request");
    }
  };

  useEffect(() => {
    handleRequest();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold">
          Account Activation Required
        </h2>
        {sent ? (
          <p className="text-green-600">
            Activation request sent. Please wait for admin approval.
          </p>
        ) : (
          <p className="text-gray-600">Sending request to admin...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default RequestActivation;
