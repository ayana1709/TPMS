import { ManagerTable } from "@/components/ManagerTable";

function ViewManagers() {
  return (
    <div>
      <div className="max-w-[98%] mx-auto">
        <h2 className="text-gray-800 py-6 dark:text-gray-200 text-2xl uppercase font-semibold tracking-[12px] text-center">
          managers
        </h2>
        <ManagerTable />
      </div>
    </div>
  );
}

export default ViewManagers;
