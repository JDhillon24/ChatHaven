import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import ModalBoilerplate from "./ModalBoilerplate";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  text: string;
};

const ErrorModal: React.FC<ModalProps> = ({ open, onClose, text }) => {
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
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
    </ModalBoilerplate>
  );
};

export default ErrorModal;
