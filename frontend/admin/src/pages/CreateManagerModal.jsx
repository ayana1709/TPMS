import { useStores } from "@/contexts/storeContext";
import { AiOutlineCloseSquare } from "react-icons/ai";

function CreateManagerModal() {
  const { isManagerSuccessModalOpen, setIsManagerSuccessModalOpen } =
    useStores();
  return (
    <div className="relative w-full">
      <div className="flex justify-center bg-gradient-to-r from-gray-950 to-blue-950 p-4 px-10 rounded-lg shadow-lg w-full text-center mt-10">
        <div>
          <img src="/images/admin.gif" className="w-40" />
        </div>
        <div className="p-4 pl-4 rounded-lg w-full text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-200 text-left">
            Manager Created!
          </h2>
          <p className="text-gray-200 mb-4 text-left">
            The manager has been registered successfully.
          </p>
        </div>
        <div
          onClick={() => setIsManagerSuccessModalOpen(false)}
          className="absolute z-[9999] right-6 top-4 cursor-pointer"
        >
          <AiOutlineCloseSquare size={30} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default CreateManagerModal;
