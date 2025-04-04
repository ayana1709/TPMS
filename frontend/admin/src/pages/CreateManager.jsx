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

export default function CreateManager() {
  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]); // Stores zones of the selected region
  const [woredas, setWoredas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState(""); // New state for zone

  const [password, setPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [createdManager, setCreatedManager] = useState("kaleab"); // Holds submitted data

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

  console.log(regions);
  console.log(woredas);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    console.log(selectedWoredaObj);

    setFormData((prev) => ({
      ...prev,
      woreda: selectedWoredaObj ? selectedWoredaObj.name : "", // Store woreda name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/managers", formData);
      setCreatedManager(formData);
    } catch (error) {
      if (error.response?.status === 422) {
        alert(
          "Validation Error: " + JSON.stringify(error.response.data.errors)
        );
      } else {
        alert("Something went wrong");
      }
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
      Woreda: ${createdManager.woreda}
    `;
    navigator.clipboard.writeText(managerInfo);
    alert("Manager info copied!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Form Layout */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-xl uppercase tracking-wider">
          Create Manager
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 border p-4 rounded-sm mt-6"
        >
          <Input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="py-6 dark:border-gray-200"
            required
          />
          <Input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="py-6 dark:border-gray-200"
            required
          />
          <Input
            name="email"
            placeholder="Email (Optional)"
            onChange={handleChange}
            className="py-6 dark:border-gray-100"
          />

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
                    <SelectItem key={zone.id} value={zone.osm_id.toString()}>
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

          <Select
            onValueChange={handleWoredaChange}
            // value={formData.woreda}
            disabled={!selectedZone}
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

          <Button type="submit" className="w-full py-6 text-xl cursor-pointer">
            Create Manager
          </Button>
        </form>
      </div>

      {/* Manager Info Layout */}
      <div className="bg-white dark:bg-gray-800 flex flex-col gap-6 rounded-md p-4">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border p-2">
          <h2 className="text-xl font-semibold mb-4 tracking-wider">
            Admin Controls
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="py-6 dark:border-gray-200"
              required
            />

            <div className="flex gap-2">
              <Input
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
          <div className="bg-white dark:bg-gray-700 p-10 rounded-lg shadow-sm relative border">
            <h2 className="text-xl font-semibold mb-4 tracking-wider">
              Manager Information
            </h2>

            <div className="flex flex-col gap-4 bg-gray-200 dark:bg-gray-600 p-8 rounded-md text-sm space-y-2">
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Name:
                <span className="text-md text-gray-800 dark:text-gray-400 ml-2">
                  {createdManager.name || "Kaleab"}
                </span>{" "}
              </p>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Phone:
                <span className="text-md tracking-wider text-gray-800 dark:text-gray-400 ml-2">
                  {createdManager.phone || "+251916163516"}
                </span>{" "}
              </p>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Email:
                <span className="text-md tracking-wider text-gray-800 dark:text-gray-400 ml-2">
                  {createdManager.email || "kgemechu908@gmail.com"}
                </span>{" "}
              </p>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Region:
                <span className="text-md tracking-wider text-gray-800 dark:text-gray-400 ml-2">
                  {createdManager.region || "Oromia"}
                </span>{" "}
              </p>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Status:
                <span className="text-md tracking-wider text-gray-800 dark:text-gray-400 ml-2">
                  {createdManager.status || "Haramaya"}
                </span>{" "}
              </p>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md flex items-center"
            >
              <Copy className="w-4 h-4 mr-1" /> Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
