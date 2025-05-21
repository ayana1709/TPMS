// Tables.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import Header from "../components/Header";
import axios from "axios";
import api from "api";
// Fix Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Tables = () => {
  const [startCoords, setStartCoords] = useState(null);
  const [startAddress, setStartAddress] = useState("");
  const [destCoords, setDestCoords] = useState(null);
  const [destAddress, setDestAddress] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    datetime: "",
    description: "",
    plateNumber: "",
    contactInfo: "",
    files: [],
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  console.log(formData);

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setStartCoords(coords);
        fetchAddress(coords, setStartAddress);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  // Fetch address from coordinates using Nominatim API
  const fetchAddress = async (coords, setAddress) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await response.json();
      setAddress(data.display_name || "Address not found");
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address not found");
    }
  };

  // Handle map clicks to set destination
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const coords = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setDestCoords(coords);
        fetchAddress(coords, setDestAddress);
      },
    });
    return null;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, files: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setLoading(true);

    if (!startCoords || !destCoords) {
      alert("Please ensure both starting and destination points are set.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("type", formData.type);
    formDataToSend.append("datetime", formData.datetime);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("plateNumber", formData.plateNumber);
    formDataToSend.append("contactInfo", formData.contactInfo);

    // Append coordinates as JSON strings
    formDataToSend.append("startCoords", JSON.stringify(startCoords));
    formDataToSend.append("destCoords", JSON.stringify(destCoords));

    // Append files
    if (formData.files && formData.files.length > 0) {
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files[]", formData.files[i]);
      }
    }

    try {
      const response = await api.post(
        "/driver-complaints", // ✅ Change to your actual endpoint
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMsg("Complaint submitted successfully.");
      console.log("Complaint submitted successfully:", response.data);

      // Reset form fields after successful submission
      setFormData({
        type: "",
        datetime: "",
        description: "",
        plateNumber: "",
        contactInfo: "",
        files: [],
      });
      setDestCoords(null);
      setDestAddress("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setSuccessMsg(
        "There was an error submitting your complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      {/* <Header /> */}
      <div className="bg-gray-950 flex h-screen flex-col p-4 px-8 md:flex-row">
        {/* Map Section */}
        <div className="h-1/2 rounded-md md:h-full md:w-1/2">
          {startCoords ? (
            <MapContainer
              center={startCoords}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="rounded-md"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler />
              <Marker position={startCoords}>
                <Popup>Starting Point</Popup>
              </Marker>
              {destCoords && (
                <Marker position={destCoords}>
                  <Popup>Destination Point</Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <p className="mt-4 text-center">Fetching your location...</p>
          )}
        </div>

        {/* Form Section */}
        <div className="overflow-y-auto rounded-md bg-gray-900 p-6 md:w-1/2">
          <div className="rounded-md border border-gray-300 p-2 px-4">
            <h2 className="mb-4 text-2xl font-bold text-gray-200">
              Traffic Complaint Form
            </h2>
            {/* Success/Error Message */}
            {successMsg && (
              <div
                className={`mb-4 rounded p-3 text-center font-semibold ${
                  successMsg.includes("successfully")
                    ? "bg-green-700 text-white"
                    : "bg-red-700 text-white"
                }`}
              >
                {successMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Complaint Type */}
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-200">
                  Complaint Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-500 bg-gray-600 p-2"
                >
                  <option value="">Select</option>
                  {/* Road Issues */}
                  <option>
                    Poor road conditions (potholes, unpaved roads)
                  </option>
                  <option>Lack of proper road signage and lane markings</option>
                  <option>
                    Inadequate drainage systems (flooding during rain)
                  </option>
                  {/* Traffic Management */}
                  <option>
                    Heavy traffic congestion, especially in cities
                  </option>
                  <option>Poor traffic light coordination</option>
                  <option>
                    Weak or inconsistent enforcement of traffic laws
                  </option>
                  {/* Fuel and Resources */}
                  <option>Unfair distribution of fuel</option>
                  <option>Long fuel queues at gas stations</option>
                  <option>Frequent fuel shortages and rationing</option>
                  {/* Economic & Policy Issues */}
                  <option>Unfair or fluctuating transport tariffs</option>
                  <option>High taxes on vehicles and spare parts</option>
                  <option>Expensive vehicle import duties</option>
                  {/* Public Transport Problems */}
                  <option>Overcrowding of taxis and buses</option>
                  <option>Competition from unlicensed/illegal operators</option>
                  <option>Poor condition of public transport vehicles</option>
                  {/* Vehicle Maintenance Challenges */}
                  <option>Scarcity of spare parts</option>
                  <option>High cost or poor quality of spare parts</option>
                  <option>Unqualified or inexperienced mechanics</option>
                  {/* Administrative Issues */}
                  <option>
                    Slow vehicle licensing and registration process
                  </option>
                  <option>Excessive paperwork and bureaucracy</option>
                  <option>
                    Lack of clear guidelines for transport operations
                  </option>
                  {/* Modernization Gaps */}
                  <option>
                    Lack of online services for registration, licensing, etc.
                  </option>
                  <option>No modern traffic monitoring systems</option>
                  <option>Poor GPS or navigation infrastructure</option>
                </select>
              </div>

              {/* Starting Location */}
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-200">
                  Starting Location *
                </label>
                <input
                  type="text"
                  value={startAddress}
                  readOnly
                  className="w-full rounded border border-gray-500 bg-gray-600 p-2"
                />
              </div>

              {/* Destination Location */}
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-200">
                  Destination Location *
                </label>
                <input
                  type="text"
                  value={destAddress}
                  readOnly
                  className="borderborder-gray-500 w-full rounded bg-gray-600 p-2"
                />
              </div>

              {/* Date and Time */}
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-200">
                  Date and Time *
                </label>
                <input
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-500 bg-gray-600 p-2"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-200">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-500 bg-gray-600 p-2"
                ></textarea>
              </div>

              {/* Upload Files */}
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-200">
                  Upload Files (Optional)
                </label>
                <input
                  type="file"
                  name="files"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf"
                  multiple
                  className="w-full border-gray-500 bg-gray-600"
                />
              </div>

              {/* Vehicle Plate Number */}
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-200">
                  Vehicle Plate Number (Optional)
                </label>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-500 bg-gray-600 p-2"
                />
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <label className="mb-1 block font-medium text-gray-200">
                  Contact Info (Optional)
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-500 bg-gray-600 p-2"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-950 flex items-center rounded px-4 py-2 text-white hover:bg-blue-900"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Complaint"
                  )}
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setFormData({
                      type: "",
                      datetime: "",
                      description: "",
                      plateNumber: "",
                      contactInfo: "",
                      files: [],
                    });
                    setDestCoords(null);
                    setDestAddress("");
                    setSuccessMsg("");
                  }}
                  className="text-black rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                  disabled={loading}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tables;
