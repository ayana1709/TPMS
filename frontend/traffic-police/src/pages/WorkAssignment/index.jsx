import React, { useEffect, useState, useRef } from 'react';
import api from '../../api';
import { useAuth } from '/src/context/AuthContext';
import { Clock, MapPin, CalendarDays } from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const RoutingMachine = ({ from, to, onDistanceCalculated }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to || !map) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      lineOptions: {
        styles: [{ color: 'blue', weight: 4 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: function (i, waypoint, n) {
        const markerOptions = {
          icon: L.icon({
            iconUrl:
              i === 0
                ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        };
        return L.marker(waypoint.latLng, markerOptions);
      },
    })
      .addTo(map)
      .on('routesfound', function (e) {
        const route = e.routes[0];
        const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
        onDistanceCalculated(distanceKm);
      });

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (err) {
        console.warn('Routing control cleanup issue:', err);
      }
    };
  }, [from, to, map, onDistanceCalculated]);

  return null;
};

const WorkAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { id: userId } = user || {};
  const token = localStorage.getItem('token');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);

  const fetchAssignmentsById = async (id) => {
    try {
      const response = await api.get('/assignments/by-user', {
        params: { user_id: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignments(response.data.data);
    } catch (err) {
      setError('Failed to load assignments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAssignmentsById(userId);
    }
  }, [userId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  const AssignmentCard = ({ assignment }) => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [remainingDistance, setRemainingDistance] = useState(null);

    const checkpoint = assignment?.checkpoint;
    const shift = assignment?.shift;
    const lat = parseFloat(checkpoint?.latitude);
    const lng = parseFloat(checkpoint?.longitude);
    const radius = parseFloat(checkpoint?.radius) || 50;
    const [alarmTriggered, setAlarmTriggered] = useState(false);
    const [showAlarmMessage, setShowAlarmMessage] = useState(false);

    const alarmAudioRef = useRef(null);

    useEffect(() => {
      const checkTimeAndPlayAlarm = () => {
        const now = new Date();
        const shiftStartTime = new Date(
          `${assignment.assigned_date}T${shift.start_time}`,
        );

        // Compare only hours and minutes
        if (
          now.getHours() === shiftStartTime.getHours() &&
          now.getMinutes() === shiftStartTime.getMinutes()
        ) {
          setShowAlarmMessage(true);
          if (alarmAudioRef.current) {
            alarmAudioRef.current.play().catch((err) => {
              console.warn('Audio play was prevented:', err);
            });
          }
        }
      };

      const interval = setInterval(checkTimeAndPlayAlarm, 5000); // Check every 10s

      return () => clearInterval(interval);
    }, [assignment, shift]);
    useEffect(() => {
      const unlockAudio = () => {
        if (alarmAudioRef.current) {
          alarmAudioRef.current
            .play()
            .then(() => {
              alarmAudioRef.current.pause(); // preload it silently
              alarmAudioRef.current.currentTime = 0;
            })
            .catch((err) => {
              console.warn('Autoplay unlock failed:', err);
            });
        }

        document.removeEventListener('click', unlockAudio);
      };

      document.addEventListener('click', unlockAudio);

      return () => {
        document.removeEventListener('click', unlockAudio);
      };
    }, []);

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        {/* ...existing shift, date, and location info... */}
        <audio ref={alarmAudioRef} src="/alarm.mp3" preload="auto" />
        <div className="p-5 space-y-3">
          {showAlarmMessage && (
            <div className="text-red-600 font-semibold text-center p-2">
              ⏰ Time to go to work!
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-700">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <span>
              <strong>Date:</strong> {assignment.assigned_date}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-green-500" />
            <span>
              <strong>Shift:</strong> {shift?.name} ({shift?.start_time} -{' '}
              {shift?.end_time})
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-rose-500" />
            <span>
              <strong>Location:</strong> {checkpoint?.name} -{' '}
              {checkpoint?.location}
            </span>
          </div>
        </div>

        {lat && lng && (
          <div className="h-60 relative">
            <MapContainer
              center={[lat, lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Circle
                center={[lat, lng]}
                radius={radius}
                pathOptions={{ color: 'blue' }}
              />
              {currentPosition && activeAssignment && (
                <RoutingMachine
                  from={currentPosition}
                  to={[activeAssignment.lat, activeAssignment.lng]}
                  onDistanceCalculated={setRemainingDistance}
                />
              )}
            </MapContainer>
            {remainingDistance && (
              <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-md px-3 py-1 text-sm shadow-md">
                🚗 Remaining: <strong>{remainingDistance} km</strong>
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              // Stop the alarm sound
              if (alarmAudioRef.current) {
                alarmAudioRef.current.pause();
                alarmAudioRef.current.currentTime = 0;
              }

              // Hide the alarm message
              setShowAlarmMessage(false);

              // Location check
              if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser.');
                return;
              }

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const coords = [
                    position.coords.latitude,
                    position.coords.longitude,
                  ];
                  setCurrentPosition(coords);
                  setActiveAssignment({
                    lat: lat,
                    lng: lng,
                  });
                },
                (error) => {
                  let message = '';
                  switch (error.code) {
                    case error.PERMISSION_DENIED:
                      message =
                        '❌ Location permission was denied. Please allow access from your browser settings.';
                      break;
                    case error.POSITION_UNAVAILABLE:
                      message =
                        '📡 Your location is currently unavailable. Check GPS or internet.';
                      break;
                    case error.TIMEOUT:
                      message = '⏱️ Location request timed out. Try again.';
                      break;
                    default:
                      message =
                        '⚠️ Unknown error occurred while getting location.';
                      break;
                  }
                  alert(message);
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0,
                },
              );
            }}
          >
            Go to Work
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
        📋 My Assigned Shifts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assignments.map((assignment, index) => (
          <AssignmentCard key={index} assignment={assignment} />
        ))}
      </div>
    </div>
  );
};

export default WorkAssignment;
