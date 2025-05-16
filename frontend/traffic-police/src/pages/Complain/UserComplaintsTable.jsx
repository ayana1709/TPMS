import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const mockComplaints = [
  {
    id: 1,
    user: 'Samuel Kebede',
    subject: 'Reckless Driving by Taxi at Meskel Square',
    status: 'Pending',
    date: '2025-05-15',
  },
  {
    id: 2,
    user: 'Helen Amanuel',
    subject: 'Traffic Light Malfunction at Bole Intersection',
    status: 'Resolved',
    date: '2025-05-14',
  },
  {
    id: 3,
    user: 'Robel Getachew',
    subject: 'Unfair Fine Issued by Officer',
    status: 'In Review',
    date: '2025-05-13',
  },
  {
    id: 4,
    user: 'Amina Yusuf',
    subject: 'Illegal Parking Blocking Driveway',
    status: 'Pending',
    date: '2025-05-12',
  },
];

const UserComplaintsTable = () => {
  const data = useMemo(() => mockComplaints, []);

  const columns = useMemo(
    () => [
      {
        header: 'Citizen Name',
        accessorKey: 'user',
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
            value === 'Resolved'
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
        header: 'Date Submitted',
        accessorKey: 'date',
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
              title="View Complaint"
            >
              View Details
            </button>
            <button
              className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
              title="Mark this complaint as resolved"
            >
              Mark Resolved
            </button>
            <button
              className="px-2 py-1 text-xs text-white bg-purple-600 rounded hover:bg-purple-700"
              title="Assign to a traffic officer"
            >
              Assign Officer
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
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        🚨 Complaints Submitted by Citizens
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 whitespace-nowrap">
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
                  <td
                    key={cell.id}
                    className="px-4 py-2 whitespace-normal max-w-xs"
                  >
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

export default UserComplaintsTable;
