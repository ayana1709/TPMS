import React, { useState, useEffect } from "react";
import api from "api";
import { FaThLarge, FaTable } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

export default function IncomingPenalty() {
  const [penaltyData, setPenaltyData] = useState(null);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const license = localStorage.getItem("license");
  const email = localStorage.getItem("email");
  const full_name = localStorage.getItem("full_name");

  const handlePayment = async (fine) => {
    try {
      const txRef = `TPMS-${Date.now()}`; // Unique transaction reference
      const res = await api.post("/pay", {
        amount: fine.total_fine_amount,
        email: email,
        full_name: full_name,
        license: license,
        fine_id: fine.id,
        tx_ref: txRef,
      });

      window.location.href = res.data.checkout_url;
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert(
        "Payment initialization failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    fetchPenalty();
  }, []);

  const fetchPenalty = async () => {
    try {
      const response = await api.get(`fines/driver/${license}`);
      setPenaltyData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Driver not found or no fines.");
      setPenaltyData(null);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incoming Penalty</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("card")}
            className={`rounded-full p-2 transition hover:bg-blue-100 ${
              viewMode === "card" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaThLarge size={20} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-full p-2 transition hover:bg-blue-100 ${
              viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaTable size={20} />
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {penaltyData && viewMode === "card" && (
        <CardView fines={penaltyData.fines} handlePayment={handlePayment} />
      )}

      {penaltyData && viewMode === "table" && (
        <TableView fines={penaltyData.fines} handlePayment={handlePayment} />
      )}
    </div>
  );
}

function CardView({ fines, handlePayment }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {fines.map((fine) => (
        <div
          key={fine.id}
          className="rounded-xl border bg-white p-4 shadow transition hover:shadow-md"
        >
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>{new Date(fine.date_of_offense).toLocaleDateString()}</span>
            <span>{fine.location}</span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {fine.total_fine_amount} ETB
          </div>
          <div className="text-sm text-gray-600">
            Status:{" "}
            <span className={fine.is_paid ? "text-green-600" : "text-red-600"}>
              {fine.is_paid ? "Paid" : "Unpaid"}
            </span>
          </div>
          <div className="mt-2">
            <p className="font-semibold">Violations:</p>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {fine.violations.map((v) => (
                <li key={v.id}>
                  {v.description} - {v.amount} ETB ({v.demerit_points} pts)
                </li>
              ))}
            </ul>
          </div>
          {!fine.is_paid && (
            <button
              onClick={() => handlePayment(fine)}
              className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Pay Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function TableView({ fines, handlePayment }) {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("date_of_offense", {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("location", {
      header: "Location",
    }),
    columnHelper.accessor("total_fine_amount", {
      header: "Amount",
      cell: (info) => `${info.getValue()} ETB`,
    }),
    columnHelper.accessor("is_paid", {
      header: "Status",
      cell: (info) => (
        <span className={info.getValue() ? "text-green-600" : "text-red-600"}>
          {info.getValue() ? "Paid" : "Unpaid"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        !row.original.is_paid && (
          <button
            onClick={() => handlePayment(row.original)}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Pay Now
          </button>
        ),
    }),
  ];

  const table = useReactTable({
    data: fines,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded border bg-white shadow-md">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b px-4 py-2 text-left font-medium text-gray-700"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="transition even:bg-gray-50 hover:bg-blue-50"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
