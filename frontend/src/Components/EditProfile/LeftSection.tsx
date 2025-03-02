import React from "react";
import useAuth from "../../hooks/useAuth";

const LeftSection = () => {
  const { auth } = useAuth();
  return (
    <div>
      <div className="relative flex items-center justify-center h-80 w-80 mt-2 mb-2 mx-auto rounded-xl">
        <img
          className="rounded-xl"
          src={auth.user?.profilePicture}
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default LeftSection;
