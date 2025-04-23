import React, { useState, useEffect } from "react";
import api from "@/api";
import { useNavigate } from "react-router-dom";

function DashboardCard14() {
  const [laws, setLaws] = useState([]);
  const [totalLaws, setTotalLaws] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/violations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // The response is a direct array of violations
        setLaws(response.data.slice(0, 5)); // Get first 5 laws
        setTotalLaws(response.data.length);
      } catch (error) {
        console.error("Error fetching laws:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setError(error.response?.data?.message || "Failed to load laws");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, [navigate]);

  if (loading) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            Traffic Laws
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total Laws: {totalLaws}
          </p>
        </div>
        <div className="relative">
          <button
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="sr-only">Menu</span>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
              <circle cx="16" cy="8" r="2" />
              <circle cx="16" cy="16" r="2" />
              <circle cx="16" cy="24" r="2" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="origin-top-right z-10 absolute top-full right-0 min-w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1">
              <button
                className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex items-center py-1 px-3 w-full cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/traffic-laws");
                }}
              >
                <svg
                  className="w-4 h-4 fill-current shrink-0 mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 15v-4H1v4h14zM15 7H1v4h14V7zM15 1H1v4h14V1z" />
                </svg>
                <span>View All</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Code</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Violation Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Fine</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
              {laws.map((law) => (
                <tr key={law.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-slate-800 dark:text-slate-100">
                      {law.code}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left text-slate-800 dark:text-slate-100">
                      {law.violation_name}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-emerald-500">
                      {law.fine_birr} ETB
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard14;
