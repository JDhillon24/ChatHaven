import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const ProfilePictureModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  // initial value is the users current profile picture
  const [selectedProfile, setSelectedProfile] = useState<string>(
    auth.user?.profilePicture || ""
  );

  // list of available profile pictures
  const profilePictures = [
    "/images/pfp/default.jpg",
    "/images/pfp/cool-anime-pfp-02.jpg",
    "/images/pfp/cool-anime-pfp-04.jpg",
    "/images/pfp/cool-anime-pfp-05.jpg",
    "/images/pfp/cool-anime-pfp-07.jpg",
    "/images/pfp/cool-anime-pfp-09.jpg",
    "/images/pfp/cool-anime-pfp-14.jpg",
    "/images/pfp/cool-anime-pfp-21.jpg",
    "/images/pfp/cool-anime-pfp-27.jpg",
    "/images/pfp/cool-anime-pfp-30.jpg",
    "/images/pfp/cristiano-ronaldo-pfp-8.jpg",
    "/images/pfp/lionel-messi-pfp-4.jpg",
    "/images/pfp/rapper-pfp-2.jpg",
    "/images/pfp/rapper-pfp-6.jpg",
    "/images/pfp/rapper-pfp-9.jpg",
    "/images/pfp/rapper-pfp-12.jpg",
  ];

  const axiosPrivate = useAxiosPrivate();

  // function to change profile picture, opens modal with appropriate text on success
  const handleProfileChange = async () => {
    try {
      await axiosPrivate.put(
        "/user/profilepicture",
        JSON.stringify({
          profilePicture: selectedProfile,
        })
      );
      onClose();
      navigate("/EditProfile", { state: { profileSuccess: true } });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
    }
  };
  // sets profile picture state back to initial value if user closes modal without changing the picture
  return (
    <div
      onClick={() => {
        setSelectedProfile(auth.user?.profilePicture || "");
        onClose();
      }}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={() => {
            setSelectedProfile(auth.user?.profilePicture || "");
            onClose();
          }}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600 cursor-pointer"
        >
          <IoMdClose />
        </button>
        <div className="mx-auto my-4 flex flex-col justify-center">
          <p className="text-lg font-black text-gray-800 text-center">
            Change Profile Picture
          </p>
          <div className="flex justify-center items-center">
            <div className="mt-2 grid lg:grid-cols-4 grid-cols-3 gap-5">
              {/* List of profile pictures, blue border around the selected picture */}
              {profilePictures.map((item, index) => (
                <div
                  onClick={() => setSelectedProfile(item)}
                  key={index}
                  className={`lg:h-32 lg:w-32 h-16 w-16 hover:border-ChatBlue hover:border-8 ${
                    item === selectedProfile ? "border-ChatBlue border-8" : ""
                  } rounded-xl cursor-pointer`}
                >
                  <img src={item} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 w-full flex justify-center">
            <div
              onClick={handleProfileChange}
              className="font-semibold mt-2 rounded-full bg-ChatBlue flex justify-center items-center px-8 py-2 text-white cursor-pointer transition-all duration-200 active:scale-90 active:bg-ChatBlueLight"
            >
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
