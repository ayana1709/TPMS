import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import api from '/src/api';

const UserComplaintsTable = () => {
  const [data, setData] = useState([]);

  // Fetch complaints from backend
  useEffect(() => {
    api
      .get('/complaints') // no headers
      .then((res) => {
        setData(res.data); // or res.data.data based on backend
      })
      .catch((err) => {
        console.error(
          'Failed to fetch complaints:',
          err.response?.data || err.message,
        );
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Type',
        accessorKey: 'type',
      },
      {
        header: 'Date & Time',
        accessorKey: 'datetime',
      },
      {
        header: 'Plate Number',
        accessorKey: 'plate_number',
      },
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        header: 'Contact Info',
        accessorKey: 'contact_info',
      },
      {
        header: 'Files',
        accessorKey: 'file_path',
        cell: ({ getValue }) => {
          const files = JSON.parse(getValue() || '[]');
          return (
            <div className="flex flex-wrap gap-1">
              {files.map((file, index) => (
                <a
                  key={index}
                  href={`http://localhost:8000/storage/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs"
                >
                  File {index + 1}
                </a>
              ))}
            </div>
          );
        },
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
    <div className="max-w-7xl mx-auto p-4 mt-10 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        🚨 Citizen Complaints
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
