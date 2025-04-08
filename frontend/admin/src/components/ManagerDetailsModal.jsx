import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { IoMdClose } from "react-icons/io";

import { Button } from "@/components/ui/button";

export function ManagerDetailsModal({ manager, open, onOpenChange }) {
  if (!manager) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-2xl">
        <div className="relative flex justify-between items-start">
          <DialogHeader>
            <DialogTitle className="text-3xl">{manager.name}</DialogTitle>
            <DialogDescription className="text-lg">
              Details about {manager.name}
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            asChild
            className="absolute right-0 flex justify-start rounded-sm"
          >
            <Button variant="ghost" className="cursor-pointer">
              <IoMdClose size={30} />
            </Button>
          </DialogClose>
        </div>

        <div className="grid gap-6 mt-4">
          {Object.entries(manager).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between border-b pb-2 text-lg sm:text-lg"
            >
              <span className="font-medium capitalize text-muted-foreground">
                {key}
              </span>
              <span className="text-right break-words max-w-[60%]">
                {typeof value === "string" && value.length > 100
                  ? `${value.slice(0, 100)}...`
                  : String(value)}
              </span>
            </div>
          ))}
        </div>
        <DialogClose asChild className="w-[20%] flex justify-start">
          <Button
            variant="ghost"
            className="cursor-pointer inline-block hover:border hover:shadow-md hover:border-gray-500 px-4 bg-indigo-950 text-white text-lg p-1 rounded-md transition-all duration-300"
          >
            close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
