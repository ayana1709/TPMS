import React, { useEffect, useState } from "react";
import api from "@/api";
import {
  ChevronDown,
  ChevronRight,
  LayoutList,
  Rows,
  TableProperties,
} from "lucide-react";

export default function ShiftAssignmentTable() {
  const [groupedAssignments, setGroupedAssignments] = useState({});
  const [openOfficer, setOpenOfficer] = useState(null);
  const [view, setView] = useState("timeline");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/shift-assignments");

        const grouped = {};
        response.data.forEach((assignment) => {
          const officer = assignment.traffic_user?.full_name || "Unknown Officer";
          if (!grouped[officer]) grouped[officer] = [];
          grouped[officer].push(assignment);
        });

        setGroupedAssignments(grouped);
      } catch (error) {
        console.error("Error fetching shift assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  const toggleOfficer = (officer) => {
    setOpenOfficer(openOfficer === officer ? null : officer);
  };

  const getLastAssignedDate = (assignments) =>
    [...assignments]
      .sort((a, b) => new Date(b.assigned_date) - new Date(a.assigned_date))[0]
      ?.assigned_date || "N/A";

  const renderTimelineView = () => (
    <div className="space-y-4">
      {Object.entries(groupedAssignments).map(([officer, assignments]) => (
        <div key={officer} className="border border-gray-200 rounded-lg shadow-sm">
          <div
            className="flex justify-between items-center px-5 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleOfficer(officer)}
          >
            <div className="font-semibold text-gray-800">{officer}</div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total: {assignments.length}</span>
              <span>Last: {getLastAssignedDate(assignments)}</span>
              {openOfficer === officer ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
          {openOfficer === officer && (
            <div className="px-6 py-4 bg-white">
              {Object.entries(
                assignments.reduce((acc, cur) => {
                  const date = cur.assigned_date;
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(cur);
                  return acc;
                }, {})
              )
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, shifts]) => (
                  <div key={date} className="mb-4">
                    <div className="font-medium text-blue-600 mb-1">
                      📅 {new Date(date).toLocaleDateString()}
                    </div>
                    <ul className="pl-5 list-disc text-sm text-gray-700">
                      {shifts.map((s, i) => (
                        <li key={i}>
                          <span className="font-medium">{s.shift?.name || "Unknown"}</span>{" "}
                          at <span className="italic">{s.checkpoint?.name || "N/A"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderAccordionView = () => (
    <div className="space-y-3">
      {Object.entries(groupedAssignments).map(([officer, assignments]) => (
        <div key={officer} className="border rounded">
          <button
            onClick={() => toggleOfficer(officer)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
          >
            {officer}
            {openOfficer === officer ? <ChevronDown /> : <ChevronRight />}
          </button>
          {openOfficer === officer && (
            <div className="p-4 bg-white">
              {assignments.map((s, i) => (
                <div key={i} className="mb-2 text-sm">
                  📅 {s.assigned_date}:{" "}
                  <strong>{s.shift?.name || "Unknown"}</strong> @{" "}
                  <em>{s.checkpoint?.name || "N/A"}</em>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left text-gray-600 font-medium">
          <tr>
            <th className="px-4 py-2">Officer</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Shift</th>
            <th className="px-4 py-2">Checkpoint</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedAssignments).map(([officer, assignments]) =>
            assignments.map((s, i) => (
              <tr
                key={`${officer}-${i}`}
                className="border-t hover:bg-gray-50 text-gray-700"
              >
                <td className="px-4 py-2">{officer}</td>
                <td className="px-4 py-2">{s.assigned_date}</td>
                <td className="px-4 py-2">{s.shift?.name || "N/A"}</td>
                <td className="px-4 py-2">{s.checkpoint?.name || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">📋 Shift Assignments</h2>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-lg ${
              view === "timeline" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("timeline")}
            title="Timeline View"
          >
            <LayoutList className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-lg ${
              view === "accordion" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("accordion")}
            title="Accordion View"
          >
            <Rows className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-lg ${
              view === "table" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("table")}
            title="Table View"
          >
            <TableProperties className="w-5 h-5" />
          </button>
        </div>
      </div>

      {view === "timeline" && renderTimelineView()}
      {view === "accordion" && renderAccordionView()}
      {view === "table" && renderTableView()}
    </div>
  );
}
