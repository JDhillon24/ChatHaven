import EditName from "../EditRoom/EditName";
import InviteMembers from "../EditRoom/InviteMembers";
import ModalBoilerplate from "../UI/ModalBoilerplate";

type UserType = {
  _id: string;
  name: string;
  profilePicture: string;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  handleEditNameSuccess: () => void;
  handleInviteMembersSuccess: () => void;
  roomName: string | undefined;
  participants: UserType[] | undefined;
};

const EditRoomModal: React.FC<ModalProps> = ({
  open,
  onClose,
  handleEditNameSuccess,
  handleInviteMembersSuccess,
  roomName,
  participants,
}) => {
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="text-center w-56">
        <p className="text-lg font-black text-gray-800">Edit Room</p>

        {/* Forms for editing the room name and inviting new members */}
        <div className="mt-5 flex flex-col gap-5">
          <EditName
            onClose={onClose}
            handleSuccess={handleEditNameSuccess}
            roomName={roomName}
          />
          <InviteMembers
            onClose={onClose}
            handleSuccess={handleInviteMembersSuccess}
            participants={participants}
          />
        </div>
      </div>
    </ModalBoilerplate>
  );
};

export default EditRoomModal;
