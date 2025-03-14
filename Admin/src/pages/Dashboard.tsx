import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-[50%] p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-green-600">
          Dashboard
        </h1>
        <p className="text-xl text-center mt-4">
          Welcome, {user?.username || "User"}!
        </p>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 text-white p-3 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
