import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Conversations from "../Components/Home/Conversations";
import Chat from "../Components/Home/Chat";
import Info from "../Components/Home/Info";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CreateRoomModal from "../Components/Home/CreateRoomModal";
import SuccessModal from "../Components/UI/SuccessModal";
import NoConvoSelected from "../Components/Home/NoConvoSelected";
import LeaveRoomModal from "../Components/Home/LeaveRoomModal";
import { useNavigate } from "react-router-dom";
import EditRoomModal from "../Components/Home/EditRoomModal";
import { SocketContext } from "../context/SocketProvider";
import ErrorModal from "../Components/UI/ErrorModal";
import { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import Spinner from "../Components/UI/Spinner";
import { motion } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";

type Section = "conversations" | "chat" | "info";

type UserType = {
  _id: string;
  name: string;
  profilePicture: string;
};

type MessageType = {
  sender: UserType | null;
  sender_type: string;
  text: string;
  timestamp: string;
  read: UserType[];
};

type RoomType = {
  _id: string;
  isGroup: boolean;
  name: string | undefined;
  participants: UserType[];
  messages: MessageType[];
};

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const location = useLocation();
  const isMobile = useIsMobile();

  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openLeaveRoom, setOpenLeaveRoom] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [rooms, setRooms] = useState<RoomType | undefined>(undefined);
  const [messageReceived, setMessageReceived] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error("SocketContext must be used within a provider!");
  }

  const { socket } = socketContext;

  useEffect(() => {
    document.title = "Home | ChatHaven";
  }, [location.pathname]);

  const storageSection =
    (localStorage.getItem("activeSection") as Section) || "conversations";
  const [activeSection, setActiveSection] = useState<Section>(storageSection);
  const [isChatActive, setIsChatActive] = useState(
    localStorage.getItem("activeSection") === "chat"
  );

  const handleSectionChange = (section: Section) => {
    localStorage.setItem("activeSection", section);
    const activeSection = localStorage.getItem("activeSection") as Section;
    setActiveSection(activeSection);

    if (section === "chat") {
      setIsChatActive(true);
    } else {
      setIsChatActive(false);
    }

    if (section === "conversations") {
      setRooms(undefined);
    }
  };

  const { roomId = localStorage.getItem("roomId"), privateChat } =
    location.state || {};

  const getData = async () => {
    try {
      const response = await axiosPrivate.get(`/chat/${roomId}`);
      setRooms(response.data);
      // console.log(response.data.messages);
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          handleSectionChange("conversations");
          localStorage.setItem("roomId", "");
          navigate("/Home", { replace: true, state: {} });
        }
      }
    }
  };

  //multiple useEffects to only trigger spinner on room id change
  useEffect(() => {
    if (roomId) {
      setLoading(true);
      getData().finally(() => setLoading(false));
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      getData();
    }
  }, [openSuccess, socket]);

  useEffect(() => {
    if (privateChat) {
      handleSectionChange("chat");
      navigate(location.pathname, { replace: true, state: { roomId: roomId } });
    }
  }, [location.pathname]);

  const handleCreateRoomSuccess = () => {
    setSuccessText("You have successfully created a room!");
    setOpenSuccess(true);
  };

  const handleLeaveRoomSuccess = () => {
    setSuccessText("You have successfully left this room!");
    setOpenSuccess(true);
  };

  const handleEditNameSuccess = () => {
    setSuccessText("You have successfully changed the room name!");
    setOpenSuccess(true);
  };

  const handleInviteMembersSuccess = () => {
    setSuccessText(
      "The selected users have been successfully added to the room!"
    );
    setOpenSuccess(true);
  };

  const handleAddFriendSuccess = () => {
    setSuccessText("You have successfully sent a friend request!");
    setOpenSuccess(true);
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);

    if (localStorage.getItem("roomId")) {
      navigate(location.pathname, {
        replace: true,
        state: { roomId: roomId },
      });
    } else {
      handleSectionChange("conversations");
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  };

  return (
    <div className="w-full flex h-screen [@supports(height:100dvh)]:h-[100dvh] overflow-hidden">
      <div
        className={`${
          activeSection === "conversations" ? "" : "hidden"
        } lg:flex z-10`}
      >
        <Sidebar index={0} />
      </div>
      <div
        className={`lg:ml-24 ${
          activeSection === "conversations" ? "ml-18" : ""
        } flex-1 flex z-0`}
      >
        <AnimatePresence mode="wait">
          <div
            className={`grid lg:grid-cols-4 ${
              activeSection === "chat" ? "grid-cols-2" : "grid-cols-1"
            } w-full`}
          >
            <div
              className={`flex flex-col h-screen [@supports(height:100dvh)]:h-[100dvh] ${
                activeSection === "conversations" ? "" : "hidden"
              } lg:flex`}
            >
              <Conversations
                onSelect={() => handleSectionChange("chat")}
                onOpen={() => setOpenCreateRoom(true)}
                openSuccess={openSuccess}
                messageReceived={messageReceived}
              />
            </div>
            {(roomId || localStorage.getItem("roomId")) && !loading ? (
              <>
                <div
                  className={`flex flex-col col-span-2 h-screen [@supports(height:100dvh)]:h-[100dvh] ${
                    activeSection === "chat" ? "" : "hidden"
                  } lg:flex`}
                >
                  <motion.div
                    className="w-full h-full"
                    key="chat"
                    initial={
                      isMobile ? { x: "100%" } : { scale: 0.95, opacity: 0 }
                    }
                    animate={isMobile ? { x: "0%" } : { scale: 1, opacity: 1 }}
                    exit={
                      isMobile ? { x: "100%" } : { scale: 0.95, opacity: 0 }
                    }
                    transition={{
                      duration: 0.15,
                      ease: isMobile ? "easeInOut" : "easeOut",
                    }}
                  >
                    <Chat
                      onBack={() => handleSectionChange("conversations")}
                      onShowInfo={() => handleSectionChange("info")}
                      isActive={isChatActive}
                      room={rooms}
                      setRoom={setRooms}
                      setMessageReceived={setMessageReceived}
                    />
                  </motion.div>
                </div>
                <div
                  className={`flex flex-col h-screen [@supports(height:100dvh)]:h-[100dvh] ${
                    activeSection === "info" ? "" : "hidden"
                  } lg:flex`}
                >
                  <motion.div
                    className="w-full h-full"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    key="info"
                  >
                    <Info
                      onBack={() => handleSectionChange("chat")}
                      onOpenLeave={() => setOpenLeaveRoom(true)}
                      onOpenEdit={() => setOpenEditRoom(true)}
                      participants={rooms?.participants}
                      onOpenError={() => setOpenError(true)}
                      setErrorText={setErrorText}
                      onOpenSuccess={handleAddFriendSuccess}
                    />
                  </motion.div>
                </div>
              </>
            ) : loading ? (
              <div className="w-full h-full flex justify-center items-center col-span-3">
                <Spinner />
              </div>
            ) : (
              <NoConvoSelected />
            )}
          </div>
        </AnimatePresence>
      </div>
      <div className="z-20">
        <CreateRoomModal
          open={openCreateRoom}
          onClose={() => setOpenCreateRoom(false)}
          onOpenSuccess={handleCreateRoomSuccess}
        />
      </div>
      <div className="z-20">
        <SuccessModal
          open={openSuccess}
          onClose={handleSuccessClose}
          text={successText}
        />
      </div>
      <div className="z-20">
        <LeaveRoomModal
          open={openLeaveRoom}
          onClose={() => setOpenLeaveRoom(false)}
          onOpenSuccess={handleLeaveRoomSuccess}
        />
      </div>
      <div className="z-20">
        <EditRoomModal
          open={openEditRoom}
          onClose={() => setOpenEditRoom(false)}
          handleEditNameSuccess={handleEditNameSuccess}
          handleInviteMembersSuccess={handleInviteMembersSuccess}
          roomName={rooms?.name}
          participants={rooms?.participants}
        />
      </div>
      <div className="z-20">
        <ErrorModal
          open={openError}
          onClose={() => setOpenError(false)}
          text={errorText}
        />
      </div>
    </div>
  );
};

export default Home;
