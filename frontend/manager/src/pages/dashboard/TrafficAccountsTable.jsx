import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import api from "@/api";
import { useNavigate } from "react-router-dom";

// Utility to export data to CSV
const exportToCSV = (data, filename = "export.csv") => {
  const csvContent = [
    Object.keys(data[0]).join(","),
    ...data.map((row) => Object.values(row).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const TrafficAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/traffic-users")
      .then((res) => {
        setAccounts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch traffic users:", err);
        setLoading(false);
      });
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "full_name", header: "Full Name" },
      { accessorKey: "badge_number", header: "Badge Number" },
      { accessorKey: "rank", header: "Rank" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "username", header: "Username" },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button className="text-blue-600 hover:underline">View</button>
            <button className="text-yellow-600 hover:underline">Edit</button>
            <button className="text-red-600 hover:underline">Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: accounts,
    columns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Traffic Police Accounts</h2>
        
      </div>

    



      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
  {/* Search Input on the left */}
  <input
    type="text"
    placeholder="Search..."
    value={globalFilter ?? ""}
    onChange={(e) => setGlobalFilter(e.target.value)}
    className="border px-4 py-2 rounded-xl shadow-sm w-72"
  />

  {/* Right-aligned group (button + dropdown) */}
  <div className="flex items-center space-x-3 ml-auto">
    {/* Create Account Button */}
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
      onClick={() => navigate("/dashboard/create-account")}
    >
      Create Account
    </button>

    {/* Column Visibility Dropdown */}
    <div className="relative">
      <button
        onClick={() => setShowColumnsDropdown((prev) => !prev)}
        className="flex items-center border px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
      >
        Columns
        <ChevronDownIcon className="w-4 h-4 ml-1" />
      </button>

      {showColumnsDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-10 p-3 space-y-2">
          {table.getAllLeafColumns().map((column) => (
            <label key={column.id} className="flex items-center text-sm space-x-2">
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              <span>{column.columnDef.header}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

    

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-4 px-6 cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded-xl border disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded-xl border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrafficAccountsTable;
