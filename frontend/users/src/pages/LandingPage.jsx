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
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/tpms-logo.png"
                  alt="TPMS Logo"
                  className="h-16 w-auto md:h-20"
                />
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  to="/information"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  View Information
                </Link>
                <button
                  onClick={() => handleActionClick("report")}
                  className="px-4 py-2 text-sm font-semibold text-slate-800 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  Report Accident
                </button>
                <button
                  onClick={() => handleActionClick("complaint")}
                  className="px-4 py-2 text-sm font-semibold text-slate-800 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  Give Complaint
                </button>
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
              </nav>

              {/* Mobile menu button */}
              <button className="md:hidden text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mt-12 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Making Roads Safer Together
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join us in creating a safer community by reporting accidents,
              submitting complaints, and staying informed about traffic
              regulations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleActionClick("report")}
                className="px-8 py-3 text-lg font-semibold text-white bg-indigo-950 rounded-lg hover:bg-indigo-900 transition-colors duration-300"
              >
                Report Accident
              </button>
              <button
                onClick={() => handleActionClick("complaint")}
                className="px-8 py-3 text-lg font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-slate-800">
              <div className="text-indigo-400 mb-4">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                View Information
              </h3>
              <p className="text-slate-300">
                Access traffic violation records, penalty information, and stay
                updated with the latest traffic regulations.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-slate-800">
              <div className="text-indigo-400 mb-4">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Report Accident
              </h3>
              <p className="text-slate-300">
                Quickly report traffic accidents and incidents to help
                authorities respond promptly and maintain road safety.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-slate-800">
              <div className="text-indigo-400 mb-4">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Give Complaint
              </h3>
              <p className="text-slate-300">
                Submit complaints or feedback about traffic-related issues to
                help improve road conditions and safety measures.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Traffic Police Penalty Management
            System. All rights reserved.
          </p>
        </footer>

        {/* Modals */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Login</h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-white bg-gray-900 hover:text-red-500 transition-all duration-300"
                >
                  <span className="text-2xl"> ✕</span>
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
                  className="ml-4 px-10 bg-slate-800 text-indigo-400 hover:text-indigo-300"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}

        {showRegisterModal && (
          <div className="fixed w-full inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-slate-800 w-1/2 h-[90%] my-auto mx-4">
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
