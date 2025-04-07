import React, { useState, useMemo, useEffect } from "react";
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
import api from "@/api";

export const ManagerTable = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    api
      .get("/managers")
      .then((res) => setManagers(res.data))
      .catch((err) => console.error("Error fetching managers:", err));
  }, []);

  const columns = useMemo(() => {
    if (managers.length === 0) return [];

    const dynamicColumns = Object.keys(managers[0]).map((key) => {
      // Truncate 'region'
      if (key === "region") {
        return {
          accessorKey: key,
          header: "Region",
          cell: ({ getValue }) => {
            const value = getValue();
            return value.length > 20 ? `${value.slice(0, 20)}...` : value;
          },
        };
      }

      return {
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      };
    });

    // Add custom Actions column
    dynamicColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const manager = row.original;
        return (
          <div className="flex gap-2">
            <Button className="bg-indigo-950 px-6 text-lg">Action</Button>
          </div>
        );
      },
    });

    return dynamicColumns;
  }, [managers]);

  const table = useReactTable({
    data: managers,
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
          className="mb-4 p-6 border border-gray-300 rounded w-full max-w-md"
          placeholder="Search all columns..."
        />

        <Button
          onClick={exportToExcel}
          className="py-6 px-4 bg-indigo-950 text-lg cursor-pointer hover:shadow-md transition-all duration-300 dark:bg-indigo-900 dark:text-gray-100 hover:dark:bg-gray-950 hover:dark:text-gray-100"
        >
          Export to Excel
        </Button>
        <Button
          onClick={exportToPDF}
          className="py-6 px-4 bg-indigo-950 text-lg cursor-pointer hover:shadow-md transition-all duration-300 dark:bg-indigo-900 dark:text-gray-100 hover:dark:bg-gray-950 hover:dark:text-gray-100"
        >
          Export to PDF
        </Button>
      </div>
      {/* Table */}
      <Card className="overflow-x-auto dark:bg-gray-600">
        <CardContent>
          <table className="min-w-full overflow-x-auto">
            <thead className="bg-indigo-950 text-white dark:text-gray-200 overflow-hidden">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="rounded-2xl">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-4 text-left border-b"
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
                <tr key={row.id} className="bg-white dark:bg-gray-600">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 border-b">
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
        ></Button>
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
