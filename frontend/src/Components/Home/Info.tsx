import { HiDotsVertical } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { IoMdAdd } from "react-icons/io";
import useAuth from "../../hooks/useAuth";
import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";

type UserType = {
  _id: string;
  name: string;
  profilePicture: string;
};

type InfoProps = {
  onBack: () => void;
  participants: UserType[] | undefined;
  onOpenLeave: () => void;
  onOpenEdit: () => void;
  onOpenError: () => void;
  onOpenSuccess: () => void;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
};

const Info: React.FC<InfoProps> = ({
  onBack,
  participants,
  onOpenLeave,
  onOpenEdit,
  setErrorText,
  onOpenError,
  onOpenSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const [friends, setFriends] = useState<UserType[]>([]);
  const { auth } = useAuth();

  const isFriend = (participant: UserType): boolean => {
    return friends.some((friend) => friend._id === participant._id);
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axiosPrivate.get("/user/friends");
      setFriends(response.data);
    };

    getData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setTimeout(() => setIsOpen(false), 200);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendRequest = async (friend_id: string) => {
    try {
      await axiosPrivate.post(
        "/notifications/sendfriendrequest",
        JSON.stringify({
          receiverId: friend_id,
        })
      );
      onOpenSuccess();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorText(error.response?.data.message);
        onOpenError();
      }
    }
  };

  return (
    <motion.div
      animate={{
        x: ["100%", "0%"],
      }}
      transition={{
        duration: 0.15,
        ease: "easeInOut",
      }}
      className="relative h-full w-full"
    >
      <div className="h-20 flex w-full justify-between items-center border-b-2 border-gray-200 px-4">
        <div onClick={onBack} className="lg:hidden">
          <FaArrowLeft size={24} />
        </div>
        <p className="text-xl font-semibold">Info</p>
        <div
          ref={menuRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-8 w-8 rounded-full bg-ChatBlue flex justify-center items-center text-white cursor-pointer hover:bg-ChatBlueLight"
        >
          <HiDotsVertical size={20} />
        </div>
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ originX: 1, originY: 0 }}
              className="absolute top-14 right-8 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <ul className="py-1 text-sm text-gray-700">
                <li
                  onClick={onOpenEdit}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Edit Room
                </li>
                <li
                  onClick={onOpenLeave}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Leave Room
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 ml-4">
            <p className="text-sm font-semibold">Room Members</p>
            <p className="text-sm font-semibold py-1 px-2 rounded-xl bg-gray-200">
              {participants && participants.length}
            </p>
          </div>
          <div className="mt-3 ml-5 mr-5 flex flex-col">
            {participants?.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-100"
              >
                <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                  <img
                    className="rounded-xl"
                    src={item.profilePicture}
                    alt="Profile"
                  />
                </div>
                <p className="text-md font-semibold">{item.name}</p>
                <div
                  onClick={() => handleSendRequest(item._id)}
                  className={`h-8 w-8 rounded-full bg-gray-200 flex justify-center items-center text-ChatBlue cursor-pointer hover:bg-gray-300 ${
                    isFriend(item) || auth.user?.name == item.name
                      ? "hidden"
                      : ""
                  }`}
                >
                  <IoMdAdd size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Info;
