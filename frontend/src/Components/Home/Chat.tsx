import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useContext, SetStateAction } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { PiListDashesBold } from "react-icons/pi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { SocketContext } from "../../context/SocketProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { motion } from "framer-motion";
import useIsMobile from "../../hooks/useIsMobile";

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // const [messages, setMessages] = useState(room?.messages);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const isMobile = useIsMobile();
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error("SocketContext must be used within a provider!");
  }

  const { socket } = socketContext;

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
    // console.log(response.data);
    // setMessageReceived((prev) => !prev);
  };

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
    // console.log(`socketId: ${socket.id}`);
    // console.log(`State: ${roomId}, API: ${room._id}`);
    // if (room._id === roomId) {

    // } else {
    //   setMessages(room.messages);
    // }

    // setMessages(room.messages);
    socket.emit("joinRoom", { email: auth.user?.email, roomId: room._id });
    // setRoomId(room._id);

    socket.on("newMessage", (msg) => {
      // console.log("received message");
      readAllMessages(room._id);
      setRoom((prevRoom) => ({
        ...prevRoom!,
        messages: [...(prevRoom?.messages || []), msg],
      }));
      // setMessages((prev) => [...(prev || []), msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [room, socket]);

  const sendMessage = () => {
    // console.log(`socketId: ${socket?.id}`);
    if (!message.trim() || !socket || !room) return;
    // console.log("socket does run");

    socket.emit("sendMessage", {
      roomId: room._id,
      email: auth.user?.email,
      text: message,
    });
    setMessage("");
  };

  return (
    <motion.div
      // animate={{
      //   x: ["100%", "0%"],
      // }}
      // transition={{
      //   duration: 0.15,
      //   ease: "easeInOut",
      // }}
      key="chat"
      initial={isMobile ? { x: "100%" } : { scale: 0.95, opacity: 0 }}
      animate={isMobile ? { x: "0%" } : { scale: 1, opacity: 1 }}
      exit={isMobile ? { x: "100%" } : { scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.15, ease: isMobile ? "easeInOut" : "easeOut" }}
      className="relative h-full w-full border-r-2 border-gray-200"
    >
      <div className="h-20 flex border-b-2 border-gray-200">
        <div className="w-full flex justify-between items-center px-4">
          <div
            onClick={() => {
              onBack();
              // setRoomId("");
              localStorage.setItem("roomId", "");
              navigate("/Home", { replace: true, state: {} });
            }}
            className="lg:hidden"
          >
            <FaArrowLeft size={24} />
          </div>
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
          {/* {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <div className="flex flex-col">
                <div className="flex">
                  <p className="text-sm font-light text-gray-400 ml-12">
                    zoro123
                  </p>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <img
                    className="h-10 w-10 rounded-xl"
                    src="/images/pfp/cool-anime-pfp-07.jpg"
                    alt="Profile"
                  />
                  <div className="bg-gray-200 p-3 rounded-lg text-sm md:max-w-80 max-w-64 break-words">
                    Yea brooo i told
                    usdfsfddsfsdfsdfsdfsdfsdfsdfsdfsdfsdfdsfsdfsdfdsasdfdsfasdsadaskjlkjljkljl
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-end">
                  <p className="text-sm font-light text-gray-400 mr-12">
                    zoro123
                  </p>
                </div>
                <div className="flex items-end gap-2 mb-4 justify-end">
                  <div className="bg-ChatBlue p-3 rounded-lg text-white text-sm md:max-w-80 max-w-64 break-words">
                    Yea brooo i told
                    usdfsfddsfsdfsdfsdfsdfsdfsdfsdfsdfsdfdsfsdfsdfdsasdfdsfasdsadaskjlkjljkljl
                  </div>
                  <img
                    className="h-10 w-10 rounded-xl"
                    src="/images/pfp/cool-anime-pfp-07.jpg"
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-4 justify-end mr-12">
                <div className="bg-ChatBlue p-3 rounded-lg text-white text-sm md:max-w-80 max-w-64 break-words">
                  Yea brooo i told
                  usdfsfddsfsdfsdfsdfsdfsdfsdfsdfsdfsdfdsfsdfsdfdsasdfdsfasdsadaskjlkjljkljl
                </div>
              </div>
            </div>
          ))}
          <div className="relative flex justify-center items-center mb-4 mx-2">
            <span className="flex-grow border-t border-gray-200 mr-2"></span>
            <p className="text-sm font-light text-gray-400">
              zoro123 has left the room
            </p>
            <span className="flex-grow border-t border-gray-200 ml-2"></span>
          </div> */}
        </div>
        <div ref={messagesEndRef}></div>
      </div>
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
    </motion.div>
  );
};

export default Chat;
