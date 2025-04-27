import React, { useState } from "react";
// import axios from "axios";
import { Sun, Moon, Eye, EyeOff } from "lucide-react"; // using lucide icons
import api from "api";

const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    carPlateNumber: "",
    vin: "",
    carModel: "",
    ChasisNumber: "",
    driverLicense: null,
    carOwnership: null,
    carBollo: null,
  });

  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      const response = await api.post("/api/register-driver", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      alert("Driver registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong during registration!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen transition-all duration-500`}
    >
      {/* Dark Mode Icon Toggle */}
      <div className="flex justify-end p-6">
        <button onClick={() => setDarkMode(!darkMode)} className="text-2xl">
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-800" />
          )}
        </button>
      </div>

      <div className="mx-auto w-full max-w-7xl px-8 py-10">
        <h2 className="mb-12 animate-bounce text-center text-4xl font-extrabold text-blue-700 dark:text-blue-400">
          🚗 Driver Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-in-up grid grid-cols-1 gap-10 md:grid-cols-2"
        >
          {/* Left Side: Driver Info */}
          <section className="space-y-6">
            <h3 className="mb-4 text-2xl font-bold text-blue-700 dark:text-blue-300">
              Driver Information
            </h3>
            <Input
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />
            <Input
              name="address"
              placeholder="Residential Address"
              onChange={handleChange}
            />
            <Input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              onChange={handleChange}
            />

            {/* Password field with toggle */}
            <PasswordInput
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              show={showPassword}
              setShow={setShowPassword}
            />
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
            />

            <Upload
              name="driverLicense"
              label="Upload Driver License"
              onChange={handleChange}
            />
          </section>

          {/* Right Side: Car Info */}
          <section className="space-y-6">
            <h3 className="mb-4 text-2xl font-bold text-blue-700 dark:text-blue-300">
              Car Information
            </h3>
            <Input
              name="carPlateNumber"
              placeholder="Car Plate Number"
              onChange={handleChange}
              required
            />
            <Input
              name="vin"
              placeholder="VIN"
              onChange={handleChange}
              required
            />
            <Input
              name="carModel"
              placeholder="Car Model (e.g., Corolla)"
              onChange={handleChange}
              required
            />
            <Input
              name="ChasisNumber"
              placeholder="Chasis Number"
              onChange={handleChange}
              required
            />
            <Upload
              name="carOwnership"
              label="Upload Car Ownership Document"
              onChange={handleChange}
            />
            <Upload
              name="carBollo"
              label="Upload Car Bollo Document"
              onChange={handleChange}
            />
          </section>

          {/* Submit and Login */}
          <div className="col-span-1 mt-8 space-y-4 text-center md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="text-md rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-10 py-4 font-bold text-white shadow-xl transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Now"}
            </button>

            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Already registered?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Login here
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// General Input
const Input = ({
  type = "text",
  name,
  placeholder,
  onChange,
  required = false,
}) => (
  <div className="flex flex-col">
    <label
      htmlFor={name}
      className="mb-1 text-sm font-bold text-gray-700 dark:text-gray-300"
    >
      {placeholder}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      className="rounded-md border border-gray-400 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
    />
  </div>
);

// Upload Input
const Upload = ({ name, label, onChange }) => (
  <div className="flex flex-col">
    <label
      htmlFor={name}
      className="mb-1 text-sm font-bold text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <input
      type="file"
      name={name}
      id={name}
      accept="image/*,.pdf"
      onChange={onChange}
      className="rounded-md border border-gray-400 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800"
      required
    />
  </div>
);

// Password Input with Eye Toggle
const PasswordInput = ({
  name,
  placeholder,
  onChange,
  required,
  show,
  setShow,
}) => (
  <div className="relative flex flex-col">
    <label
      htmlFor={name}
      className="mb-1 text-sm font-bold text-gray-700 dark:text-gray-300"
    >
      {placeholder}
    </label>
    <input
      type={show ? "text" : "password"}
      name={name}
      id={name}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      className="rounded-md border border-gray-400 bg-gray-100 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800"
    />
    <div
      className="absolute right-3 top-9 cursor-pointer text-gray-500"
      onClick={() => setShow(!show)}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </div>
  </div>
);

export default DriverRegistrationForm;
