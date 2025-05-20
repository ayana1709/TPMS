import { createContext, useContext, useState, useEffect } from "react";
import api from "../api"; // <-- import the api instance

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user info using the token
  const fetchUser = async (token) => {
    try {
      const response = await api.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      const response = await api.post("/api/public-users/login", data);
      console.log(response);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return { success: true, ...response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post("/api/public-users/register", data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return { success: true, ...response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch (error) {
      console.log(error);
      // ignore error
    }
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
