import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import ReportAccident from "./pages/dashboard/ReportAccident";
import SubmitComplaint from "./pages/dashboard/SubmitComplaint";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-accident"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ReportAccident />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/submit-complaint"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SubmitComplaint />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: "#4aed88",
                  },
                },
                error: {
                  duration: 4000,
                  theme: {
                    primary: "#ff4b4b",
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
