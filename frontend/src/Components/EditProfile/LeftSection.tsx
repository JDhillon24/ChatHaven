import React from "react";
import useAuth from "../../hooks/useAuth";
import { FaEdit } from "react-icons/fa";

type SectionProps = {
  openProfile: () => void;
};

const LeftSection: React.FC<SectionProps> = ({ openProfile }) => {
  const { auth } = useAuth();
  return (
    <div>
      <div className="relative flex items-center justify-center h-80 w-80 mt-2 mb-2 mx-auto rounded-xl group">
        <img
          className="rounded-xl group-hover:brightness-50"
          src={auth.user?.profilePicture}
          alt="Profile"
        />
        <div className="absolute top-2 right-2 lg:hidden text-white group-hover:block transition-all duration-300">
          <FaEdit onClick={openProfile} className="cursor-pointer" size={28} />
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
