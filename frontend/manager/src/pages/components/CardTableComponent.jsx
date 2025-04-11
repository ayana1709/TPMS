// CardTableComponent.jsx
import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const defaultData = [
  { name: 'Ayana Basha', age: 24, job: 'Full Stack Dev', country: 'Ethiopia' },
  { name: 'Samira Nuru', age: 27, job: 'Data Analyst', country: 'Kenya' },
  { name: 'Liam Smith', age: 30, job: 'Project Manager', country: 'USA' },
  { name: 'Zara Yusuf', age: 22, job: 'Frontend Dev', country: 'Somalia' },
  { name: 'John Doe', age: 35, job: 'Backend Dev', country: 'Canada' },
];

const defaultColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'job',
    header: 'Job Title',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
];

function CardTableComponent() {
  const [data] = useState(() => [...defaultData]);
  const [columns] = useState(() => [...defaultColumns]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">👤 Employee Cards</h1>

      <input
        type="text"
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="🔍 Search team..."
        className="mb-6 px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {table.getRowModel().rows.map(row => (
          <div key={row.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg border border-gray-200">
            {row.getVisibleCells().map(cell => (
              <div key={cell.id} className="mb-2">
                <div className="text-xs text-gray-400">
                  {cell.column.columnDef.header}
                </div>
                <div className="text-base font-medium">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="space-x-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ⬅ Prev
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next ➡
          </button>
        </div>
        <div>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}
export default CardTableComponent;
