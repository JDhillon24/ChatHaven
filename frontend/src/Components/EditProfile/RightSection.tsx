import React from "react";

type SectionProps = {
  openUsername: () => void;
  openPassword: () => void;
};

const RightSection: React.FC<SectionProps> = ({
  openUsername,
  openPassword,
}) => {
  return (
    <div className="mt-1 flex flex-col justify-center items-center gap-3">
      <div>
        <div className="flex flex-col justify-center items-center gap-5">
          <button
            onClick={openUsername}
            className="bg-ChatBlue rounded-full px-8 py-2 text-white transition-all duration-200 active:scale-90 active:bg-ChatBlueLight cursor-pointer"
          >
            Change Username
          </button>
          <button
            onClick={openPassword}
            className="bg-ChatBlue rounded-full px-8 py-2 text-white transition-all duration-200 active:scale-90 active:bg-ChatBlueLight cursor-pointer"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
