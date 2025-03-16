import React from "react";

type Props = {
  onClose: () => void;
  handleSuccess: () => void;
  roomName: string | null | undefined;
};

const EditName: React.FC<Props> = () => {
  return <div>EditName</div>;
};

export default EditName;
