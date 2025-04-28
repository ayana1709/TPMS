import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accidentReportSchema } from "../../lib/schemas";
import { cn } from "../../lib/utils";
import axios from "axios";

export default function ReportAccident() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(accidentReportSchema),
  });

  useEffect(() => {
    // Get current time
    const now = new Date();
    setValue("timeOfAccident", now.toISOString().slice(0, 16));

    // Get current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setValue("location", `${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [setValue]);

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
      formData.append("location", data.location);
      formData.append("timeOfAccident", data.timeOfAccident);
      formData.append("vehiclePlateNumber", data.vehiclePlateNumber || "");
      formData.append("description", data.description);
      if (selectedFile) {
        formData.append("evidence", selectedFile);
      }

      const response = await axios.post("/api/accidents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSuccess("Accident reported successfully. Thank you for your help!");
        reset();
        setSelectedFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to report accident");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report an Accident</h1>
        <button
          onClick={handleEmergencyCall}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Emergency Call
        </button>
      </div>

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
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location of Accident
          </label>
          <input
            {...register("location")}
            type="text"
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              errors.location && "border-red-500"
            )}
            placeholder="Enter location or use current location"
          />
          {currentLocation && (
            <p className="mt-1 text-sm text-gray-500">
              Current location: {currentLocation.latitude},{" "}
              {currentLocation.longitude}
            </p>
          )}
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="timeOfAccident"
            className="block text-sm font-medium text-gray-700"
          >
            Time of Accident
          </label>
          <input
            {...register("timeOfAccident")}
            type="datetime-local"
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              errors.timeOfAccident && "border-red-500"
            )}
          />
          {errors.timeOfAccident && (
            <p className="mt-1 text-sm text-red-600">
              {errors.timeOfAccident.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="vehiclePlateNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Vehicle Plate Number(s) (Optional)
          </label>
          <input
            {...register("vehiclePlateNumber")}
            type="text"
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              errors.vehiclePlateNumber && "border-red-500"
            )}
            placeholder="Enter vehicle plate number(s)"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description of Accident
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
              errors.description && "border-red-500"
            )}
            placeholder="Describe the accident in detail"
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
            {isLoading ? "Submitting..." : "Send Accident Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
