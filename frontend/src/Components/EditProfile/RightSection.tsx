import React from "react";
import ChangeUsername from "./ChangeUsername";
import ResetPassword from "./ResetPassword";

const RightSection = () => {
  return (
    <div className="mt-1 flex flex-col justify-center items-center gap-3">
      <div>
        <div className="flex justify-center">
          <p className="text-xl font-medium text-center">Change Username</p>
        </div>
        <div className="mt-5">
          <ChangeUsername />
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <p className="text-xl font-medium text-center">Reset Password</p>
        </div>
        <div className="mt-5">
          <ResetPassword />
        </div>
      </div>
    </div>
  );
};

export default RightSection;
