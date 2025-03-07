import { useContext } from "react";
import { SocketContext } from "../context/SocketProvider";
import { AiOutlineHome } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { FC, useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import useSocket from "../hooks/useSocket";

interface SidebarProps {
  index: number;
}

const Sidebar: FC<SidebarProps> = ({ index }) => {
  const logout = useLogout();
  const [activeNavIndex, setActiveNavIndex] = useState(index);

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error("SocketContext must be used within a provider!");
  }

  const { hasNewNotification, setHasNewNotification } = socketContext;

  const signOut = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await logout();
    window.location.reload();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setTimeout(() => setIsOpen(false), 200);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeNavIndex === 2) {
      setHasNewNotification(false);
      localStorage.setItem("newNotification", "false");
    }
  }, [activeNavIndex]);

  return (
    <div className="md:w-24 w-18 fixed top-0 left-0 h-screen bg-white shadow-lg flex flex-col">
      <div className="h-screen flex flex-col items-center mt-2 gap-8 ">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center h-14 w-14 mt-2 mb-2 mx-auto rounded-xl">
            <img
              className="rounded-xl"
              src={auth.user?.profilePicture}
              alt="Profile"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <div
            onClick={() => navigate("/Home")}
            className={`sidebar-icon hover:bg-ChatBlueLight ${
              activeNavIndex === 0 ? "bg-ChatBlue text-white" : "bg-gray-200"
            }`}
          >
            <AiOutlineHome size={24} />
          </div>
          <div
            onClick={() => navigate("/Friends")}
            className={`sidebar-icon hover:bg-ChatBlueLight ${
              activeNavIndex === 1 ? "bg-ChatBlue text-white" : "bg-gray-200"
            }`}
          >
            <LiaUserFriendsSolid size={24} />
          </div>
          <div className="relative">
            <div
              className={`absolute top-1 right-0 z-10 text-red-500 ${
                hasNewNotification ? "" : "hidden"
              }`}
            >
              <FaCircle />
            </div>
            <div
              onClick={() => navigate("/Notifications")}
              className={`sidebar-icon z-0 hover:bg-ChatBlueLight  ${
                activeNavIndex === 2 ? "bg-ChatBlue text-white" : "bg-gray-200"
              }`}
            >
              <IoMdNotificationsOutline size={24} />
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            ref={menuRef}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto rounded-xl hover:bg-gray-200 cursor-pointer`}
          >
            <div className="">
              <CiSettings size={24} />
            </div>
          </div>
          {isOpen && (
            <div className="absolute bottom-15 left-5 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-1 text-sm text-gray-700">
                <li
                  onClick={() => navigate("/EditProfile")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Edit Profile
                </li>
                <li
                  onClick={signOut}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
