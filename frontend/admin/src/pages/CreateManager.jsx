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

export default function CreateManager() {
  const [regions, setRegions] = useState([]);
  const [woredas, setWoredas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    woreda: "",
  });

  useEffect(() => {
    axios.get("/api/regions").then((res) => setRegions(res.data));
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(`/api/woredas?region=${selectedRegion}`)
        .then((res) => setWoredas(res.data));
    }
  }, [selectedRegion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/managers", formData);
    alert("Manager created successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Create Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <Input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          placeholder="Email (Optional)"
          onChange={handleChange}
        />

        <Select onValueChange={setSelectedRegion} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.isArray(regions) && regions.length > 0 ? (
                regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))
              ) : (
                <SelectContent>
                  <SelectGroup>
                    <SelectItem disabled value="default">
                      No regions available
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          name="woreda"
          onValueChange={(value) => setFormData({ ...formData, woreda: value })}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Woreda" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {woredas.map((woreda) => (
                <SelectItem key={woreda.id} value={woreda.id}>
                  {woreda.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="submit" className="w-full">
          Create Manager
        </Button>
      </form>
    </div>
  );
}
