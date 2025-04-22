import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "@/api";
import { useNavigate } from "react-router-dom";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ManagerMap = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for dark mode preference
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Create a MutationObserver to watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Function to geocode a woreda name to coordinates
  const geocodeWoreda = async (woreda) => {
    try {
      // Add Ethiopia to the search query for better results
      const searchQuery = `${woreda}, Ethiopia`;
      console.log(`Geocoding: ${searchQuery}`);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=et&limit=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Geocoding result for ${woreda}:`, data);

      if (data && data.length > 0) {
        const coordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        console.log(`Found coordinates for ${woreda}:`, coordinates);
        return coordinates;
      }
      console.log(`No coordinates found for ${woreda}`);
      return null;
    } catch (error) {
      console.error(`Error geocoding ${woreda}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAndProcessManagers = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch managers with woredas using axios with the token
        const response = await api.get("/managers/weredas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status !== "success") {
          throw new Error(response.data.message || "Failed to fetch managers");
        }

        const managersData = response.data.managers;
        console.log("Total managers fetched:", managersData.length);

        // Get unique woredas
        const uniqueWoredas = [
          ...new Set(managersData.map((manager) => manager.woreda)),
        ];
        console.log("Unique woredas:", uniqueWoredas);

        // Create a mapping of woreda names to coordinates and managers
        const woredaData = {};
        for (const woreda of uniqueWoredas) {
          if (woreda) {
            console.log(`Processing woreda: ${woreda}`);
            const coordinates = await geocodeWoreda(woreda);
            if (coordinates) {
              // Get all managers for this woreda
              const woredaManagers = managersData.filter(
                (m) => m.woreda === woreda
              );
              woredaData[woreda] = {
                coordinates,
                managers: woredaManagers,
              };
            }
          }
        }
        console.log("Woreda data:", woredaData);

        setManagers(woredaData);
      } catch (error) {
        console.error("Error processing managers:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setError(
            error.response?.data?.message || "Failed to load manager locations"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessManagers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="col-span-full bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-center h-64 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 p-4">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Manager Locations
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Showing managers across {Object.keys(managers).length} locations
        </p>
      </header>
      <div className="h-[500px]">
        <MapContainer
          center={[9.005401, 38.763611]} // Center on Addis Ababa
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          {isDarkMode ? (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          )}
          {Object.entries(managers).map(([woreda, data]) => (
            <Marker key={woreda} position={data.coordinates}>
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent={false}
                className="!bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-700 !text-gray-900 dark:!text-white"
              >
                <div className="font-medium">
                  {woreda}
                  <br />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {data.managers.length === 1
                      ? data.managers[0].name
                      : `${data.managers.length} managers`}
                  </span>
                </div>
              </Tooltip>
              <Popup className="!bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-700">
                <div className="max-h-96 overflow-y-auto">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:!text-white">
                    {woreda}
                  </h3>
                  <div className="space-y-3">
                    {data.managers.map((manager) => (
                      <div
                        key={manager.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0"
                      >
                        <p className="font-medium text-gray-900 dark:!text-white">
                          {manager.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {manager.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {manager.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ManagerMap;
