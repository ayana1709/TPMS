// src/components/ExcelImport.jsx
import React, { useState, useEffect } from "react";
import api from "@/api";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TrafficLaws = () => {
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingLaw, setEditingLaw] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lawToDelete, setLawToDelete] = useState(null);

  useEffect(() => {
    fetchLaws();
  }, []);

  const fetchLaws = async () => {
    try {
      const token = localStorage.getItem("adminToken"); // assuming you're storing it in localStorage

      const response = await api.get("/violations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLaws(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching laws:", error);
      toast.error("Failed to fetch traffic laws");
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return toast.error("Please choose a file first.");

    const formData = new FormData();
    formData.append("file", file);

    setImporting(true);

    try {
      await api.post("/import-violations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        // 👇 Make sure this is NOT included!
        withCredentials: false,
      });
      toast.success("Violations imported successfully");
      fetchLaws();
      setFile(null);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        error.response?.data?.message || "Failed to import violations"
      );
    } finally {
      setImporting(false);
    }
  };

  const handleEdit = (law) => {
    setEditingLaw(law);
    setShowEditModal(true);
  };

  const handleDelete = async (lawId) => {
    setLawToDelete(lawId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken"); // or sessionStorage.getItem('token')

      await api.delete(`/violations/${lawToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Law deleted successfully");
      fetchLaws();
    } catch (error) {
      console.error("Error deleting law:", error);
      toast.error("Failed to delete law");
    } finally {
      setShowDeleteModal(false);
      setLawToDelete(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken"); // or sessionStorage.getItem('token')

      await api.put(`/violations/${editingLaw.id}`, editingLaw, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Law updated successfully");
      setShowEditModal(false);
      fetchLaws();
    } catch (error) {
      console.error("Error updating law:", error);
      toast.error("Failed to update law");
    }
  };

  const handleView = (law) => {
    setSelectedLaw(law);
    setShowViewModal(true);
  };

  const filteredLaws = laws.filter((law) => {
    const matchesSearch = law.violation_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLaws = filteredLaws.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLaws.length / itemsPerPage);

  const categories = [
    "all",
    "First Category",
    "Second Category",
    "Third Category",
    "Fourth Category",
    "Fifth Category",
    "Sixth Category",
  ];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Traffic Laws Management</span>
            <div className="flex gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? "Importing..." : "Import"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
              {message}
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <div className="w-64">
              <Input
                type="text"
                placeholder="Search violations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Violation Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Offence Type</TableHead>
                      <TableHead>Demerit Points</TableHead>
                      <TableHead>Fine (Birr)</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLaws.map((law) => (
                      <TableRow key={law.id}>
                        <TableCell>{law.code}</TableCell>
                        <TableCell>
                          {law.violation_name.split(" ").slice(0, 4).join(" ")}
                          {law.violation_name.split(" ").length > 4
                            ? "..."
                            : ""}
                        </TableCell>
                        <TableCell>{law.category}</TableCell>
                        <TableCell>{law.offence_type}</TableCell>
                        <TableCell>{law.demerit_points}</TableCell>
                        <TableCell>{law.fine_birr}</TableCell>
                        <TableCell>{law.action_description}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(law)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 h-4 w-4"
                                >
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(law)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 h-4 w-4"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(law.id)}
                                className="text-red-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 h-4 w-4"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredLaws.length)} of{" "}
                  {filteredLaws.length} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle>Edit Traffic Law</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={editingLaw?.code}
                  onChange={(e) =>
                    setEditingLaw({ ...editingLaw, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="violation_name">Violation Name</Label>
                <Input
                  id="violation_name"
                  value={editingLaw?.violation_name}
                  onChange={(e) =>
                    setEditingLaw({
                      ...editingLaw,
                      violation_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingLaw?.category}
                  onValueChange={(value) =>
                    setEditingLaw({ ...editingLaw, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offence_type">Offence Type</Label>
                <Input
                  id="offence_type"
                  value={editingLaw?.offence_type}
                  onChange={(e) =>
                    setEditingLaw({
                      ...editingLaw,
                      offence_type: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demerit_points">Demerit Points</Label>
                <Input
                  id="demerit_points"
                  type="number"
                  value={editingLaw?.demerit_points}
                  onChange={(e) =>
                    setEditingLaw({
                      ...editingLaw,
                      demerit_points: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fine_birr">Fine (Birr)</Label>
                <Input
                  id="fine_birr"
                  type="number"
                  value={editingLaw?.fine_birr}
                  onChange={(e) =>
                    setEditingLaw({
                      ...editingLaw,
                      fine_birr: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action_description">Action Description</Label>
                <Input
                  id="action_description"
                  value={editingLaw?.action_description}
                  onChange={(e) =>
                    setEditingLaw({
                      ...editingLaw,
                      action_description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[600px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Traffic Law Details
            </DialogTitle>
          </DialogHeader>
          {selectedLaw && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedLaw.violation_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Code: {selectedLaw.code}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {selectedLaw.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Offence Type
                    </Label>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedLaw.offence_type}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Demerit Points
                    </Label>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedLaw.demerit_points}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fine Amount
                    </Label>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedLaw.fine_birr} Birr
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </Label>
                    <div className="rounded-lg bg-green-50 dark:bg-green-900 p-3">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Action Description
                </Label>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedLaw.action_description}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setShowViewModal(false)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this traffic law? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrafficLaws;
