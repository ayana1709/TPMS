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
import axios from "axios";
import api from "../../api";

// Fix Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ReportAccident = () => {
  const [accidentCoords, setAccidentCoords] = useState(null);
  const [accidentAddress, setAccidentAddress] = useState("");
  const [formData, setFormData] = useState({
    timeOfAccident: "",
    vehiclePlateNumber: "",
    description: "",
    files: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Get user's current location for initial map center
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setAccidentCoords(coords);
        fetchAddress(coords, setAccidentAddress);
      },
      (error) => {
        setError("Could not get your location.");
        console.error("Error getting location:", error);
      }
    );
    // Set current time as default
    setFormData((prev) => ({
      ...prev,
      timeOfAccident: new Date().toISOString().slice(0, 16),
    }));
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
      setAddress(error, "Address not found");
    }
  };

  // Handle map clicks to set accident location
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const coords = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setAccidentCoords(coords);
        fetchAddress(coords, setAccidentAddress);
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
    setFormData((prev) => ({ ...prev, files: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!accidentCoords) {
      setError("Please select the accident location on the map.");
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("location_lat", accidentCoords.lat);
    formDataToSend.append("location_lng", accidentCoords.lng);
    formDataToSend.append("timeOfAccident", formData.timeOfAccident);
    formDataToSend.append("vehiclePlateNumber", formData.vehiclePlateNumber);
    formDataToSend.append("description", formData.description);
    if (formData.files && formData.files.length > 0) {
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files[]", formData.files[i]);
      }
    }

    try {
      const response = await api.post(
        "/api/accidents", // <-- This is the correct endpoint
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess("Accident reported successfully. Thank you for your help!");
      setFormData({
        timeOfAccident: new Date().toISOString().slice(0, 16),
        vehiclePlateNumber: "",
        description: "",
        files: [],
      });
      // Re-fetch user's current location and set map to it
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setAccidentCoords(coords);
          fetchAddress(coords, setAccidentAddress);
        },
        (error) => {
          setAccidentCoords(null);
          setAccidentAddress("");
        }
      );
      // Reset file input value if needed
      if (document.querySelector('input[type="file"]')) {
        document.querySelector('input[type="file"]').value = "";
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "There was an error submitting your accident report. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4 md:p-8">
      {/* Map Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center mb-8 md:mb-0">
        <div className="w-full h-[600px] md:h-[80vh] rounded-2xl shadow-lg overflow-hidden border border-indigo-100 bg-white flex">
          {accidentCoords ? (
            <MapContainer
              center={accidentCoords}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="rounded-2xl flex-1"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler />
              <Marker position={accidentCoords}>
                <Popup>Accident Location</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p className="text-center mt-4 text-indigo-700 w-full">
              Fetching your location...
            </p>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center mb-8 md:mb-0">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-2xl p-8 border border-indigo-100 h-[600px] md:h-[80vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 sm:mb-0">
              Report an Accident
            </h2>
            <button
              onClick={handleEmergencyCall}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 7a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7"
                />
              </svg>
              Emergency Call
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 shadow">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 shadow">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Accident Location */}
            <div>
              <label className="block text-sm font-semibold text-indigo-700">
                Accident Location *
              </label>
              <input
                type="text"
                value={accidentAddress}
                readOnly
                className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:text-sm"
                placeholder="Select location on map"
              />
            </div>
            {/* Time of Accident */}
            <div>
              <label className="block text-sm font-semibold text-indigo-700">
                Time of Accident *
              </label>
              <input
                type="datetime-local"
                name="timeOfAccident"
                value={formData.timeOfAccident}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:text-sm"
              />
            </div>
            {/* Vehicle Plate Number */}
            <div>
              <label className="block text-sm font-semibold text-indigo-700">
                Vehicle Plate Number(s) (Optional)
              </label>
              <input
                type="text"
                name="vehiclePlateNumber"
                value={formData.vehiclePlateNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:text-sm"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-indigo-700">
                Description of Accident *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:text-sm"
                placeholder="Describe the accident in detail"
              />
            </div>
            {/* Upload Evidence */}
            <div>
              <label className="block text-sm font-semibold text-indigo-700">
                Upload Evidence (Optional)
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-indigo-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                  accept="image/*,video/*"
                />
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition"
              >
                {isLoading ? "Submitting..." : "Send Accident Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportAccident;
