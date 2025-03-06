import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationTracker } from "../hooks/useNavigationTracker";
import LeftSection from "../Components/EditProfile/LeftSection";
import ProfilePictureModal from "../Components/EditProfile/ProfilePictureModal";
import useAuth from "../hooks/useAuth";
import SuccessModal from "../Components/UI/SuccessModal";
import RightSection from "../Components/EditProfile/RightSection";
const EditProfile = () => {
  const { historyStack } = useNavigationTracker();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    document.title = "Edit Profile | ChatHaven";
  }, [location.pathname]);

  const { profileSuccess, nameSuccess, passSuccess } = location.state || {};

  const [openProfile, setOpenProfile] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const openSuccessModal = (text: string) => {
    setSuccessText(text);
    setOpenSuccess(true);
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
    navigate(location.pathname, { replace: true, state: {} });
  };

  useEffect(() => {
    if (profileSuccess) {
      openSuccessModal("Your profile picture has been changed successfully!");
    } else if (nameSuccess) {
      openSuccessModal("Your username has been changed successfully!");
    } else if (passSuccess) {
      openSuccessModal("Your password has been changed successfully!");
    }
  }, [profileSuccess, nameSuccess, passSuccess]);

  return (
    <div className="flex flex-col h-screen overflow-x-hidden overflow-y-auto">
      <div className="w-full my-2 ml-2">
        <div>
          <button
            onClick={() => navigate("/Home")}
            className="p-1 rounded-lg text-lg text-gray-400 bg-white hover:text-gray-600 cursor-pointer"
          >
            <IoMdClose />
          </button>
        </div>
      </div>

      <div className="lg:w-2/4 sm:w-4/5 w-full h-full mx-auto">
        <div className="flex justify-center">
          <p className="text-3xl font-semibold">Edit Profile</p>
        </div>
        <div className="mt-3 p-3 grid xl:grid-cols-2 grid-cols-1 bg-gray-200 rounded-xl grow">
          <div className="flex flex-col">
            <LeftSection openProfile={() => setOpenProfile(true)} />
          </div>
          <div className="h-full flex flex-col border border-red-500">
            <RightSection />
          </div>
        </div>
      </div>
      <ProfilePictureModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
      <SuccessModal
        open={openSuccess}
        onClose={handleSuccessClose}
        text={successText}
      />
    </div>
  );
};

export default EditProfile;
