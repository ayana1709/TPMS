import React, { useEffect, useMemo, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import api from "@/api";
import {
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ManagerDetailsModal } from "./ManagerDetailsModal";
export const ManagerTable = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedManager, setSelectedManager] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [managers, setManagers] = useState([]);

  useEffect(() => {
    api
      .get("/managers")
      .then((res) => setManagers(res.data))
      .catch((err) => console.error("Error fetching managers:", err));
  }, []);

  const columns = useMemo(() => {
    if (managers.length === 0) return [];

    const selectionColumn = {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
    const dynamicColumns = managers[0]
      ? Object.keys(managers[0]).map((key) => {
          if (key === "region") {
            return {
              accessorKey: key,
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  className="px-0"
                >
                  Region
                  {column.getIsSorted() === "asc" && (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  )}
                  {column.getIsSorted() === "desc" && (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  )}
                  {!column.getIsSorted() && (
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              ),
              cell: ({ getValue }) => {
                const value = getValue();
                return value.length > 20 ? `${value.slice(0, 20)}...` : value;
              },
            };
          }

          return {
            accessorKey: key,
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="px-0"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {column.getIsSorted() === "asc" && (
                  <ArrowUp className="ml-2 h-4 w-4" />
                )}
                {column.getIsSorted() === "desc" && (
                  <ArrowDown className="ml-2 h-4 w-4" />
                )}
                {!column.getIsSorted() && (
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            ),
          };
        })
      : [];
    dynamicColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="cursor-pointer flex justify-center items-center min-h-[40px] w-full">
          <DropdownMenu className="text-center cursor-pointer">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="text-center w-[180px] p-8"
            >
              <DropdownMenuItem
                onClick={() => {
                  setSelectedManager(row.original);
                  setIsDialogOpen(true);
                }}
                className="text-center text-lg cursor-pointer"
              >
                View
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => console.log("Edit", row.original)}
                className="text-center text-lg cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Delete", row.original)}
                className="text-center text-red-500 text-lg cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    });

    return [selectionColumn, ...dynamicColumns];
  }, [managers]);

  const table = useReactTable({
    data: managers,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(managers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Managers");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, "managers.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = columns
      .filter((col) => col.accessorKey)
      .map((col) => col.header);
    const rows = managers.map((row) =>
      columns
        .filter((col) => col.accessorKey)
        .map((col) => row[col.accessorKey])
    );
    autoTable(doc, {
      head: [headers],
      body: rows,
    });
    doc.save("managers.pdf");
  };

  return (
    <div className="p-6 space-y-4">
      {/* Search + Export Buttons */}

      {/* Data Table */}
      <Card className="p-4 shadow">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-sm py-[20px] placeholder:text-lg"
          />
          <Button
            onClick={exportToExcel}
            className="py-[20px] text-lg bg-indigo-950 text-white hover:bg-indigo-900"
          >
            Export to Excel
          </Button>
          <Button
            onClick={exportToPDF}
            className="py-[20px] text-lg bg-indigo-950 text-white hover:bg-indigo-900"
          >
            Export to PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="py-6 text-lg ml-auto bg-indigo-950 hover:bg-indigo-900 dark:bg-indigo-950 hover:dark:bg-indigo-900 border-none text-white hover:text-white"
              >
                Toggle Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ManagerDetailsModal
          manager={selectedManager}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />

        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                  <TableCell key={cell.id} className="py-3 text-md">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManagerTable;
