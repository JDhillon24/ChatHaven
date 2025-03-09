import { useState } from "react";
import ModalBoilerplate from "../UI/ModalBoilerplate";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const CreateRoomModal: React.FC<ModalProps> = ({ open, onClose }) => {
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="text-center w-56"></div>
    </ModalBoilerplate>
  );
};

export default CreateRoomModal;
