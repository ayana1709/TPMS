import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LineChart from "../../charts/LineChart01";
import { chartAreaGradient } from "../../charts/ChartjsConfig";
import EditMenu from "../../components/DropdownEditMenu";
import api from "@/api";
import { toast } from "react-hot-toast";

// Import utilities
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";

function DashboardCard02() {
  const [activeManagers, setActiveManagers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        // Fetch active managers count
        const activeResponse = await api.get("/managers/count/active", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActiveManagers(activeResponse.data.active_managers);

        // Fetch historical data for active managers
        const historicalResponse = await api.get(
          "/managers/historical/active",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Historical Data:", historicalResponse.data);
        setHistoricalData(historicalResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch manager data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = historicalData
    ? {
        labels: historicalData.map((item) => item.month),
        datasets: [
          {
            label: "Active Managers",
            data: historicalData.map((item) => item.count),
            fill: true,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              return chartAreaGradient(ctx, chartArea, [
                {
                  stop: 0,
                  color: adjustColorOpacity(
                    getCssVariable("--color-green-500"),
                    0
                  ),
                },
                {
                  stop: 1,
                  color: adjustColorOpacity(
                    getCssVariable("--color-green-500"),
                    0.2
                  ),
                },
              ]);
            },
            borderColor: getCssVariable("--color-green-500"),
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: getCssVariable("--color-green-500"),
            pointHoverBackgroundColor: getCssVariable("--color-green-500"),
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          },
        ],
      }
    : {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Active Managers",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            fill: true,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              return chartAreaGradient(ctx, chartArea, [
                {
                  stop: 0,
                  color: adjustColorOpacity(
                    getCssVariable("--color-green-500"),
                    0
                  ),
                },
                {
                  stop: 1,
                  color: adjustColorOpacity(
                    getCssVariable("--color-green-500"),
                    0.2
                  ),
                },
              ]);
            },
            borderColor: getCssVariable("--color-green-500"),
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: getCssVariable("--color-green-500"),
            pointHoverBackgroundColor: getCssVariable("--color-green-500"),
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          },
        ],
      };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Active Managers
          </h2>
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link
                className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
                to="/view-managers"
              >
                View All
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
                to="/create-account"
              >
                Add New
              </Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Currently Active
        </div>
        <div className="flex items-start">
          {loading ? (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
              <div className="animate-pulse h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
              {activeManagers}
            </div>
          )}
          <div className="text-sm font-medium text-green-600 dark:text-green-400 px-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
            Active
          </div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {loading ? (
          <div className="animate-pulse h-[128px] w-full bg-gray-200 dark:bg-gray-700 rounded-b-xl"></div>
        ) : (
          <div className="relative h-[128px] w-full">
            <LineChart
              data={chartData}
              width={389}
              height={128}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard02;
