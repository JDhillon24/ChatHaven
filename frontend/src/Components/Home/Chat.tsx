import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useContext, SetStateAction } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { PiListDashesBold } from "react-icons/pi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { SocketContext } from "../../context/SocketProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

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

type ChatProps = {
  onBack: () => void;
  onShowInfo: () => void;
  isActive: boolean;
  room: RoomType | undefined;
  setRoom: React.Dispatch<React.SetStateAction<RoomType | undefined>>;
  setMessageReceived: React.Dispatch<SetStateAction<boolean>>;
};

const Chat: React.FC<ChatProps> = ({
  onBack,
  onShowInfo,
  isActive,
  room,
  setRoom,
  setMessageReceived,
}) => {
  //ref to track the bottom of the messages so page can auto scroll to bottom on new messages
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error("SocketContext must be used within a provider!");
  }

  const { socket } = socketContext;

  // returns the other participant in a 2 person group chat
  const privateChatName = (participants: UserType[] | undefined): UserType => {
    if (participants) {
      const filteredParticipant = participants.filter(
        (p) => p.name !== auth.user?.name
      );

      return filteredParticipant[0];
    } else {
      const noParticipant = { _id: "", name: "", profilePicture: "" };
      return noParticipant;
    }
  };

  const readAllMessages = async (id: string) => {
    await axiosPrivate.put(`/chat/readall/${id}`);
  };

  //auto scrolls to bottom on every new message
  useEffect(() => {
    if (isActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }

    if (room) {
      readAllMessages(room._id);
      setMessageReceived((prev) => !prev);
    }
  }, [isActive, room]);

  useEffect(() => {
    if (!room || !socket) return;

    // adds user to socket room
    socket.emit("joinRoom", { email: auth.user?.email, roomId: room._id });

    // reads new message and adds new message to state
    socket.on("newMessage", (msg) => {
      readAllMessages(room._id);
      setRoom((prevRoom) => ({
        ...prevRoom!,
        messages: [...(prevRoom?.messages || []), msg],
      }));
    });

    return () => {
      socket.off("newMessage");
    };
  }, [room, socket]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !room) return;

    socket.emit("sendMessage", {
      roomId: room._id,
      email: auth.user?.email,
      text: message,
    });
    setMessage("");
  };

  return (
    <div className="relative h-full w-full border-r-2 border-gray-200">
      <div className="h-20 flex border-b-2 border-gray-200">
        <div className="w-full flex justify-between items-center px-4">
          {/* MOBILE ONLY: Takes user back to conversations section and clears room id in local storage and location state */}
          <div
            onClick={() => {
              onBack();
              localStorage.setItem("roomId", "");
              navigate("/Home", { replace: true, state: {} });
            }}
            className="lg:hidden"
          >
            <FaArrowLeft size={24} />
          </div>

          {/* If room is a group, the room name and group icon is displayed. If not, the other participants name and profile picture is displayed. */}
          <div className="flex gap-3 items-center">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-xl ml-6">
              <img
                className="rounded-xl"
                src={
                  room?.isGroup
                    ? "/images/pfp/group-icon.jpg"
                    : privateChatName(room?.participants).profilePicture
                }
                alt="Profile"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-md font-semibold">
                {room?.isGroup
                  ? room?.name
                  : privateChatName(room?.participants).name}
              </p>
            </div>
          </div>
          <div onClick={onShowInfo} className="lg:hidden">
            <PiListDashesBold size={24} />
          </div>
        </div>
      </div>
      <div className="flex-1 mx-8 mt-5 mb-5 overflow-y-auto max-h-[calc(100vh-260px)] chat-container">
        <div className="w-3/4 mx-auto">
          {/* Name and Picture to denote start of conversation */}
          <div className="flex flex-col justify-center items-center text-center">
            <img
              className="h-32 w-32 rounded-xl"
              src={
                room?.isGroup
                  ? "/images/pfp/group-icon.jpg"
                  : privateChatName(room?.participants).profilePicture
              }
              alt="Profile"
            />
            <p className="text-lg font-semibold">
              {room?.isGroup
                ? room?.name
                : privateChatName(room?.participants).name}
            </p>
            <p className="text-sm font-light text-gray-400">
              This is the start of your conversation, say hi and keep the chat
              going!
            </p>
          </div>
        </div>
        <div className="mt-5">
          {room?.messages &&
            room.messages.map((item, index, arr) => {
              if (item.sender_type === "System") {
                // Displays a small message in the middle if the user is added to or leaves the room, or if the room name is changed
                return (
                  <div
                    key={index}
                    className="relative flex justify-center items-center mb-4 mx-2"
                  >
                    <span className="flex-grow border-t border-gray-200 mr-2 min-w-[20%]"></span>
                    <p className="text-sm font-light text-gray-400 text-center">
                      {item.text}
                    </p>
                    <span className="flex-grow border-t border-gray-200 ml-2 min-w-[20%]"></span>
                  </div>
                );
              } else {
                const prev = index > 0 ? arr[index - 1] : null;
                const isUserMessage = item.sender?.name === auth.user?.name;
                const sameUserMessage =
                  item.sender?.name === prev?.sender?.name;

                // Message formatting depending on if its a user or non-user message, or if they've sent multiple messages in a row
                if (isUserMessage) {
                  if (sameUserMessage) {
                    return (
                      <div
                        key={index}
                        className="flex items-end gap-2 mb-4 justify-end mr-12"
                      >
                        <div className="bg-ChatBlue p-3 rounded-lg text-white text-sm md:max-w-80 max-w-64 break-words">
                          {item.text}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-end">
                          <p className="text-sm font-light text-gray-400 mr-12">
                            {item.sender?.name}
                          </p>
                        </div>
                        <div className="flex items-end gap-2 mb-4 justify-end">
                          <div className="bg-ChatBlue p-3 rounded-lg text-white text-sm md:max-w-80 max-w-64 break-words">
                            {item.text}
                          </div>
                          <img
                            className="h-10 w-10 rounded-xl"
                            src={item.sender?.profilePicture}
                            alt="Profile"
                          />
                        </div>
                      </div>
                    );
                  }
                } else {
                  if (sameUserMessage) {
                    return (
                      <div
                        key={index}
                        className="flex items-end gap-2 mb-4 ml-12"
                      >
                        <div className="bg-gray-200 p-3 rounded-lg text-sm md:max-w-80 max-w-64 break-words">
                          {item.text}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="flex flex-col">
                        <div className="flex">
                          <p className="text-sm font-light text-gray-400 ml-12">
                            {item.sender?.name}
                          </p>
                        </div>
                        <div className="flex items-end gap-2 mb-4">
                          <img
                            className="h-10 w-10 rounded-xl"
                            src={item.sender?.profilePicture}
                            alt="Profile"
                          />
                          <div className="bg-gray-200 p-3 rounded-lg text-sm md:max-w-80 max-w-64 break-words">
                            {item.text}
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              }
            })}
        </div>
        <div ref={messagesEndRef}></div>
      </div>

      {/* textarea with send button for typing and sending messages */}
      <div className="absolute bottom-0 w-full mb-5">
        <div className="flex items-end ml-8">
          <textarea
            placeholder="Send a message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            className="w-full rounded-lg border-gray-200 border-2 placeholder:text-sm pr-10 resize-none md:max-h-32 max-h-32 p-2"
          />
          <span className="cursor-pointer -translate-x-10 pb-2">
            <div
              onClick={sendMessage}
              className="transition-all hover:bg-ChatBlue p-1 rounded-full"
            >
              <IoSend
                size={20}
                className="text-ChatBlue hover:text-white transition-all"
              />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
