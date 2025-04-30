import React, { useState, useEffect } from "react";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import api from "api";

const DriverRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedWoreda, setSelectedWoreda] = useState("");

  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    region: "",
    zone: "",
    woreda: "",
    password: "",
    confirmPassword: "",
    driverLicense: null,
    licenseNumber: "",

    carPlateNumber: "",
    vin: "",
    carModel: "",
    ChasisNumber: "",
    carOwnership: null,
    carBollo: null,
  });
  // handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    if (!formData.driverLicense) {
      Swal.fire("Error", "Driver License is required!", "error");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      // Driver fields
      data.append("fullName", formData.fullName);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("email", formData.email);
      data.append("region", formData.region);
      data.append("zone", formData.zone);
      data.append("wereda", formData.wereda);
      data.append("password", formData.password);
      data.append("driverLicense", formData.driverLicense);
      data.append("licenseNumber", formData.licenseNumber);

      // Car fields
      data.append("carPlateNumber", formData.carPlateNumber);
      if (formData.vin) data.append("vin", formData.vin);
      if (formData.carModel) data.append("carModel", formData.carModel);
      if (formData.ChasisNumber)
        data.append("ChasisNumber", formData.ChasisNumber);
      if (formData.carOwnership)
        data.append("carOwnership", formData.carOwnership);
      if (formData.carBollo) data.append("carBollo", formData.carBollo);

      const response = await api.post("/register-driver", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      // Show success popup
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Driver and Car registered successfully!",
        confirmButtonText: "Go to Dashboard",
      }).then(() => {
        // Navigate and clear form
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          region: "",
          zone: "",
          wereda: "",
          password: "",
          confirmPassword: "",
          driverLicense: null,
          licenseNumber: "",
          carPlateNumber: "",
          vin: "",
          carModel: "",
          ChasisNumber: "",
          carOwnership: null,
          carBollo: null,
        });

        navigate("/dashboard"); // Replace with your actual dashboard route
      });
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        let errorMessages = Object.values(errors).flat().join("<br>");
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: errorMessages,
        });
      } else {
        Swal.fire(
          "Error",
          "Something went wrong during registration!",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch regions
  useEffect(() => {
    api
      .get("/fetch-regions")
      .then((response) => setRegions(response.data))
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  // Fetch zones when region changes
  useEffect(() => {
    if (selectedRegion) {
      api
        .get(`/fetch-zones/${selectedRegion}`)
        .then((response) => setZones(response.data))
        .catch((error) => console.error("Error fetching zones:", error));
    } else {
      setZones([]);
      setWoredas([]);
    }
  }, [selectedRegion]);

  // Fetch woredas when zone changes
  useEffect(() => {
    if (selectedZone) {
      api
        .get(`/fetch-woredas/${selectedZone}`)
        .then((response) => setWoredas(response.data))
        .catch((error) => console.error("Error fetching woredas:", error));
    } else {
      setWoredas([]);
    }
  }, [selectedZone]);

  // Handle region select
  const handleRegionChange = (value) => {
    const selectedRegionObj = regions.find(
      (region) => region.osm_id.toString() === value
    );
    setSelectedRegion(value);

    setFormData((prev) => ({
      ...prev,
      region: selectedRegionObj ? selectedRegionObj.name : "",
      zone: "",
      woreda: "",
    }));
  };

  // Handle zone select
  const handleZoneChange = (value) => {
    const selectedZoneObj = zones.find(
      (zone) => zone.osm_id.toString() === value
    );
    setSelectedZone(value);

    setFormData((prev) => ({
      ...prev,
      zone: selectedZoneObj ? selectedZoneObj.name : "",
      woreda: "",
    }));
  };

  // Handle woreda select
  const handleWoredaChange = (value) => {
    const selectedWoredaObj = woredas.find(
      (woreda) => woreda.osm_id.toString() === value
    );
    setSelectedWoreda(value);

    setFormData((prev) => ({
      ...prev,
      woreda: selectedWoredaObj ? selectedWoredaObj.name : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen transition-all duration-500`}
    >
      {/* Dark Mode Toggle */}
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
            <Input
              type="text"
              name="licenseNumber"
              placeholder="Driver License Number"
              onChange={handleChange}
            />
            <Upload
              name="driverLicense"
              label="Upload Driver License (Required)"
              onChange={handleChange}
              required
            />

            {/* Grouped Address Fields */}
            <div className="rounded-lg border border-gray-300 p-4 dark:border-gray-700">
              <h4 className="mb-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
                Address
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.osm_id} value={region.osm_id}>
                      {region.name}
                    </option>
                  ))}
                </select>

                {/* Zone Select */}
                <select
                  value={selectedZone}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  disabled={!zones.length}
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.osm_id} value={zone.osm_id}>
                      {zone.name}
                    </option>
                  ))}
                </select>

                {/* Woreda Select */}
                <select
                  value={selectedWoreda}
                  onChange={(e) => handleWoredaChange(e.target.value)}
                  disabled={!woredas.length}
                >
                  <option value="">Select Woreda</option>
                  {woredas.map((woreda) => (
                    <option key={woreda.osm_id} value={woreda.osm_id}>
                      {woreda.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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

          {/* Submit Button */}
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

// Reusable Input component
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

// Reusable Upload component
const Upload = ({ name, label, onChange, required = false }) => (
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
      required={required}
      className="rounded-md border border-gray-400 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800"
    />
  </div>
);

// Password input with show/hide
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

// Select component for Region
const Select = ({
  name,
  placeholder,
  onChange,
  options = [],
  loading,
  required = false,
}) => (
  <div className="flex flex-col">
    <label
      htmlFor={name}
      className="mb-1 text-sm font-bold text-gray-700 dark:text-gray-300"
    >
      {placeholder}
    </label>
    <select
      name={name}
      id={name}
      onChange={onChange}
      required={required}
      className="rounded-md border border-gray-400 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800"
    >
      <option value="">
        {loading ? "Loading..." : `Select ${placeholder}`}
      </option>
      {options.map((region) => (
        <option key={region.id} value={region.name}>
          {region.name}
        </option>
      ))}
    </select>
  </div>
);

export default DriverRegistrationForm;
