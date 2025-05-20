import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Header() {
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
    <div>
      {" "}
      <header className="py-1 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
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
                className="px-4 py-2 text-sm font-semibold text-slate-800 text-white hover:text-white bg-slate-800 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                Report Accident
              </button>
              <button
                onClick={() => handleActionClick("complaint")}
                className="px-4 py-2 text-sm font-semibold text-slate-800 text-white hover:text-white bg-slate-800 hover:bg-slate-800/50 rounded-lg transition-colors"
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
        <div className="fixed w-full inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-slate-800 w-1/2 my-auto mx-4">
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
  );
}

export default Header;
