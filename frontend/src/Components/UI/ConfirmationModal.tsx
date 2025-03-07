import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import ModalBoilerplate from "./ModalBoilerplate";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onChange: () => void;
  text: string;
};

const ConfirmationModal: React.FC<ModalProps> = ({
  open,
  onClose,
  onChange,
  text,
}) => {
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="text-center w-56">
        <FaInfoCircle size={56} className="mx-auto text-ChatBlue" />
        <div className="mx-auto my-4 w-48">
          <h3 className="text-lg font-black text-gray-800">Confirm</h3>
          <p className="text-sm text-gray-500">{text}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onChange}
            className="bg-gray-300 hover:bg-gray-200 text-black font-bold py-2 px-6 rounded-full cursor-pointer"
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-200 text-black font-bold py-2 px-6 rounded-full cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalBoilerplate>
  );
};

export default ConfirmationModal;
