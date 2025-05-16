import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const AccidentRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    time: '',
    vehiclesInvolved: '',
    fatalities: '',
    injuries: '',
    description: '',
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          location: `Lat: ${latitude}, Long: ${longitude}`,
        }));
      });
    } else {
      toast.error('GPS not supported');
    }
  };

  const handleSubmit = () => {
    // Replace with actual API call
    toast.success('Accident registered successfully!');
    console.log(formData);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
        Accident Registration
      </h2>

      {/* Steps Indicator */}
      <div className="flex justify-center gap-4 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
              step === s ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Accident Location"
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <button
            onClick={getLocation}
            className="text-sm text-blue-600 underline"
          >
            Use GPS Location
          </button>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <input
            type="text"
            name="vehiclesInvolved"
            value={formData.vehiclesInvolved}
            placeholder="Number of Vehicles Involved"
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="number"
            name="fatalities"
            value={formData.fatalities}
            placeholder="Number of Fatalities"
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="number"
            name="injuries"
            value={formData.injuries}
            placeholder="Number of Injuries"
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:underline"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the accident scene"
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="file"
            name="photos"
            multiple
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="text-gray-600 hover:underline"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccidentRegistration;
