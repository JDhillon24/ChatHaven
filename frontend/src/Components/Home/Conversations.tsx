import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { FaUserGroup } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type ConversationProps = {
  onSelect: () => void;
  onOpen: () => void;
  openSuccess: boolean;
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

const Conversations: React.FC<ConversationProps> = ({ onSelect, onOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<RoomType[]>([]);
  const [search, setSearch] = useState("");
  const { auth } = useAuth();

  const { roomId } = location.state || {};
  const checkIfRead = (message: MessageType): boolean => {
    return message.read.some((m) => m.name === auth.user?.name);
  };

  const privateChatName = (participants: UserType[]): UserType => {
    const filteredParticipant = participants.filter(
      (p) => p.name !== auth.user?.name
    );

    return filteredParticipant[0];
  };

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
  useEffect(() => {
    const getData = async () => {
      try {
        const searchParam = search.trim();
        const response = await axiosPrivate.get(
          `/chat/getallrooms?search=${searchParam}`
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [search]);
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
        <div className="mt-3 flex-1 max-h-[calc(100vh-160px)] overflow-y-auto">
          {data.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                onSelect();
                navigate("/Home", { state: { roomId: item._id } });
              }}
              className={`flex justify-between hover:bg-gray-100 ${
                roomId && roomId === item._id ? "bg-gray-100" : ""
              } p-3 rounded-xl cursor-pointer`}
            >
              {item.isGroup ? (
                <div className="flex">
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
                      <p className={`text-xs font-light text-gray-400`}>
                        {item.messages.length === 0
                          ? "Start chatting now!"
                          : item.messages[0].text}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex ${
                      item.messages.length === 0 ? "hidden" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-400">
                      {item.messages.length !== 0
                        ? timeSince(item.messages[0].timestamp)
                        : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-between">
                  <div className="flex">
                    <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                      <img
                        className="rounded-xl"
                        src={privateChatName(item.participants).profilePicture}
                        alt="Profile"
                      />
                    </div>
                    <div className="ml-4 flex flex-col">
                      <p className="text-sm font-semibold">
                        {privateChatName(item.participants).name}
                      </p>
                      <p className="text-xs font-light text-gray-400">
                        {item.messages.length === 0
                          ? "Start chatting now!"
                          : item.messages[0].text}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex ${
                      item.messages.length === 0 ? "hidden" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-400">
                      {item.messages.length !== 0
                        ? timeSince(item.messages[0].timestamp)
                        : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
