// ComplaintForm.jsx
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
import Header from "../components/Header";

// Fix Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ComplaintForm = () => {
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startCoords || !destCoords) {
      alert("Please ensure both starting and destination points are set.");
      return;
    }

    const submissionData = {
      ...formData,
      startCoords,
      destCoords,
    };

    // Send submissionData to your backend here
    console.log("Form submitted:", submissionData);
  };

  return (
    <>
      {" "}
      <Header />
      <div className="flex flex-col md:flex-row h-screen bg-gray-950 p-4 px-8">
        {/* Map Section */}
        <div className="md:w-1/2 h-1/2 md:h-full rounded-md">
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
            <p className="text-center mt-4">Fetching your location...</p>
          )}
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-6 overflow-y-auto bg-gray-900 rounded-md">
          <div className="border border-gray-300 p-2 px-4 rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-200">
              Traffic Complaint Form
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Complaint Type */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-200">
                  Complaint Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-500 rounded bg-gray-600"
                >
                  <option value="">Select</option>
                  <option>Unfair Penalty</option>
                  <option>Officer Misconduct</option>
                  <option>Road Condition</option>
                  <option>Traffic Signage Problem</option>
                  <option>Delay due to Checkpoint</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Starting Location */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-200">
                  Starting Location *
                </label>
                <input
                  type="text"
                  value={startAddress}
                  readOnly
                  className="w-full p-2 border border-gray-500 rounded bg-gray-600"
                />
              </div>

              {/* Destination Location */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-200">
                  Destination Location *
                </label>
                <input
                  type="text"
                  value={destAddress}
                  readOnly
                  className="w-full p-2 borderborder-gray-500 rounded bg-gray-600"
                />
              </div>

              {/* Date and Time */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-200">
                  Date and Time *
                </label>
                <input
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-500 rounded bg-gray-600"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-200">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-500 rounded bg-gray-600"
                ></textarea>
              </div>

              {/* Upload Files */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-200">
                  Upload Files (Optional)
                </label>
                <input
                  type="file"
                  name="files"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf"
                  multiple
                  className="w-full bg-gray-600 border-gray-500"
                />
              </div>

              {/* Vehicle Plate Number */}
              <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-200">
                  Vehicle Plate Number (Optional)
                </label>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-600"
                />
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <label className="block font-medium mb-1 text-gray-200">
                  Contact Info (Optional)
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-500 rounded bg-gray-600"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-900"
                >
                  Submit Complaint
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
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
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

export default ComplaintForm;
