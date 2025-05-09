import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../api';

const WorkAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('token', token); // adjust if you store differently
      const response = await api.get('/traffic-user/assignments', {
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
    fetchAssignments();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Assigned Shifts</h2>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((assignment, index) => (
            <li key={index} className="p-4 border rounded-lg shadow-sm">
              <div>
                <strong>Date:</strong> {assignment.assigned_date}
              </div>
              <div>
                <strong>Shift:</strong> {assignment.shift?.name} (
                {assignment.shift?.start_time} - {assignment.shift?.end_time})
              </div>
              <div>
                <strong>Location:</strong> {assignment.checkpoint?.name} -{' '}
                {assignment.checkpoint?.location}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkAssignment;
