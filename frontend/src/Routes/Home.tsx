import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
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
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const location = useLocation();

  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openLeaveRoom, setOpenLeaveRoom] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [rooms, setRooms] = useState<RoomType | undefined>(undefined);
  const [messageReceived, setMessageReceived] = useState(false);

  useEffect(() => {
    document.title = "Home | ChatHaven";
  }, [location.pathname]);

  // const [socket, setSocket] = useState<Socket | null>(null);
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
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axiosPrivate.get("/user/search", {
        params: {
          name: "J",
        },
      });
      console.log(response.data);
    };
    console.log(auth);

    // getData();
  }, []);

  // useEffect(() => {
  //   const newSocket = io("http://localhost:5000", {
  //     withCredentials: true,
  //     transports: ["websocket"],
  //   });

  //   setSocket(newSocket);

  //   newSocket.on("connect", () => {
  //     console.log("Connected to server:", newSocket.id);
  //   });

  //   newSocket.on("connect_error", (err) => {
  //     console.error("Connection failed:", err);
  //   });

  //   newSocket.on("disconnect", (reason) => {
  //     console.log("Disconnected:", reason); // Connection lost details
  //   });

  //   // Cleanup function to prevent duplicate connections
  //   return () => {
  //     newSocket.disconnect();
  //     console.log("socket disconnected on unmount");
  //   };
  // }, []);

  const { roomId = localStorage.getItem("roomId"), privateChat } =
    location.state || {};

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosPrivate.get(`/chat/${roomId}`);
        setRooms(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (roomId) {
      getData();
    }
  }, [roomId, openSuccess]);

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
    <div className="w-full flex h-screen overflow-hidden">
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
        <div
          className={`grid lg:grid-cols-4 ${
            activeSection === "chat" ? "grid-cols-2" : "grid-cols-1"
          } w-full`}
        >
          <div
            className={`flex flex-col h-screen ${
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
          {roomId || localStorage.getItem("roomId") ? (
            <>
              <div
                className={`flex flex-col col-span-2 h-screen ${
                  activeSection === "chat" ? "" : "hidden"
                } lg:flex`}
              >
                <Chat
                  onBack={() => handleSectionChange("conversations")}
                  onShowInfo={() => handleSectionChange("info")}
                  isActive={isChatActive}
                  room={rooms}
                  setMessageReceived={setMessageReceived}
                />
              </div>
              <div
                className={`flex flex-col h-screen ${
                  activeSection === "info" ? "" : "hidden"
                } lg:flex`}
              >
                <Info
                  onBack={() => handleSectionChange("chat")}
                  onOpenLeave={() => setOpenLeaveRoom(true)}
                  onOpenEdit={() => setOpenEditRoom(true)}
                  participants={rooms?.participants}
                />
              </div>
            </>
          ) : (
            <NoConvoSelected />
          )}
        </div>
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
    </div>
  );
};

export default Home;
