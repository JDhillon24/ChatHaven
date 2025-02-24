import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaExclamationCircle } from "react-icons/fa";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  text: string;
};

const ErrorModal: React.FC<ModalProps> = ({ open, onClose, text }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
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
        <div className="text-center w-56">
          <FaExclamationCircle size={56} className="mx-auto text-yellow-400" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Error</h3>
            <p className="text-sm text-gray-500">{text}</p>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-gray-300 hover:bg-gray-200 text-black font-bold py-2 px-6 rounded-full cursor-pointer"
              onClick={onClose}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
