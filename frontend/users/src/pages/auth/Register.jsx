import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../../lib/schemas";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Check } from "lucide-react";

export default function Register({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      // Remove confirmPassword and terms from the data before sending
      const { confirmPassword: _, terms: __, ...submitData } = data;

      const result = await registerUser(submitData);
      if (result.success) {
        toast.success("Registration successful!");
        if (onSuccess) {
          onSuccess();
        }
        navigate("/login", {
          state: { message: "Account created successfully! Please login." },
        });
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-slate-800 rounded-xl">
      <div className="max-w-5xl w-full space-y-8 ">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            Citizen Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-100">
            Create Your Account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-slate-900/95 backdrop-blur-lg p-8 rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 scrollbar-thumb-rounded-lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-200"
                >
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                    errors.firstName ? "border-red-500" : "border-slate-700"
                  }`}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-200"
                >
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                    errors.lastName ? "border-red-500" : "border-slate-700"
                  }`}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-slate-200"
              >
                Phone Number
              </label>
              <input
                {...register("phoneNumber")}
                type="tel"
                className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                  errors.phoneNumber ? "border-red-500" : "border-slate-700"
                }`}
                placeholder="Phone Number"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Email Address (Optional)
              </label>
              <input
                {...register("email")}
                type="email"
                className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                  errors.email ? "border-red-500" : "border-slate-700"
                }`}
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                  errors.password ? "border-red-500" : "border-slate-700"
                }`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-200"
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                  errors.confirmPassword ? "border-red-500" : "border-slate-700"
                }`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="idNumber"
                className="block text-sm font-medium text-slate-200"
              >
                ID Number
              </label>
              <input
                {...register("idNumber")}
                type="text"
                className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                  errors.idNumber ? "border-red-500" : "border-slate-700"
                }`}
                placeholder="ID Number"
              />
              {errors.idNumber && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.idNumber.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-slate-200"
                >
                  City
                </label>
                <input
                  {...register("city")}
                  type="text"
                  className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                    errors.city ? "border-red-500" : "border-slate-700"
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="woreda"
                  className="block text-sm font-medium text-slate-200"
                >
                  Woreda
                </label>
                <input
                  {...register("woreda")}
                  type="text"
                  className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                    errors.woreda ? "border-red-500" : "border-slate-700"
                  }`}
                  placeholder="Woreda"
                />
                {errors.woreda && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.woreda.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="houseNumber"
                  className="block text-sm font-medium text-slate-200"
                >
                  House Number
                </label>
                <input
                  {...register("houseNumber")}
                  type="text"
                  className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
                    errors.houseNumber ? "border-red-500" : "border-slate-700"
                  }`}
                  placeholder="House Number"
                />
                {errors.houseNumber && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.houseNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  {...register("terms")}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-5 h-5 flex items-center justify-center rounded border border-slate-700 bg-slate-800 peer-checked:bg-indigo-600 transition-colors duration-150">
                  <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                </div>
                <span className="ml-2 text-sm text-slate-200">
                  I agree to the Terms & Conditions
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-400 mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-100">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-500 hover:text-indigo-500"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
