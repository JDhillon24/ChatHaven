import React from "react";
import ModalBoilerplate from "../UI/ModalBoilerplate";
import { IoExitOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onOpenSuccess: () => void;
};

const LeaveRoomModal: React.FC<ModalProps> = ({
  open,
  onClose,
  onOpenSuccess,
}) => {
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { roomId = localStorage.getItem("roomId") } = location.state || {};
  const handleConfirm = async () => {
    try {
      if (roomId) {
        const response = await axiosPrivate.delete(`/chat/leaveroom/${roomId}`);
        localStorage.setItem("roomId", "");
        onClose();
        onOpenSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="text-center w-56">
        <IoExitOutline
          size={56}
          className="mx-auto bg-red-500 rounded-full text-white p-2"
        />
        <div className="mx-auto my-4 w-48">
          <p className="text-lg font-black text-gray-800">Leave Room</p>
          <p className="text-sm text-gray-500">
            Are you sure you want to leave this room?
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleConfirm}
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

export default LeaveRoomModal;
