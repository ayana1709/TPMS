import React, { useState, useMemo } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <-- import as a function, not just a side effect
// autoTable(jsPDF);
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

export const ManagerTable = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  console.log(typeof new jsPDF().autoTable); // This should log 'function'

  const data = useMemo(
    () => [
      { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
      { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
      { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
      { id: 4, name: "Dave", email: "dave@example.com", role: "admin" },
      { id: 5, name: "Eva", email: "eva@example.com", role: "user" },
      { id: 6, name: "Frank", email: "frank@example.com", role: "user" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, "users.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Email", "Role"];
    const tableRows = data.map((item) => [item.name, item.email, item.role]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("users.pdf");
  };

  return (
    <div className="p-6">
      <div className="flex gap-4">
        <Input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
          placeholder="Search all columns..."
        />

        <Button
          onClick={exportToExcel}
          className="bg-green-600 text-white py-2 px-4 rounded mr-2"
        >
          Export to Excel
        </Button>
        <Button
          onClick={exportToPDF}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Export to PDF
        </Button>
      </div>
      {/* Table */}
      <Card className="overflow-x-auto">
        <CardContent>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left border-b"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                <tr key={row.id} className="odd:bg-gray-50 even:bg-white">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-2">
        <Button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className=""
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className=""
        >
          {"<"}
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className=""
        >
          {">"}
        </Button>
        <Button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className=""
        >
          {">>"}
        </Button>
      </div>
    </div>
  );
};

export default ManagerTable;
