import React from "react";
import { IoMdClose } from "react-icons/io";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const ModalBoilerplate: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    // slightly translucent black background across whole page, clicking anywhere outside modal closes it
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      {/* Basic modal shape with close button, open and close animations */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600 cursor-pointer"
        >
          <IoMdClose />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalBoilerplate;
