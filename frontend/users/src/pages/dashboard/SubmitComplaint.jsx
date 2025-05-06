import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { complaintSchema } from "../../lib/schemas";
import { cn } from "../../lib/utils";
import axios from "axios";

export default function SubmitComplaint() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(complaintSchema),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("vehiclePlateNumber", data.vehiclePlateNumber || "");
      formData.append("category", data.category);
      formData.append("description", data.description);
      if (selectedFile) {
        formData.append("evidence", selectedFile);
      }

      const response = await axios.post("/api/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSuccess("Your complaint has been submitted successfully!");
        reset();
        setSelectedFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Submit a Complaint
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="vehiclePlateNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Vehicle Plate Number (Optional)
          </label>
          <input
            {...register("vehiclePlateNumber")}
            type="text"
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              errors.vehiclePlateNumber && "border-red-500"
            )}
            placeholder="Enter vehicle plate number"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Complaint Category
          </label>
          <select
            {...register("category")}
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              errors.category && "border-red-500"
            )}
          >
            <option value="">Select a category</option>
            <option value="Driver Behavior">Driver Behavior</option>
            <option value="Vehicle Condition">Vehicle Condition</option>
            <option value="Payment Issue">Payment Issue</option>
            <option value="Traffic Officer Misconduct">
              Traffic Officer Misconduct
            </option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Complaint Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              errors.description && "border-red-500"
            )}
            placeholder="Describe your complaint in detail"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="evidence"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Evidence (Optional)
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="evidence"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept="image/*,video/*"
            />
          </div>
          {selectedFile && (
            <p className="mt-1 text-sm text-gray-500">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
}
