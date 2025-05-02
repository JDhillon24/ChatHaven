import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import LeftSection from "../Components/EditProfile/LeftSection";
import ProfilePictureModal from "../Components/EditProfile/ProfilePictureModal";
import SuccessModal from "../Components/UI/SuccessModal";
import RightSection from "../Components/EditProfile/RightSection";
import ChangeUsername from "../Components/EditProfile/ChangeUsername";
import ResetPassword from "../Components/EditProfile/ResetPassword";
const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Edit Profile | ChatHaven";
  }, [location.pathname]);

  // location state to indicate successful change
  const { profileSuccess, nameSuccess, passSuccess } = location.state || {};

  //state variables for modals
  const [openProfile, setOpenProfile] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [openUsername, setOpenUsername] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const openSuccessModal = (text: string) => {
    setSuccessText(text);
    setOpenSuccess(true);
  };

  //clears location state and refreshes page to show profile picture change
  const handleSuccessClose = () => {
    setOpenSuccess(false);
    navigate(location.pathname, { replace: true, state: {} });
    window.location.reload();
  };

  // opens success modal with certain text based on location state
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
    <div className="flex flex-col h-screen [@supports(height:100dvh)]:h-[100dvh] overflow-x-hidden overflow-y-auto">
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
          {/* Left Section containing edit profile picture */}
          <div className="flex flex-col">
            <LeftSection openProfile={() => setOpenProfile(true)} />
          </div>

          {/* Right Section containing edit username and password */}
          <div className="h-full flex flex-col">
            <RightSection
              openUsername={() => setOpenUsername(true)}
              openPassword={() => setOpenPassword(true)}
            />
          </div>
        </div>
      </div>
      {/* Modals for profile changes */}
      <ProfilePictureModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
      <SuccessModal
        open={openSuccess}
        onClose={handleSuccessClose}
        text={successText}
      />
      <ChangeUsername
        open={openUsername}
        onClose={() => setOpenUsername(false)}
      />
      <ResetPassword
        open={openPassword}
        onClose={() => setOpenPassword(false)}
      />
    </div>
  );
};

export default EditProfile;
