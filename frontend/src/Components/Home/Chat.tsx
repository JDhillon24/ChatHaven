import { FaCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { PiListDashesBold } from "react-icons/pi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

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
};

const Chat: React.FC<ChatProps> = ({ onBack, onShowInfo, isActive, room }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();

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

  useEffect(() => {
    if (isActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [isActive, room]);
  return (
    <div className="relative h-full w-full border-r-2 border-gray-200">
      <div className="h-20 flex border-b-2 border-gray-200">
        <div className="w-full flex justify-between items-center px-4">
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
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
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
          ))}
        </div>
        <div ref={messagesEndRef}></div>
      </div>
      <div className="absolute bottom-0 w-full mb-5">
        <div className="flex items-end ml-8">
          <textarea
            placeholder="Send a message"
            rows={2}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            className="w-full rounded-lg border-gray-200 border-2 placeholder:text-sm pr-10 resize-none md:max-h-40 max-h-32 p-2"
          />
          <span className="cursor-pointer -translate-x-10 pb-2">
            <div className="transition-all hover:bg-ChatBlue p-1 rounded-full">
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
