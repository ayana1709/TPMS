import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../lib/schemas";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Check } from "lucide-react";

export default function Login({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Convert to snake_case for backend
      const submitData = {
        phone_number: data.phoneNumber,
        password: data.password,
      };
      console.log(submitData);
      const result = await login(submitData);
      if (result.success) {
        toast.success("Login successful!");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      toast.error(error, "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-slate-900/90 backdrop-blur-lg p-6 rounded-xl border border-slate-800"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-slate-200"
          >
            Phone Number
          </label>
          <input
            {...register("phoneNumber")}
            id="phoneNumber"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
              errors.phoneNumber ? "border-red-500" : "border-slate-700"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-400 mt-1">
              {errors.phoneNumber.message}
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
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className={`mt-1 block w-full rounded-lg border px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm bg-slate-800/70 text-white placeholder-slate-400 ${
              errors.password ? "border-red-500" : "border-slate-700"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-5 h-5 flex items-center justify-center rounded border border-slate-700 bg-slate-800 peer-checked:bg-indigo-600 transition-colors duration-150">
              <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
            </div>
            <span className="ml-2 text-sm text-gray-200">Remember me</span>
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>
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
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
