import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import FriendsMain from "../Components/Friends/FriendsMain";
import FriendsAdd from "../Components/Friends/FriendsAdd";
import SuccessModal from "../Components/UI/SuccessModal";
import ErrorModal from "../Components/UI/ErrorModal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConfirmationModal from "../Components/UI/ConfirmationModal";
import { AnimatePresence } from "framer-motion";

const Friends = () => {
  const [addFriends, setAddFriends] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [toRemove, setToRemove] = useState("");

  const handleRemoveClick = (friend: string) => {
    setToRemove(friend);
    setOpenConfirmation(true);
  };

  const handleRemove = async (friend: string) => {
    try {
      const response = await axiosPrivate.delete(
        `/user/removefriend?friendId=${friend}`
      );

      setOpenConfirmation(false);
      setSuccessText(response.data.message);
      setOpenSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  const location = useLocation();
  useEffect(() => {
    document.title = "Friends | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="w-full flex h-screen overflow-hidden">
      <div className="flex z-10">
        <Sidebar index={1} />
      </div>
      <div className="md:ml-24 ml-18 flex-1 flex z-0">
        <AnimatePresence mode="wait">
          {addFriends ? (
            <FriendsAdd
              open={openSuccess}
              onOpen={() => setOpenSuccess(true)}
              setAddFriends={() => setAddFriends(false)}
              onErrorOpen={() => setOpenError(true)}
              setErrorText={setErrorText}
              setSuccessText={setSuccessText}
            />
          ) : (
            <FriendsMain
              open={openSuccess}
              setAddFriends={() => setAddFriends(true)}
              handleRemoveClick={handleRemoveClick}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="z-20">
        <SuccessModal
          open={openSuccess}
          onClose={() => setOpenSuccess(false)}
          text={successText}
        />
      </div>
      <div className="z-20">
        <ErrorModal
          open={openError}
          onClose={() => setOpenError(false)}
          text={errorText}
        />
      </div>
      <div className="z-20">
        <ConfirmationModal
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onChange={() => handleRemove(toRemove)}
          text="Are you sure you want to remove this user as a friend?"
        />
      </div>
    </div>
  );
};

export default Friends;
