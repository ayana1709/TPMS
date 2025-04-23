import api from "@/api";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import api from "@/utils/api"; // adjust based on your actual api import path

export default function AssignShiftForm() {
  const [officers, setOfficers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedOfficers, setSelectedOfficers] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [rangeValue, setRangeValue] = useState([null, null]);
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [mode, setMode] = useState("multiple");

  useEffect(() => {
    const managerId = localStorage.getItem("manager_id");

    const fetchData = async () => {
      try {
        const [officersRes, shiftsRes, locationsRes] = await Promise.all([
          api.get(`/traffic-users?manager_id=${managerId}`),
          api.get(`/shifts?manager_id=${managerId}`),
          api.get(`/checkpoints?manager_id=${managerId}`),
        ]);
        setOfficers(officersRes.data);
        setShifts(shiftsRes.data);
        setLocations(locationsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOfficerToggle = (id) => {
    setSelectedOfficers((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    const formattedDates =
      mode === "range" && rangeValue[0] && rangeValue[1]
        ? [
            rangeValue[0].toISOString().split("T")[0],
            rangeValue[1].toISOString().split("T")[0],
          ]
        : selectedDates.map((d) => d.toISOString().split("T")[0]);

    alert(
      JSON.stringify(
        {
          officers: selectedOfficers,
          dates: formattedDates,
          shift: selectedShift,
          location: selectedLocation,
        },
        null,
        2
      )
    );
  };

  const handleDateClick = (date) => {
    if (mode === "multiple") {
      const exists = selectedDates.some(
        (d) => d.toDateString() === date.toDateString()
      );
      if (exists) {
        setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    if (mode === "multiple") {
      return selectedDates.some((d) => d.toDateString() === date.toDateString())
        ? "bg-indigo-500 text-white rounded-full"
        : "";
    }

    if (mode === "range" && rangeValue[0] && rangeValue[1]) {
      const [start, end] = rangeValue;
      if (date >= start && date <= end) {
        return "bg-indigo-500 text-white rounded-full";
      }
    }

    return "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Left Panel */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Officers</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
          {officers.map((officer) => (
            <label key={officer.id} className="flex items-center gap-3 text-gray-700">
              <input
                type="checkbox"
                checked={selectedOfficers.includes(officer.id)}
                onChange={() => handleOfficerToggle(officer.id)}
                className="form-checkbox text-blue-600 focus:ring-blue-500"
              />
              {officer.full_name}
            </label>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Select Dates</h2>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="multiple"
                checked={mode === "multiple"}
                onChange={() => {
                  setMode("multiple");
                  setRangeValue([null, null]);
                  setSelectedDates([]);
                }}
                className="text-blue-600"
              />
              Multiple
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="range"
                checked={mode === "range"}
                onChange={() => {
                  setMode("range");
                  setSelectedDates([]);
                  setRangeValue([null, null]);
                }}
                className="text-blue-600"
              />
              Range
            </label>
          </div>

          <div className="react-calendar-wrapper border border-gray-300 rounded-lg overflow-hidden">
            <Calendar
              onClickDay={mode === "multiple" ? handleDateClick : undefined}
              onChange={mode === "range" ? setRangeValue : undefined}
              value={mode === "range" ? rangeValue : undefined}
              tileClassName={tileClassName}
              selectRange={mode === "range"}
              className="w-full p-2"
            />
          </div>

          <div className="mt-4 text-sm text-gray-700">
            <h3 className="font-semibold mb-1">Selected {mode === "range" ? "Range" : "Dates"}:</h3>
            <ul className="list-disc list-inside">
              {mode === "multiple" ? (
                selectedDates.length > 0 ? (
                  selectedDates.map((d, i) => (
                    <li key={i}>{d.toDateString()}</li>
                  ))
                ) : (
                  <li className="italic text-gray-600">No dates selected</li>
                )
              ) : rangeValue[0] && rangeValue[1] ? (
                <>
                  <li>From: {rangeValue[0].toDateString()}</li>
                  <li>To: {rangeValue[1].toDateString()}</li>
                </>
              ) : (
                <li className="italic text-gray-400">Select a date range</li>
              )}
            </ul>
          </div>
        </div>
      </div>

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
                <option key={shift.id} value={shift.name}>
                  {shift.name}
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
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-auto">
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
