import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import ModalBoilerplate from "./ModalBoilerplate";

type SuccessProps = {
  open: boolean;
  onClose: () => void;
  text: string;
};

const SuccessModal: React.FC<SuccessProps> = ({ open, onClose, text }) => {
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="text-center w-56">
        <FaCheckCircle size={56} className="mx-auto text-green-500" />
        <div className="mx-auto my-4 w-48">
          <h3 className="text-lg font-black text-gray-800">Success</h3>
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

export default SuccessModal;
