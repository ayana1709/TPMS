import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← Import this
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  PrinterIcon,
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

// ✅ Mock Data
const mockData = [
  {
    id: 1,
    location: 'Addis Ababa',
    date: '2024-05-10',
    vehiclesInvolved: 2,
    officer: 'Officer A',
  },
  {
    id: 2,
    location: 'Adama',
    date: '2024-05-12',
    vehiclesInvolved: 3,
    officer: 'Officer B',
  },
  {
    id: 3,
    location: 'Hawassa',
    date: '2024-05-14',
    vehiclesInvolved: 1,
    officer: 'Officer C',
  },
];

const AccidentList = () => {
  const tableRef = useRef();
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'vehiclesInvolved',
      header: 'Vehicles',
    },
    {
      accessorKey: 'officer',
      header: 'Reported By',
    },
    {
      header: 'Report',
      cell: ({ row }) => (
        <button
          onClick={() => handleDownload(row.original)}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
        >
          Download PDF
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: mockData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDownload = (rowData) => {
    alert(`Simulating PDF download for accident ID: ${rowData.id}`);
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });
  const navigate = useNavigate(); // ← Initialize navigator

  const handleRegister = () => {
    navigate('/register-accident'); // ← Replace with your route
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Accident Reports</h2>
        <button
          onClick={handleRegister} // ← Hook it up here
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Register Accident
        </button>
      </div>

      {/* Filter + Print */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search accidents..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <PrinterIcon className="w-4 h-4" />
          Print PDF
        </button>
      </div>

      {/* Table */}
      <div ref={tableRef}>
        <table className="w-full border mt-2">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-left px-4 py-2 cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getIsSorted() === 'asc' && (
                      <ArrowUpIcon className="inline w-4 h-4 ml-1" />
                    )}
                    {header.column.getIsSorted() === 'desc' && (
                      <ArrowDownIcon className="inline w-4 h-4 ml-1" />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <span className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
};

export default AccidentList;
