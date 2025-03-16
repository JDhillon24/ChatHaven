import React from "react";

type UserType = {
  _id: string;
  name: string;
  profilePicture: string;
};

type Props = {
  onClose: () => void;
  handleSuccess: () => void;
  participants: UserType[] | undefined;
};
const InviteMembers: React.FC<Props> = () => {
  return <div>InviteMembers</div>;
};

export default InviteMembers;
