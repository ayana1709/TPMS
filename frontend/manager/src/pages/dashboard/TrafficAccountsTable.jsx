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

const TrafficAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // "view", "edit", "delete"
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);
  const managerId = localStorage.getItem("manager_id");


  const fetchAccounts = () => {
    setLoading(true);
api.get(`/traffic-users?manager_id=${managerId}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
.then(res => {
  setAccounts(res.data);
  setLoading(false);
})
.catch(err => {
  console.error("Failed to fetch traffic users:", err);
  setLoading(false);
});}

  const openModal = (type, user) => {
    setSelectedUser(user);
    setForm(user);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
    setForm({});
  };

  const handleEdit = () => {
    api
      .put(`/traffic-users/${selectedUser.id}`, form)
      .then(() => {
        fetchAccounts();
        closeModal();
      })
      .catch((err) => console.error("Edit failed", err));
  };

  const handleDelete = () => {
    api
      .delete(`/traffic-users/${selectedUser.id}`)
      .then(() => {
        fetchAccounts();
        closeModal();
      })
      .catch((err) => console.error("Delete failed", err));
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },

      { accessorKey: "full_name", header: "Full Name" },
      { accessorKey: "badge_number", header: "Badge Number" },
      { accessorKey: "rank", header: "Rank" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "username", header: "Username" },
      { accessorKey: "status", header: "Status" },

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
            <button
              className="text-blue-600 hover:underline"
              onClick={() => openModal("view", row.original)}
            >
              View
            </button>
            <button
              className="text-yellow-600 hover:underline"
              onClick={() => openModal("edit", row.original)}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => openModal("delete", row.original)}
            >
              Delete
            </button>
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

      {/* Search + Create + Column Toggle */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border px-4 py-2 rounded-xl shadow-sm w-72"
        />

        <div className="flex items-center space-x-3 ml-auto">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            onClick={() => navigate("/dashboard/create-account")}
          >
            Create Account
          </button>

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

      {/* Table */}
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
                      {flexRender(header.column.columnDef.header, header.getContext())}
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
                  <tr key={row.id} className="border-b hover:bg-gray-50 transition">
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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

      {/* MODAL */}
      {modalType && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 capitalize">{modalType} User</h3>

            {modalType === "view" ? (
  <div>
    <div className="space-y-2 mb-4">
      {Object.entries(selectedUser).map(([key, value]) => (
        <p key={key} className="text-sm">
          <strong className="capitalize">{key.replaceAll("_", " ")}:</strong> {value}
        </p>
      ))}
    </div>
    <div className="flex justify-end">
      <button
        onClick={closeModal}
        className="border px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  </div>
) : modalType === "edit" ? (

  
  <div>
  {/* Top-right close (X) icon */}
  <div className="flex justify-end mb-4">
    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
      &times;
    </button>
  </div>

  <div className="space-y-3">
    {["full_name", "rank", "phone", "email", "username"].map((field) => (
      <div key={field}>
        <label className="block text-sm capitalize">{field.replace("_", " ")}</label>
        <input
          type="text"
          className="w-full border rounded-xl px-3 py-2"
          value={form[field] || ""}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        />
      </div>
    ))}

    <button
      onClick={handleEdit}
      className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600"
    >
      Save Changes
    </button>
  </div>
</div>






            ) : modalType === "delete" ? (
              <div>
                <p className="text-sm mb-4">
                  Are you sure you want to delete <strong>{selectedUser.full_name}</strong>?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="border px-4 py-2 rounded-xl text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : null}

            <button onClick={closeModal} className="absolute top-3 right-4 text-gray-400 text-xl">
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficAccountsTable;
