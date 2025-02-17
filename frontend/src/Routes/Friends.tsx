import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import FriendsMain from "../Components/Friends/FriendsMain";
import FriendsAdd from "../Components/Friends/FriendsAdd";
import SuccessModal from "../Components/UI/SuccessModal";
const Friends = () => {
  const [addFriends, setAddFriends] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

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
        {addFriends ? (
          <FriendsAdd
            open={openSuccess}
            onOpen={() => setOpenSuccess(true)}
            setAddFriends={() => setAddFriends(false)}
          />
        ) : (
          <FriendsMain setAddFriends={() => setAddFriends(true)} />
        )}
      </div>
      <div className="z-20">
        <SuccessModal
          open={openSuccess}
          onClose={() => setOpenSuccess(false)}
          text="You have successfully sent a friend request!"
        />
      </div>
    </div>
  );
};

export default Friends;
