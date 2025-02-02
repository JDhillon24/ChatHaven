import { AiOutlineHome } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiMessage } from "react-icons/bi";
import { FC, useState } from "react";

interface SidebarProps {
  index: number;
}

const Sidebar: FC<SidebarProps> = ({ index }) => {
  const [activeNavIndex, setActiveNavIndex] = useState(index);
  return (
    <div className="w-24 fixed top-0 left-0 h-screen bg-white shadow-lg flex flex-col">
      <div className="h-screen flex flex-col items-center mt-2 gap-4 ">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center h-14 w-14 mt-2 mb-2 mx-auto rounded-xl bg-ChatBlue">
            <img
              className="rounded-xl"
              src="/images/pfp/cool-anime-pfp-07.jpg"
              alt="Profile"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <div
            onClick={() => setActiveNavIndex(0)}
            className={`sidebar-icon ${
              activeNavIndex === 0 ? "bg-ChatBlue text-white" : ""
            }`}
          >
            <AiOutlineHome size={24} />
          </div>
          <div
            onClick={() => setActiveNavIndex(1)}
            className={`sidebar-icon ${
              activeNavIndex === 1 ? "bg-ChatBlue text-white" : ""
            }`}
          >
            <BiMessage size={24} />
          </div>
          <div
            onClick={() => setActiveNavIndex(2)}
            className={`sidebar-icon ${
              activeNavIndex === 2 ? "bg-ChatBlue text-white" : ""
            }`}
          >
            <IoMdNotificationsOutline size={24} />
          </div>
        </div>
        <div
          onClick={() => setActiveNavIndex(3)}
          className={`sidebar-icon ${
            activeNavIndex === 3 ? "bg-ChatBlue text-white" : ""
          }`}
        >
          <div className="sidebar-icon">
            <CiSettings size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
