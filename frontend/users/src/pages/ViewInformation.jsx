import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Polyline,
  Tooltip,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Route, Clock, Car, TrainFront, Plane } from "lucide-react";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ORS_API_KEY = "5b3ce3597851110001cf6248829ce8b1f9734d89a03552cecf63bf37";

const LocationMarker = ({ onSetDestination }) => {
  useMapEvents({
    click(e) {
      onSetDestination(e.latlng);
    },
  });
  return null;
};

// 🔁 Component to center map on user location
const SetMapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);
  return null;
};

const ViewInformation = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fares, setFares] = useState({ car: null, train: null, plane: null });
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // 🌍 Get user location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLatLng = { lat: latitude, lng: longitude };
        setStart(userLatLng);
        getLocationInfo(latitude, longitude).then(setStartLocation);
      },
      (err) => {
        alert("Failed to get your location. Please allow location access.");
        console.error(err);
      },
      { enableHighAccuracy: true } // 👈 This helps!
    );
  }, []);

  const getLocationInfo = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lat=${lat}&point.lon=${lng}`
      );
      const data = response.data;
      if (data.features && data.features.length > 0) {
        const properties = data.features[0].properties;
        const city =
          properties.locality || properties.county || properties.region;
        const country = properties.country;
        return `${city}, ${country}`;
      }
      return "Location not found";
    } catch (error) {
      console.error("Error fetching location information:", error);
      return "Error fetching location";
    }
  };

  const getRoute = async () => {
    if (!start || !end) return;
    setIsFetching(true);
    setRouteCoords([]);
    setDistance(null);
    setDuration(null);
    setFares({ car: null, train: null, plane: null });
    setEndLocation(null);

    try {
      const [endLoc, routeRes] = await Promise.all([
        getLocationInfo(end.lat, end.lng),
        axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            coordinates: [
              [start.lng, start.lat],
              [end.lng, end.lat],
            ],
          },
          {
            headers: {
              Authorization: ORS_API_KEY,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      setEndLocation(endLoc);

      const data = routeRes.data;
      if (!data.features || !data.features.length) {
        throw new Error("No route features returned from API.");
      }

      const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
      const { distance: dist, duration: dur } =
        data.features[0].properties.summary;

      const distKm = (dist / 1000).toFixed(2);
      const timeMin = Math.ceil(dur / 60);

      setRouteCoords(coords);
      setDistance(distKm);
      setDuration(timeMin);

      setFares({
        car: (distKm * 2).toFixed(2),
        train: (distKm * 1.2).toFixed(2),
        plane: (distKm * 6).toFixed(2),
      });
    } catch (err) {
      console.error("Failed to fetch route:", err);
      alert("Failed to fetch route or location.");
    } finally {
      setIsFetching(false);
    }
  };

  const resetPoints = () => {
    setEnd(null);
    setRouteCoords([]);
    setDistance(null);
    setDuration(null);
    setFares({ car: null, train: null, plane: null });
    setEndLocation(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-950">
      <div className="relative w-[98%] h-[95%] rounded-md">
        <div className="absolute w-[90%] h-[80%] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <MapContainer
            center={[9.03, 38.74]}
            zoom={6}
            scrollWheelZoom
            className="w-full h-[90%] rounded-t-md"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            />

            {/* 🔁 Move map to user location once it's available */}
            {start && <SetMapCenter position={[start.lat, start.lng]} />}

            {/* 🎯 Allow user to click to set destination */}
            <LocationMarker onSetDestination={setEnd} />

            {/* 🏁 Start Marker */}
            {start && (
              <Marker position={[start.lat, start.lng]}>
                {startLocation && (
                  <Tooltip direction="top" offset={[0, -10]} permanent>
                    Start: {startLocation}
                  </Tooltip>
                )}
              </Marker>
            )}

            {/* 🛬 End Marker */}
            {end && (
              <Marker position={[end.lat, end.lng]}>
                {endLocation && (
                  <Tooltip direction="top" offset={[0, -10]} permanent>
                    End: {endLocation}
                  </Tooltip>
                )}
              </Marker>
            )}

            {/* 🚗 Route Line */}
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} color="blue" />
            )}
          </MapContainer>

          {/* 📊 Info Panel */}
          <div style={{ padding: "1rem", background: "#f4f4f4" }}>
            <div className="flex items-center gap-4">
              <button
                onClick={getRoute}
                disabled={!start || !end || isFetching}
                className="bg-gray-950 text-gray-100"
              >
                {isFetching ? "Calculating..." : "Calculate Route & Tariff"}
              </button>
              <button
                onClick={resetPoints}
                className="bg-gray-950 text-gray-100"
              >
                Reset
              </button>
            </div>

            {startLocation && (
              <div style={{ marginTop: "0.5rem" }}>
                <strong>Start Location:</strong> {startLocation}
              </div>
            )}
            {endLocation && (
              <div style={{ marginTop: "0.5rem" }}>
                <strong>End Location:</strong> {endLocation}
              </div>
            )}

            {distance && duration && (
              <div className="absolute top-1/2 -translate-y-[60%] right-10 z-[999] bg-gray-800 w-1/4 p-10 rounded-lg text-white flex flex-col gap-6 border border-white">
                <p className="flex items-center gap-2">
                  <Route className="w-5 h-5" />
                  <strong>Distance:</strong> {distance} km
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <strong>Duration:</strong> {duration} minutes
                </p>
                <p className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  <strong>Car Tariff:</strong> {fares.car} birr
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInformation;
