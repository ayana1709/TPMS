import React, { useState } from "react";
import api from "@/api";
import Swal from "sweetalert2";
import {
  LockClosedIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ManagerWelcome = () => {
  const storedUsername = localStorage.getItem("manager_username") || "";
  const storedName = localStorage.getItem("manager_name") || "Manager";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      await api.post("/managers/update-credentials", {
        username: storedUsername,
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      Swal.fire("Success!", "Credentials updated successfully!", "success");
      setUpdated(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update credentials");
    }
  };



  const requestActivation = async () => {
    try {
      const res = await api.post(`/managers/request-activation/${storedUsername}`);
      Swal.fire("Success", res.data.message, "success").then(() => {
        navigate("/manager/waiting"); // <-- go to the waiting page
      });
    } catch (err) {
      console.error("Request activation failed", err);
      Swal.fire("Error", "Failed to request activation", "error");
    }
  };






  
  
  

  return (
    <div className="p-8 max-w-md mx-auto mt-10 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Welcome, {storedName}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your password to secure your account
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 font-semibold">Username</label>
          <input
            type="text"
            value={storedUsername}
            disabled
            className="w-full mt-1 p-2 bg-gray-100 text-gray-600 border rounded-lg cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 font-semibold">Old Password</label>
          <input
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <label className="text-sm text-gray-600 font-semibold">New Password</label>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
          >
            {showNewPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        <div className="relative">
          <label className="text-sm text-gray-600 font-semibold">Confirm New Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          <LockClosedIcon className="w-5 h-5 mr-2" />
          Update Password
        </button>
      </form>

      {updated && (
        <div className="mt-6">
          <button
            onClick={requestActivation}
            className="flex items-center justify-center w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-200 animate-bounce"
          >
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Request Admin to Activate Account
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerWelcome;
