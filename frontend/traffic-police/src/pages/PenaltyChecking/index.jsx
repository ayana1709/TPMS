import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Input } from '/components/ui/input';
import { Button } from '/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '/components/ui/select';
import api from '/src/api';
// import { Table } from '@/components/ui/table';

export default function PenaltyChecking() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    api
      .get('/fines') // Change to your API endpoint
      .then((res) => setData(res.data.data || []))
      .catch((err) => console.error('Error fetching fines:', err));
  }, []);

  const columns = [
    {
      accessorKey: 'full_name',
      header: 'Full Name',
      filterFn: 'includesString',
    },
    {
      accessorKey: 'drivers_license_number',
      header: 'License #',
      filterFn: 'includesString',
    },
    {
      accessorKey: 'vehicle_registration_number',
      header: 'Vehicle Reg #',
      filterFn: 'includesString',
    },
    {
      accessorKey: 'date_of_offense',
      header: 'Offense Date',
      filterFn: 'includesString',
    },
    {
      accessorKey: 'total_fine_amount',
      header: 'Fine Amount',
      cell: (info) => `Birr ${info.getValue()}`,
      filterFn: (row, columnId, filterValue) => {
        return (
          row.getValue(columnId) >= (filterValue.min || 0) &&
          row.getValue(columnId) <= (filterValue.max || Infinity)
        );
      },
    },
    {
      accessorKey: 'is_paid',
      header: 'Paid?',
      cell: (info) => (info.getValue() ? '✅ Paid' : '❌ Unpaid'),
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === 'paid') return row.getValue(columnId) === true;
        if (filterValue === 'unpaid') return row.getValue(columnId) === false;
        return true; // show all if "all"
      },
    },

    {
      id: 'violations',
      header: 'Violations',
      cell: ({ row }) => (
        <ul className="list-disc pl-4">
          {row.original.violations.map((v, idx) => (
            <li key={idx}>
              {v.code} - {v.amount} Birr ({v.demerit_points} pts)
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const fineAmountColumn = table.getColumn('total_fine_amount');
  const fineAmountFilter = fineAmountColumn?.getFilterValue() || {
    min: '',
    max: '',
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Traffic Fines</h2>

      <Input
        placeholder="Search fines..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      {/* Column Filters */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Filter by Name"
          value={table.getColumn('full_name')?.getFilterValue() ?? ''}
          onChange={(e) =>
            table.getColumn('full_name')?.setFilterValue(e.target.value)
          }
          className="max-w-xs"
        />

        <Select
          onValueChange={(value) =>
            table
              .getColumn('is_paid')
              ?.setFilterValue(value === 'all' ? '' : value)
          }
          defaultValue="all"
        >
          <SelectTrigger className="w-[150px]">
            <span>Status</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        {/* Fine Amount Range Filter */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Min Birr"
            type="number"
            value={fineAmountFilter.min}
            onChange={(e) =>
              fineAmountColumn?.setFilterValue({
                ...fineAmountFilter,
                min: e.target.value ? Number(e.target.value) : '',
              })
            }
            className="w-24"
          />
          <span>-</span>
          <Input
            placeholder="Max Birr"
            type="number"
            value={fineAmountFilter.max}
            onChange={(e) =>
              fineAmountColumn?.setFilterValue({
                ...fineAmountFilter,
                max: e.target.value ? Number(e.target.value) : '',
              })
            }
            className="w-24"
          />
        </div>
      </div>

      <div className="overflow-auto rounded-xl border shadow">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
