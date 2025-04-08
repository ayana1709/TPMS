import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import api from "@/api";
import { toast } from "react-toastify";

export function ManagerEditModal({
  manager,
  open,
  onOpenChange,
  onSubmit,
  setManagers,
}) {
  const [formData, setFormData] = useState({});

  console.log(formData);

  // Update form data when manager changes
  useEffect(() => {
    if (manager) {
      setFormData(manager);
    }
  }, [manager]);
  const fetchManagers = async () => {
    const res = await api.get("/managers");
    setManagers(res.data);
  };
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const oldUsername = manager.username;
    const name = formData.name;
    const phone = formData.phone;
    const woreda = formData.woreda;
    const email = formData.email;
    const region = formData.region;
    const zone = formData.zone;
    const username = formData.username;
    const status = formData.status;

    try {
      const res = await api
        .put(`/managers/${oldUsername}`, {
          name,
          phone,
          email,
          region,
          zone,
          woreda,
          username, // ✅ the new username
          status,
        })
        .then((res) => {
          toast.success("manager updated succcessfully");
        })
        .catch((err) => {
          console.error("Update failed", err);
        });
      //   onSubmit(res.data);
      onOpenChange(false);
      // After submit
      await fetchManagers();
    } catch (error) {
      console.error("Failed:", error);
      alert("Something went wrong.");
    }
  };

  // Early return if no manager selected
  if (!manager) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit {manager.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="grid gap-1">
              <label className="text-sm font-medium capitalize">{key}</label>
              <Input
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full"
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="text-lg cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="text-lg px-6 py-1 cursor-pointer">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
