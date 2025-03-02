import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useNavigationTracker } from "../hooks/useNavigationTracker";
import LeftSection from "../Components/EditProfile/LeftSection";
const EditProfile = () => {
  const { historyStack } = useNavigationTracker();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (historyStack.length > 1) {
      navigate(-1);
    } else {
      navigate("/Home");
    }
  };
  return (
    <div className="lg:w-4/5 w-full mx-auto flex flex-col h-screen overflow-hidden">
      <div className="w-full mb-2">
        <div>
          <button
            onClick={handleGoBack}
            className="p-1 rounded-lg text-lg text-gray-400 bg-white hover:text-gray-600 cursor-pointer"
          >
            <IoMdClose />
          </button>
        </div>
      </div>
      <div className="mt-2 grid lg:grid-cols-2 grid-cols-1">
        <div className="flex flex-col">
          <LeftSection />
        </div>
        <div className="flex flex-col">Right</div>
      </div>
    </div>
  );
};

export default EditProfile;
