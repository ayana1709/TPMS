import React, { useState } from "react";
import Calendar from "react-multi-date-picker";
// import "react-multi-date-picker/styles.css";
import { CalendarDays } from "lucide-react";

const fakeOfficers = [
  { id: 1, name: "Officer Abebe" },
  { id: 2, name: "Officer Biniam" },
  { id: 3, name: "Officer Chaltu" },
  { id: 4, name: "Officer Dereje" },
];

const shifts = ["Morning", "Afternoon", "Night"];
const locations = ["Checkpoint A", "Checkpoint B", "Checkpoint C"];

export default function AssignShiftForm() {
  const [selectedOfficers, setSelectedOfficers] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleOfficerToggle = (id) => {
    setSelectedOfficers((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    alert(JSON.stringify({
      officers: selectedOfficers,
      dates: selectedDates.map(date => date.format("YYYY-MM-DD")),
      shift: selectedShift,
      location: selectedLocation
    }, null, 2));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Panel */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Officers</h2>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {fakeOfficers.map((officer) => (
            <label key={officer.id} className="flex items-center gap-3 text-gray-700">
              <input
                type="checkbox"
                checked={selectedOfficers.includes(officer.id)}
                onChange={() => handleOfficerToggle(officer.id)}
                className="form-checkbox accent-blue-600"
              />
              {officer.name}
            </label>
          ))}
        </div>
        <div className="mb-6">
    <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-lg">
      <CalendarDays className="text-blue-600" />
      Select Dates
    </div>

    <div className="flex gap-6">
      {/* Calendar fixed on left */}
   =<Calendar
  multiple
  value={selectedDates}
  onChange={setSelectedDates}
  format="YYYY-MM-DD"
  calendarPosition="static"
  onlyCalendar
  className="border border-gray-200 rounded-xl"
/>


      {/* Selected Dates on right of calendar */}
      <div className="flex-1">
        <h3 className="text-gray-700 font-medium mb-2">Selected Dates</h3>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          {selectedDates.length > 0 ? (
            selectedDates.map((date, index) => (
              <li key={index}>{date.format("YYYY-MM-DD")}</li>
            ))
          ) : (
            <li className="italic text-gray-400">No dates selected</li>
          )}
        </ul>
      </div>
    </div>
  </div>
      </div>

      {/* Right Panel */}
     {/* Right Panel */}
<div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
  

  <div className="space-y-4">
    <div>
      <label className="text-gray-700 font-medium block mb-1">Select Shift</label>
      <select
        value={selectedShift}
        onChange={(e) => setSelectedShift(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Shift --</option>
        {shifts.map((shift) => (
          <option key={shift} value={shift}>
            {shift}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-gray-700 font-medium block mb-1">Select Location</label>
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Location --</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="mt-6">
    <button
      onClick={handleAssign}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
    >
      Assign Shift
    </button>
  </div>
</div>

    </div>
  );
}
