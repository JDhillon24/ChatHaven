import { IoMdAdd } from "react-icons/io";
import { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../UI/Spinner";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import { SocketContext } from "../../context/SocketProvider";

type ConversationProps = {
  onSelect: () => void;
  onOpen: () => void;
  openSuccess: boolean;
  messageReceived: boolean;
};

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
  name: string | null;
  participants: UserType[];
  messages: MessageType[];
};

const Conversations: React.FC<ConversationProps> = ({
  onSelect,
  onOpen,
  openSuccess,
  messageReceived,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<RoomType[]>([]);
  const [search, setSearch] = useState("");
  const { auth } = useAuth();
  const socketContext = useContext(SocketContext);

  const [loading, setLoading] = useState(true);

  if (!socketContext) {
    throw new Error("SocketContext must be used within a provider!");
  }

  const { socket } = socketContext;

  const { roomId = localStorage.getItem("roomId") } = location.state || {};

  // Returns the name of the other participant in a 2 person chat
  const privateChatName = (participants: UserType[]): UserType => {
    const filteredParticipant = participants.filter(
      (p) => p.name !== auth.user?.name
    );

    return filteredParticipant[0];
  };

  //function to return time since a message has been sent in the format "1m", "1h", or "1d" depending on how much time has passed
  const timeSince = (datetimeUTC: string): string => {
    const now = new Date();
    const past = new Date(datetimeUTC);

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minutes = Math.round(diffInSeconds / 60);
    const hours = Math.round(diffInSeconds / 3600);
    const days = Math.round(diffInSeconds / 86400);

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  //retrieves list of rooms with an optional search parameter
  const getData = async () => {
    try {
      const searchParam = search.trim();
      const response = await axiosPrivate.get(
        `/chat/getallrooms?search=${searchParam}`
      );

      setData(response.data);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getData().finally(() => setLoading(false));
  }, [search, openSuccess]);

  useEffect(() => {
    getData();
  }, [messageReceived]);

  //updates list of conversations everytime a message is sent in one of the users participating rooms
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessageNotification", (message) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(message);
      }

      getData();
    });

    return () => {
      socket.off("newMessageNotification");
    };
  }, [socket]);

  //function to check if the user is contained within a messages "read" list
  const isMessageRead = (message: MessageType): boolean => {
    return message.read.some((user) => user.name === auth.user?.name);
  };

  //sets new room id in local storage and location state
  const handleConvoSelect = (roomId: string) => {
    localStorage.setItem("roomId", roomId);
    navigate("/Home", { state: { roomId } });
  };
  return (
    <div className="h-full w-full border-r-2 border-gray-200">
      <div className="h-24 w-full flex justify-between items-center border-b-2 border-gray-200">
        <p className="text-xl font-semibold md:ml-8 ml-4">Messages</p>
        <div
          onClick={onOpen}
          className="h-8 w-8 md:mr-8 mr-4 rounded-full bg-ChatBlue flex justify-center items-center text-white cursor-pointer hover:bg-ChatBlueLight"
        >
          <IoMdAdd size={20} />
        </div>
      </div>
      <div className="mt-3 md:ml-8 md:mr-8 ml-4 mr-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Messages"
          className="w-full px-2 h-10 rounded-lg bg-gray-200 border-none placeholder:text-sm placeholder:text-center"
        />
        {loading ? (
          <div className="mt-3 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-3 flex-1 max-h-[calc(100vh-160px)] overflow-y-auto">
            {data.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  onSelect();
                  handleConvoSelect(item._id);
                }}
                className={`flex justify-between hover:bg-gray-100 ${
                  roomId && roomId === item._id ? "bg-gray-100" : ""
                } p-3 rounded-xl cursor-pointer overflow-x-hidden`}
              >
                {/* If the room is a group display the room name and default group icon, if not display the other participants name and profile picture */}
                {item.isGroup ? (
                  <div className="w-full flex justify-between">
                    <div className="flex">
                      <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                        <img
                          className="rounded-xl"
                          src="/images/pfp/group-icon.jpg"
                          alt="Profile"
                        />
                      </div>
                      <div className="ml-4 flex flex-col">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p
                          className={`text-xs truncate lg:max-w-64 max-w-32  ${
                            item.messages.length > 0 &&
                            !isMessageRead(item.messages[0])
                              ? "font-semibold text-gray-black"
                              : "font-light text-gray-400"
                          }`}
                        >
                          {item.messages.length === 0
                            ? "Start chatting now!"
                            : item.messages[0].sender
                            ? `${item.messages[0].sender?.name}: ${item.messages[0].text}`
                            : `${item.messages[0].text}`}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-start ${
                        item.messages.length === 0 ? "hidden" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          <p
                            className={`text-sm ${
                              item.messages.length > 0 &&
                              !isMessageRead(item.messages[0])
                                ? "font-semibold text-gray-black"
                                : "font-light text-gray-400"
                            }`}
                          >
                            {item.messages.length !== 0
                              ? timeSince(item.messages[0].timestamp)
                              : ""}
                          </p>
                        </div>
                        <div
                          className={`text-red-500 ${
                            item.messages.length > 0 &&
                            isMessageRead(item.messages[0])
                              ? "hidden"
                              : ""
                          }`}
                        >
                          <FaCircle />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-between">
                    <div className="flex">
                      <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                        <img
                          className="rounded-xl"
                          src={
                            privateChatName(item.participants).profilePicture
                          }
                          alt="Profile"
                        />
                      </div>
                      <div className="ml-4 flex flex-col">
                        <p className="text-sm font-semibold">
                          {privateChatName(item.participants).name}
                        </p>
                        <p
                          className={`text-xs truncate lg:max-w-64 max-w-32 ${
                            item.messages.length > 0 &&
                            !isMessageRead(item.messages[0])
                              ? "font-semibold text-gray-black"
                              : "font-light text-gray-400"
                          }`}
                        >
                          {item.messages.length === 0
                            ? "Start chatting now!"
                            : item.messages[0].text}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-start ${
                        item.messages.length === 0 ? "hidden" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          <p
                            className={`text-sm ${
                              item.messages.length > 0 &&
                              !isMessageRead(item.messages[0])
                                ? "font-semibold text-gray-black"
                                : "font-light text-gray-400"
                            }`}
                          >
                            {item.messages.length !== 0
                              ? timeSince(item.messages[0].timestamp)
                              : ""}
                          </p>
                        </div>
                        <div
                          className={`text-red-500 ${
                            item.messages.length > 0 &&
                            isMessageRead(item.messages[0])
                              ? "hidden"
                              : ""
                          }`}
                        >
                          <FaCircle />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
