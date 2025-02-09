import { FaCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { PiListDashesBold } from "react-icons/pi";
import { useState } from "react";

type ChatProps = {
  onBack: () => void;
  onShowInfo: () => void;
  isActive: boolean;
};

const Chat: React.FC<ChatProps> = ({ onBack, onShowInfo, isActive }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [isActive]);
  return (
    <div className="relative h-full w-full border-r-2 border-gray-200">
      <div className="h-20 flex border-b-2 border-gray-200">
        <div className="w-full flex justify-between items-center px-4">
          <div onClick={onBack} className="lg:hidden">
            <FaArrowLeft size={24} />
          </div>
          <div className="flex gap-3">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-xl ml-6">
              <img
                className="rounded-xl"
                src="/images/pfp/cool-anime-pfp-07.jpg"
                alt="Profile"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-md font-semibold">Roronoa Zoro</p>
              <div className="flex items-center gap-1">
                <FaCircle className="text-green-500" size={9} />
                <p className="text-[10px] font-semibold text-gray-400">
                  Online
                </p>
              </div>
            </div>
          </div>
          <div onClick={onShowInfo} className="lg:hidden">
            <PiListDashesBold size={24} />
          </div>
        </div>
      </div>
      <div className="flex-1 mx-8 mt-5 mb-5 overflow-y-auto max-h-[calc(100vh-260px)] chat-container">
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
            className="w-full rounded-lg border-gray-200 placeholder:text-sm pr-10 resize-none md:max-h-40 max-h-36 p-2"
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
