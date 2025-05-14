import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '/src/context/AuthContext';
import { Clock, MapPin, CalendarDays } from 'lucide-react';

const WorkAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { id: userId } = user || {};
  const token = localStorage.getItem('token');

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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        📋 My Assigned Shifts
      </h2>

      {assignments.length === 0 ? (
        <p className="text-gray-600 text-center">No assignments found.</p>
      ) : (
        <div className="grid gap-6">
          {assignments.map((assignment, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <span>
                  <strong>Date:</strong> {assignment.assigned_date}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <Clock className="w-5 h-5 text-green-500" />
                <span>
                  <strong>Shift:</strong> {assignment?.shift?.name} (
                  {assignment?.shift?.start_time} -{' '}
                  {assignment?.shift?.end_time})
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-rose-500" />
                <span>
                  <strong>Location:</strong> {assignment?.checkpoint?.name} -{' '}
                  {assignment?.checkpoint?.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkAssignment;
