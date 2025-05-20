import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

const mockDirectives = [
  {
    id: 1,
    title: 'Speed Monitoring Reinforcement',
    description: 'Increase speed checks on highways during rush hours.',
    issuedBy: 'Manager Alemu',
    date: '2025-05-10',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Helmet Enforcement',
    description: 'Ensure all motorcycle riders wear helmets.',
    issuedBy: 'Manager Hana',
    date: '2025-05-12',
    status: 'Pending',
  },
  {
    id: 3,
    title: 'Checkpoints Schedule',
    description: 'Setup morning checkpoints at key junctions.',
    issuedBy: 'Manager Dawit',
    date: '2025-05-14',
    status: 'Completed',
  },
];

const ManagerDirectivesPage = () => {
  const [view, setView] = useState('table');
  const data = useMemo(() => mockDirectives, []);

  const columns = useMemo(
    () => [
      { header: 'Title', accessorKey: 'title' },
      { header: 'Issued By', accessorKey: 'issuedBy' },
      { header: 'Date', accessorKey: 'date' },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue();
          const color =
            status === 'Active'
              ? 'bg-green-100 text-green-700'
              : status === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700';
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
            >
              {status}
            </span>
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
  });

  return (
    <div className="max-w-6xl mx-auto p-4 mt-10 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manager Directives</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded ${
              view === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setView('card')}
            className={`px-4 py-2 rounded ${
              view === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Card View
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2">
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
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((directive) => (
            <div
              key={directive.id}
              className="border rounded-lg shadow p-4 bg-gray-50 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-1">{directive.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {directive.description}
              </p>
              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-semibold">Issued By:</span>{' '}
                  {directive.issuedBy}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {directive.date}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      directive.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : directive.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {directive.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDirectivesPage;
