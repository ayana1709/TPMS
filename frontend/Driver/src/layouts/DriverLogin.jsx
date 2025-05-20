import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Adjust path as needed
import Swal from "sweetalert2";

const DriverLogin = () => {
  const [phone_number, setphone_number] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/driver-login", {
        phone_number,
        password,
      });

      localStorage.setItem("driver_id", res.data.id);
      localStorage.setItem("driver_token", res.data.token);

      // ✅ Save license number correctly
      localStorage.setItem("license", res.data.driver_license_number);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("full_name", res.data.full_name);


      if (res.data.status === "active") {
        Swal.fire("Success", "Login successful", "success").then(() => {
          navigate("/admin/default");
        });
      } else {
        Swal.fire("Pending", "Account not yet approved", "info").then(() => {
          navigate("/waiting-approval");
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Login failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-12">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl transition-transform duration-300 hover:scale-[1.02]"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-blue-700">
          Driver Login
        </h2>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            phone Number
          </label>
          <input
            type="tel"
            value={phone_number}
            onChange={(e) => setphone_number(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-2 font-semibold text-white transition-colors ${
            loading
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a className="text-blue-600 hover:underline" href="/register">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default DriverLogin;
