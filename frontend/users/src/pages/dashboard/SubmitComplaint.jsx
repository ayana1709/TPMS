// SubmitComplaint.jsx
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

const SubmitComplaint = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
        setError("Could not get your location.");
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
      setAddress(error, "Address not found");
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
    setFormData((prev) => ({ ...prev, files: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!startCoords || !destCoords) {
      setError("Please ensure both starting and destination points are set.");
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("type", formData.type);
    formDataToSend.append("datetime", formData.datetime);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("plateNumber", formData.plateNumber);
    formDataToSend.append("contactInfo", formData.contactInfo);
    formDataToSend.append("startCoords[lat]", startCoords.lat);
    formDataToSend.append("startCoords[lng]", startCoords.lng);
    formDataToSend.append("destCoords[lat]", destCoords.lat);
    formDataToSend.append("destCoords[lng]", destCoords.lng);
    if (formData.files && formData.files.length > 0) {
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files[]", formData.files[i]);
      }
    }

    try {
      const response = await api.post("/api/complaints", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Complaint submitted successfully.");
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
      console.log(error);
      setError(
        error,
        "There was an error submitting your complaint. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4 md:p-8">
      {/* Map Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center mb-8 md:mb-0">
        <div className="w-full h-[600px] md:h-[80vh] rounded-2xl shadow-lg overflow-hidden border border-indigo-100 bg-white flex">
          {startCoords ? (
            <MapContainer
              center={startCoords}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="rounded-2xl flex-1"
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
            <p className="text-center mt-4 text-indigo-700 w-full">
              Fetching your location...
            </p>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center mb-8 md:mb-0">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-2xl p-8 border border-indigo-100 h-[600px] md:h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800 text-center">
            Traffic Complaint Form
          </h2>
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
          <form onSubmit={handleSubmit}>
            {/* Complaint Type */}
            <div className="mb-4">
              <label className="block font-medium mb-1 text-indigo-700">
                Complaint Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-2 border border-indigo-200 rounded bg-indigo-50/60 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Select</option>
                <option>Overcharging or Fare Issues</option>
                <option>Unfair Tariff Pricing</option>
                <option>Overloading</option>
                <option>Driver or Conductor Misconduct</option>
                <option>Unsafe Driving</option>
                <option>Poor Vehicle Condition</option>
                <option>Route Violations</option>
                <option>Delays or Unreliable Service</option>
                <option>Illegal or Unauthorized Operation</option>
              </select>
            </div>
            {/* Starting Location */}
            <div className="mb-4">
              <label className="block font-medium mb-1 text-indigo-700">
                Starting Location *
              </label>
              <input
                type="text"
                value={startAddress}
                readOnly
                className="w-full p-2 border border-indigo-200 rounded bg-indigo-50/60"
              />
            </div>
            {/* Destination Location */}
            <div className="mb-4">
              <label className="block font-medium mb-1 text-indigo-700">
                Destination Location *
              </label>
              <input
                type="text"
                value={destAddress}
                readOnly
                className="w-full p-2 border border-indigo-200 rounded bg-indigo-50/60"
              />
            </div>
            {/* Date and Time */}
            <div className="mb-4 relative">
              <label className="block font-medium mb-1 text-indigo-700">
                Date and Time *
              </label>

              <input
                type="datetime-local"
                name="datetime"
                value={formData.datetime}
                onChange={handleChange}
                required
                className="w-full p-2 pl-10 border border-indigo-200 rounded bg-gray-300 focus:ring-2 focus:ring-indigo-200"
                style={{ WebkitAppearance: "none" }}
              />
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className="block font-medium mb-1 text-indigo-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-2 border border-indigo-200 rounded bg-indigo-50/60"
              ></textarea>
            </div>
            {/* Upload Files */}
            <div className="mb-4">
              <label className="block font-medium mb-1 text-indigo-700">
                Upload Files (Optional)
              </label>
              <input
                type="file"
                name="files"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf"
                className="w-full bg-indigo-50/60 border border-indigo-200 rounded"
              />
            </div>
            {/* Vehicle Plate Number */}
            <div className="mb-4">
              <label className="block font-medium mb-1 text-indigo-700">
                Vehicle Plate Number *
              </label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-indigo-200 rounded bg-indigo-50/60"
              />
            </div>
            {/* Contact Info */}
            <div className="mb-6">
              <label className="block font-medium mb-1 text-indigo-700">
                Contact Info (Optional)
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full p-2 border border-indigo-200 rounded bg-indigo-50/60"
              />
            </div>
            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                {isLoading ? "Submitting..." : "Submit Complaint"}
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
                }}
                className="w-full py-2 bg-gray-200 text-indigo-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
