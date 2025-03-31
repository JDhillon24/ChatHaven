import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaExclamationCircle } from "react-icons/fa";
import ModalBoilerplate from "../UI/ModalBoilerplate";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  handleResend: () => void;
  text: string;
};

const VerifyFailedModal: React.FC<ModalProps> = ({
  open,
  onClose,
  text,
  handleResend,
}) => {
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="text-center w-56">
        <FaExclamationCircle size={56} className="mx-auto text-yellow-400" />
        <div className="mx-auto my-4 w-48">
          <p className="text-md font-black text-gray-800">
            Verification Failed
          </p>
          <p className="text-sm-text-gray-500">{text}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleResend}
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

export default VerifyFailedModal;
