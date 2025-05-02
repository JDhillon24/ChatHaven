import {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
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

//used to track the active section on mobile
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
  const isMobile = useIsMobile(1024);

  //state variables for modals
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openLeaveRoom, setOpenLeaveRoom] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  //state variable for selecting the current room
  const [rooms, setRooms] = useState<RoomType | undefined>(undefined);
  const [messageReceived, setMessageReceived] = useState(false);

  const [loading, setLoading] = useState(false);

  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error("SocketContext must be used within a provider!");
  }

  const { socket } = socketContext;

  useEffect(() => {
    document.title = "Home | ChatHaven";
  }, [location.pathname]);

  //storing the active section in local storage and in state
  const storageSection =
    (localStorage.getItem("activeSection") as Section) || "conversations";
  const [activeSection, setActiveSection] = useState<Section>(storageSection);

  const prevSectionRef = useRef<string>("conversations");

  //state variable used to trigger auto scroll to bottom
  const [isChatActive, setIsChatActive] = useState(
    localStorage.getItem("activeSection") === "chat"
  );

  //sets new section in local storage and state
  const handleSectionChange = (section: Section) => {
    prevSectionRef.current = activeSection;
    localStorage.setItem("activeSection", section);
    const newSection = localStorage.getItem("activeSection") as Section;
    setActiveSection(newSection);

    if (section === "chat") {
      setIsChatActive(true);
    } else {
      setIsChatActive(false);
    }

    //clears room if user leaves room section
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
        //clears room id and location state on invalid room id
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

  //sets room id if user clicks on the message button next to another user in their friends list
  useEffect(() => {
    if (privateChat) {
      handleSectionChange("chat");
      navigate(location.pathname, { replace: true, state: { roomId: roomId } });
    }
  }, [location.pathname]);

  //handles modal behaviours on certain actions
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

  //handles closing the success modal
  const handleSuccessClose = () => {
    setOpenSuccess(false);

    //clears all location state but retains room id if one is selected
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

  const getSlideDirection = () => {
    const prevSection = prevSectionRef.current;

    if (!prevSection) return "none"; // Handle the first render case

    if (prevSection === "conversations" && activeSection === "chat") {
      return "100%"; // slide in from the right
    } else if (prevSection === "chat" && activeSection === "info") {
      return "100%"; // slide in from the right
    } else if (prevSection === "chat" && activeSection === "conversations") {
      return "-100%"; // slide in from the left
    } else if (prevSection === "info" && activeSection === "chat") {
      return "-100%"; // slide in from the left
    }

    return "0%"; // default (no animation, or handle it separately)
  };

  return (
    <div className="w-full flex h-screen [@supports(height:100dvh)]:h-[100dvh] overflow-hidden">
      {/* sidebar (placed above main content, and hidden when clicking a room on mobile) */}
      <div
        className={`${
          activeSection === "conversations" ? "" : "hidden"
        } lg:flex z-10`}
      >
        <Sidebar index={0} />
      </div>

      {/* sections including list of rooms, selected room, and info for participant list and room actions. conditionally rendered one at a time on mobile and all sections appear on desktop */}
      <div
        className={`lg:ml-24 ${
          activeSection === "conversations" ? "ml-18" : ""
        } flex-1 flex z-0`}
      >
        <div
          className={`grid lg:grid-cols-4 ${
            activeSection === "chat" ? "grid-cols-2" : "grid-cols-1"
          } w-full`}
        >
          {/* Show all sections desktop */}
          {!isMobile && (
            <>
              <div
                className={`flex flex-col h-screen [@supports(height:100dvh)]:h-[100dvh]`}
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
                    className={`flex flex-col col-span-2 h-screen [@supports(height:100dvh)]:h-[100dvh]`}
                  >
                    <motion.div
                      className="w-full h-full"
                      key="chat"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{
                        duration: 0.15,
                        ease: "easeOut",
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
                    className={`flex flex-col h-screen [@supports(height:100dvh)]:h-[100dvh]`}
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
            </>
          )}

          {/* show one section at a time on mobile */}
          {isMobile && (
            <AnimatePresence mode="wait">
              {activeSection === "conversations" && (
                <div
                  className={`flex flex-col h-screen [@supports(height:100dvh)]:h-[100dvh]`}
                >
                  <Conversations
                    onSelect={() => handleSectionChange("chat")}
                    onOpen={() => setOpenCreateRoom(true)}
                    openSuccess={openSuccess}
                    messageReceived={messageReceived}
                  />
                </div>
              )}
              {activeSection === "chat" &&
                (roomId || localStorage.getItem("roomId")) && (
                  <motion.div
                    key="chat"
                    initial={{ x: getSlideDirection() }}
                    animate={{ x: "0%" }}
                    exit={{
                      x:
                        prevSectionRef.current === "conversations"
                          ? "100%"
                          : "-100%",
                    }}
                    transition={{
                      duration: 0.15,
                      ease: "easeInOut",
                    }}
                    className={`flex flex-col col-span-2 h-screen [@supports(height:100dvh)]:h-[100dvh]`}
                  >
                    {!loading ? (
                      <div className="w-full h-full">
                        <Chat
                          onBack={() => handleSectionChange("conversations")}
                          onShowInfo={() => handleSectionChange("info")}
                          isActive={isChatActive}
                          room={rooms}
                          setRoom={setRooms}
                          setMessageReceived={setMessageReceived}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex justify-center items-center col-span-3">
                        <Spinner />
                      </div>
                    )}
                  </motion.div>
                )}
              {activeSection === "info" && (
                <motion.div
                  initial={{ x: getSlideDirection() }}
                  animate={{ x: "0%" }}
                  exit={{
                    x:
                      prevSectionRef.current === "conversations"
                        ? "100%"
                        : "-100%",
                  }}
                  transition={{
                    duration: 0.15,
                    ease: "easeInOut",
                  }}
                  key="info"
                  className={`flex flex-col h-screen [@supports(height:100dvh)]:h-[100dvh]`}
                >
                  <div className="w-full h-full">
                    <Info
                      onBack={() => handleSectionChange("chat")}
                      onOpenLeave={() => setOpenLeaveRoom(true)}
                      onOpenEdit={() => setOpenEditRoom(true)}
                      participants={rooms?.participants}
                      onOpenError={() => setOpenError(true)}
                      setErrorText={setErrorText}
                      onOpenSuccess={handleAddFriendSuccess}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* modals (placed on top of all components) */}
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
