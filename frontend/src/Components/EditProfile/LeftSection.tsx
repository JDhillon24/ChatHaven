import React from "react";
import useAuth from "../../hooks/useAuth";
import { FaEdit } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";

type SectionProps = {
  openProfile: () => void;
};

const LeftSection: React.FC<SectionProps> = ({ openProfile }) => {
  const { auth } = useAuth();
  return (
    <div>
      <div
        onClick={openProfile}
        className="cursor-pointer relative flex items-center justify-center h-80 w-80 mt-2 mb-2 mx-auto rounded-xl group"
      >
        <img
          className="rounded-xl group-hover:brightness-50"
          src={auth.user?.profilePicture}
          alt="Profile"
        />
        <div className="absolute top-2 right-2 lg:hidden text-white group-hover:block transition-all duration-300">
          <FaEdit size={28} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 mb-2">
        <p className="text-lg font-medium">{auth.user?.email}</p>
        <div className="bg-ChatBlue rounded-full px-8 py-2 cursor-default">
          <div className="flex text-white items-center gap-1">
            <p className="text-sm">Verified</p>
            <MdOutlineVerified size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
