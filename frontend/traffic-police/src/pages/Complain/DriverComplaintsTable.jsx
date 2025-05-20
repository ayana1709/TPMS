import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const mockDriverComplaints = [
  {
    id: 1,
    driver: 'Daniel Kebede',
    subject: 'Unfair Traffic Stop',
    status: 'Pending',
    date: '2025-05-10',
  },
  {
    id: 2,
    driver: 'Mikiyas Tesfaye',
    subject: 'Disrespectful Behavior by Officer',
    status: 'In Review',
    date: '2025-05-09',
  },
  {
    id: 3,
    driver: 'Sara Belay',
    subject: 'Fine Issued Without Explanation',
    status: 'Handled',
    date: '2025-05-08',
  },
];

const DriverComplaintsTable = () => {
  const data = useMemo(() => mockDriverComplaints, []);

  const columns = useMemo(
    () => [
      {
        header: 'Driver Name',
        accessorKey: 'driver',
      },
      {
        header: 'Complaint Subject',
        accessorKey: 'subject',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const value = getValue();
          const color =
            value === 'Handled'
              ? 'bg-green-100 text-green-700'
              : value === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700';
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
            >
              {value}
            </span>
          );
        },
      },
      {
        header: 'Date Filed',
        accessorKey: 'date',
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
              title="View Full Complaint"
            >
              View
            </button>
            <button
              className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
              title="Respond to Complaint"
            >
              Respond
            </button>
            <button
              className="px-2 py-1 text-xs text-white bg-gray-600 rounded hover:bg-gray-700"
              title="Mark as Handled"
            >
              Handled
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="max-w-6xl mx-auto p-4 mt-10 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Driver Complaints to Traffic Police
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition">
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
    </div>
  );
};

export default DriverComplaintsTable;
