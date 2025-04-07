import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import axios from "axios";
import { SelectGroup, SelectValue } from "@radix-ui/react-select";
import { Copy } from "lucide-react";
import api from "@/api";
import { useStores } from "@/contexts/storeContext";
import CreateManagerModal from "./CreateManagermodal";
import { toast } from "react-toastify";

export default function CreateManager() {
  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]); // Stores zones of the selected region
  const [woredas, setWoredas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState(""); // New state for zone
  const [selectedWoreda, setSelectedWoreda] = useState(""); // New state for zone
  const [password, setPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [createdManager, setCreatedManager] = useState("kaleab"); // Holds submitted data
  const [regionVaidation, setRegionValidation] = useState("");
  const [zoneVaidation, setZoneValidation] = useState("");
  const [woredaVaidation, setWoredaValidation] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const { isManagerSuccessModalOpen, setIsManagerSuccessModalOpen } =
    useStores();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    region: "",
    zone: "",
    woreda: "",
    password: "",
    username: "",
  });

  console.log(formData);

  // Fetch regions from Laravel backend
  useEffect(() => {
    api
      .get("/fetch-regions")
      .then((response) => setRegions(response.data))
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  // Fetch zones based on selected region
  useEffect(() => {
    if (selectedRegion) {
      api
        .get(`/fetch-zones/${selectedRegion}`)
        .then((response) => setZones(response.data))
        .catch((error) => console.error("Error fetching zones:", error));
    } else {
      setZones([]);
      setWoredas([]);
    }
  }, [selectedRegion]);

  // Fetch woredas based on selected zone
  useEffect(() => {
    if (selectedZone) {
      api
        .get(`/fetch-woredas/${selectedZone}`)
        .then((response) => setWoredas(response.data))
        .catch((error) => console.error("Error fetching woredas:", error));
    } else {
      setWoredas([]);
    }
  }, [selectedZone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setIsUsernameValid(/^[a-zA-Z0-9_]{4,20}$/.test(value));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update selected region & formData
  const handleRegionChange = (value) => {
    const selectedRegionObj = regions.find(
      (region) => region.osm_id.toString() === value
    );

    setSelectedRegion(value); // Keep the selected region ID for fetching zones
    setFormData((prev) => ({
      ...prev,
      region: selectedRegionObj ? selectedRegionObj.name : "", // Store region name
      zone: "",
      woreda: "",
    }));
  };

  // Update selected zone & formData
  const handleZoneChange = (value) => {
    const selectedZoneObj = zones.find(
      (zone) => zone.osm_id.toString() === value
    );

    setSelectedZone(value); // Keep the selected zone ID for fetching woredas
    setFormData((prev) => ({
      ...prev,
      zone: selectedZoneObj ? selectedZoneObj.name : "", // Store zone name
      woreda: "",
    }));
  };

  // Update selected woreda
  const handleWoredaChange = (value) => {
    console.log(value.toString());
    const selectedWoredaObj = woredas.find(
      (woreda) => woreda.osm_id.toString() === value
    );
    setSelectedWoreda(value);

    setFormData((prev) => ({
      ...prev,
      woreda: selectedWoredaObj ? selectedWoredaObj.name : "", // Store woreda name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset validation messages
    setRegionValidation("");
    setZoneValidation("");
    setWoredaValidation("");

    // Manual Select validations
    if (!selectedRegion) {
      setRegionValidation("Please select a region to proceed!");
      return;
    }
    if (!selectedZone) {
      setZoneValidation("Please select a zone to proceed!");
      return;
    }
    if (!selectedWoreda) {
      setWoredaValidation("Please select a town to proceed!");
      return;
    }

    try {
      await api.post("/managers", formData);
      setCreatedManager(formData);
      setIsManagerSuccessModalOpen(true); // Show success modal

      // Reset the form after successful creation
      // setFormData({
      //   name: "",
      //   phone: "",
      //   email: "",
      //   region: "",
      //   zone: "",
      //   woreda: "",
      //   username: "",
      //   password: "",
      // });
    } catch (error) {
      console.log(error);
    }
  };

  const generatePassword = () => {
    const newPassword = Math.random().toString(36).slice(-10); // Generate a 10-character password
    setFormData((prevData) => ({ ...prevData, password: newPassword }));
  };

  const handleCopy = () => {
    const managerInfo = `
      Name: ${createdManager.name}
      Email: ${createdManager.email || "N/A"}
      Phone: ${createdManager.phone}
      Region: ${createdManager.region}
      Zone: ${createdManager.zone}
      Woreda: ${createdManager.woreda}
      Username: ${createdManager.username}
      Password: ${createdManager.password}
    `;
    navigator.clipboard.writeText(managerInfo);
    alert("Manager info copied!");
  };
  const sendManagerInfo = async (username) => {
    console.log(username);
    try {
      await api.post(`/managers/${username}/send-info`);
      toast.success("Manager info sent successfully!");
    } catch (error) {
      toast.error("Failed to send manager info.");
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen"
      >
        {isManagerSuccessModalOpen && (
          <div className="absolute z-[999] -top-9 left-12 w-[45%]">
            <CreateManagerModal />
          </div>
        )}
        {/* Form Layout */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-xl uppercase tracking-wider">
            Create Manager
          </h2>
          <div className="flex flex-col gap-8 border p-4 rounded-sm mt-6">
            <div className="relative z-0">
              <Input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                value={formData.name}
                className={`py-6 dark:border-gray-200 ${
                  formData.name && !/^[A-Za-z\s]+$/.test(formData.name)
                    ? "disabled border-3 border-red-500 dark:border-red-500 outline-none dark:outline-none ring-0 dark:ring-0"
                    : ""
                }`}
                required
              />
              {formData.name && !/^[A-Za-z\s]+$/.test(formData.name) && (
                <p className="absolute z-[999] -bottom-6 text-md text-red-500 mt-1">
                  Only letters and spaces allowed.
                </p>
              )}
            </div>
            <div className="relative">
              <Input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                value={formData.phone}
                maxLength={13} // Optional: prevent input longer than allowed
                className={`py-6 dark:border-gray-200 ${
                  formData.phone && !/^(\+251|0)?9\d{0,8}$/.test(formData.phone)
                    ? "disabled border-3 border-red-500 dark:border-red-500 outline-none dark:outline-none ring-0 dark:ring-0"
                    : ""
                }`}
                required
              />
              {formData.phone &&
                !/^(\+251|0)?9\d{0,8}$/.test(formData.phone) && (
                  <p className="absolute z-[999] -bottom-6 text-md text-red-500 mt-1">
                    Enter a valid Ethiopian phone number (e.g. +2519XXXXXXXX or
                    09XXXXXXXX).
                  </p>
                )}
            </div>
            <div className="relative">
              <Input
                name="email"
                placeholder="Email (Optional)"
                onChange={handleChange}
                className={`py-6 dark:border-gray-200 ${
                  formData.email &&
                  !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
                    ? "disabled border-3 border-red-500 dark:border-red-500 outline-none dark:outline-none ring-0 dark:ring-0"
                    : ""
                }`}
                required
              />
              {formData.email &&
                !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email) && (
                  <p className="absolute z-[999] -bottom-6 text-md text-red-500 mt-1">
                    Enter a valid email address.
                  </p>
                )}
            </div>

            <div className="relative">
              <Select
                onValueChange={handleRegionChange}
                value={selectedRegion}
                required
              >
                <SelectTrigger className="w-full py-6 dark:border-gray-200">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {regions.length > 0 ? (
                      regions.map((region) => (
                        <SelectItem
                          key={region.id}
                          value={region.osm_id.toString()}
                        >
                          {region.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="default">
                        No regions available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!selectedRegion && (
                <p
                  className={`${
                    !selectedRegion
                      ? "absolute px-2 rounded-sm w-auto text-red-700 text-lg"
                      : "w-0"
                  }`}
                >
                  {regionVaidation}
                </p>
              )}
            </div>

            <div className="relative">
              <Select
                onValueChange={handleZoneChange}
                value={selectedZone}
                disabled={!selectedRegion}
                required
              >
                <SelectTrigger className="w-full py-6 dark:border-gray-200">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {zones.length > 0 ? (
                      zones.map((zone) => (
                        <SelectItem
                          key={zone.id}
                          value={zone.osm_id.toString()}
                        >
                          {zone.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="default">
                        No zones available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!selectedZone && (
                <p
                  className={`${
                    !selectedZone
                      ? "absolute px-2 rounded-sm w-auto text-red-700 text-lg"
                      : "w-0"
                  }`}
                >
                  {zoneVaidation}
                </p>
              )}
            </div>

            <div className="relative">
              <Select
                onValueChange={handleWoredaChange}
                // value={formData.woreda}
                disabled={!selectedZone}
                // required
              >
                <SelectTrigger className="w-full py-6 dark:border-gray-200">
                  <SelectValue placeholder="Select Woreda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {woredas.length > 0 ? (
                      woredas.map((woreda) => (
                        <SelectItem
                          key={woreda.id}
                          value={woreda.osm_id.toString()}
                        >
                          {woreda.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="default">
                        No woredas available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!selectedWoreda && (
                <p
                  className={`${
                    !selectedWoreda
                      ? "absolute px-2 rounded-sm w-auto text-red-700 text-lg"
                      : "w-0"
                  }`}
                >
                  {woredaVaidation}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-xl cursor-pointer"
            >
              Create Manager
            </Button>
          </div>
        </div>

        {/* Manager Info Layout */}
        <div className="bg-white dark:bg-gray-800 flex flex-col gap-6 rounded-md p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border p-2">
            <h2 className="text-xl font-semibold mb-4 tracking-wider">
              Admin Controls
            </h2>
            <div className="flex flex-col gap-4">
              <div className={`relative ${!isUsernameValid ? "mb-10" : ""}`}>
                <Input
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  className={`py-6 dark:border-gray-200 ${
                    !isUsernameValid
                      ? "disabled border-3 border-red-500 dark:border-red-500 outline-none dark:outline-none ring-0 dark:ring-0"
                      : ""
                  }`}
                  required
                  value={formData.username}
                />
                {formData.username && !isUsernameValid && (
                  <p className="absolute z-[999] -bottom-12 text-md text-red-500 mt-1">
                    Username must be 4–20 characters long and contain only
                    letters, numbers, or underscores.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Enter or Generate Password"
                  onChange={handleChange} // Allow manual input
                  className="py-6 dark:border-gray-200"
                  required
                />
              </div>
              <Button
                type="button"
                onClick={generatePassword}
                className="py-6 text-xl"
              >
                Generate Password
              </Button>
            </div>
          </div>
          {createdManager && (
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-sm relative border">
              <h2 className="text-xl dark:text-gray-100 font-semibold mb-4 tracking-wider">
                Manager Information
              </h2>

              <div className="flex flex-col gap-4 bg-gray-200 dark:bg-gray-950 p-8 rounded-md text-sm space-y-2">
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  Name:
                  <span className="text-md text-blue-500 dark:text-blue-500 ml-2">
                    {createdManager.name || "Kaleab"}
                  </span>{" "}
                </p>
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  Phone:
                  <span className="text-md tracking-wider text-lime-800 dark:text-lime-400 ml-2">
                    {createdManager.phone || "+251916163516"}
                  </span>{" "}
                </p>
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  Email:
                  <span className="text-md tracking-wider text-teal-800 dark:text-teal-500 ml-2">
                    {createdManager.email || "kgemechu908@gmail.com"}
                  </span>{" "}
                </p>
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  Region:
                  <span className="text-md tracking-wider text-cyan-800 dark:text-cyan-400 ml-2">
                    {createdManager.region || "Oromia"}
                  </span>{" "}
                </p>
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  Username:
                  <span className="text-md tracking-wider text-green-500 ml-2">
                    {createdManager.username || "username"}
                  </span>{" "}
                </p>
                <p className="text-xl dark:text-gray-200">
                  Password:
                  <span className="text-md inline-block text-orange-500 tracking-wider ml-2">
                    {createdManager.password || "password"}
                  </span>{" "}
                </p>
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  Status:
                  <span className="text-md tracking-wider text-purple-800 dark:text-purple-400 ml-2">
                    {createdManager.status || "Inactive"}
                  </span>{" "}
                </p>
              </div>

              {/* Copy Button */}
            </div>
          )}
        </div>
      </form>
      <div className="w-[35%] absolute left-[77%] z-[999999] top-[38%]">
        <Button
          onClick={() => sendManagerInfo(createdManager.username)}
          className="w-[50%] m-auto py-6 text-lg cursor-pointer hover:bg-gray-950 hover:text-gray-200 transition-all duration-400"
        >
          Send Manager Info
        </Button>
      </div>
    </div>
  );
}
