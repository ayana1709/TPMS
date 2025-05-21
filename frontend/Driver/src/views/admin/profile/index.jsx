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
import api from "api";
// import axios from "axios";
// import api from "../../api";

// Fix Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ProfileOverview = () => {
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
        "/driver-accident", // <-- This is the correct endpoint
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4 md:flex-row md:p-8">
      {/* Map Section */}
      <div className="mb-8 flex w-full items-center justify-center md:mb-0 md:w-1/2">
        <div className="flex h-[600px] w-full overflow-hidden rounded-md border border-indigo-200 bg-white shadow-lg md:h-[80vh]">
          {accidentCoords ? (
            <MapContainer
              center={accidentCoords}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="flex-1 rounded-md"
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
            <p className="mt-4 w-full text-center text-indigo-700">
              Fetching your location...
            </p>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="mb-8 flex w-full items-center justify-center md:mb-0 md:w-1/2">
        <div className="h-[600px] w-full max-w-lg overflow-y-auto rounded-md border border-gray-300 bg-gray-900/95 p-8 shadow-2xl md:h-[80vh]">
          <div className="mb-6 flex flex-col items-center justify-between sm:flex-row">
            <h2 className="mb-4 text-2xl font-bold text-gray-200 sm:mb-0">
              Report an Accident
            </h2>
          </div>

          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-700/20 px-4 py-3 text-red-200 shadow">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded border border-green-400 bg-green-700/20 px-4 py-3 text-green-200 shadow">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Accident Location */}
            <div>
              <label className="mb-1 block font-medium text-gray-200">
                Accident Location *
              </label>
              <input
                type="text"
                value={accidentAddress}
                readOnly
                className="w-full rounded border border-gray-500 bg-gray-600 p-2 text-gray-100"
                placeholder="Select location on map"
              />
            </div>
            {/* Time of Accident */}
            <div>
              <label className="mb-1 block font-medium text-gray-200">
                Time of Accident *
              </label>
              <input
                type="datetime-local"
                name="timeOfAccident"
                value={formData.timeOfAccident}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-500 bg-gray-600 p-2 text-gray-100"
              />
            </div>
            {/* Vehicle Plate Number */}
            <div>
              <label className="mb-1 block font-medium text-gray-200">
                Vehicle Plate Number(s) (Optional)
              </label>
              <input
                type="text"
                name="vehiclePlateNumber"
                value={formData.vehiclePlateNumber}
                onChange={handleChange}
                className="w-full rounded border border-gray-500 bg-gray-600 p-2 text-gray-100"
              />
            </div>
            {/* Description */}
            <div>
              <label className="mb-1 block font-medium text-gray-200">
                Description of Accident *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full rounded border border-gray-500 bg-gray-600 p-2 text-gray-100"
                placeholder="Describe the accident in detail"
              />
            </div>
            {/* Upload Evidence */}
            <div>
              <label className="mb-1 block font-medium text-gray-200">
                Upload Evidence (Optional)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full border-gray-500 bg-gray-600 text-gray-100 file:mr-4 file:rounded file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-200 hover:file:bg-gray-800"
                accept="image/*,video/*"
              />
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-950 flex w-full items-center justify-center rounded px-4 py-3 text-base font-semibold text-white shadow hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                {isLoading ? (
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
                  "Send Accident Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
