import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./auth/Login";
import Register from "./auth/Register";

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "report" or "complaint"
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleActionClick = (type) => {
    if (!isAuthenticated) {
      setActionType(type);
      setShowLoginModal(true);
    } else {
      // Navigate to respective pages when authenticated
      if (type === "report") {
        navigate("/report-accident");
      } else if (type === "complaint") {
        navigate("/submit-complaint");
      }
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (actionType === "report") {
      navigate("/report-accident");
    } else if (actionType === "complaint") {
      navigate("/submit-complaint");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/logo.png" alt="TPMS Logo" className="h-12 w-auto" />
              <h1 className="ml-4 text-2xl font-bold text-white">
                Traffic Police Penalty Management System
              </h1>
            </div>
            {!isAuthenticated ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* View Information Section */}
            <div className="bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">
                View Information
              </h2>
              <p className="text-slate-300 mb-6">
                Access traffic violation records, penalty information, and more.
              </p>
              <Link
                to="/information"
                className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Information
              </Link>
            </div>

            {/* Report Accident Section */}
            <div className="bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">
                Report Accident
              </h2>
              <p className="text-slate-300 mb-6">
                Report traffic accidents and incidents to the authorities.
              </p>
              <button
                onClick={() => handleActionClick("report")}
                className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Report Accident
              </button>
            </div>

            {/* Give Complaint Section */}
            <div className="bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">
                Give Complaint
              </h2>
              <p className="text-slate-300 mb-6">
                Submit complaints or feedback about traffic-related issues.
              </p>
              <button
                onClick={() => handleActionClick("complaint")}
                className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Give Complaint
              </button>
            </div>
          </div>
        </main>

        {/* Modals */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Login</h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <Login onSuccess={handleLoginSuccess} />
              <p className="mt-4 text-center text-slate-400">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Register</h2>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <Register
                onSuccess={() => {
                  setShowRegisterModal(false);
                  setShowLoginModal(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
