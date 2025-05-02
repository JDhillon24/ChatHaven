import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import NotificationsMain from "../Components/Notifications/NotificationsMain";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConfirmationModal from "../Components/UI/ConfirmationModal";

const Notifications = () => {
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    document.title = "Notifications | ChatHaven";
  }, [location.pathname]);

  //state variable for confirmation modal to clear notifications
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleClearNotifications = async () => {
    try {
      await axiosPrivate.delete("/notifications/clearnotifications");
      setOpenConfirmation(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex h-screen [@supports(height:100dvh)]:h-[100dvh] overflow-hidden">
      {/* Sidebar stays fixed to the left and placed above main content */}
      <div className="flex z-10">
        <Sidebar index={2} />
      </div>
      {/* Main content adjusted slightly to the right to account for sidebar width */}
      <div className="md:ml-24 ml-18 flex-1 flex z-0">
        <NotificationsMain
          open={openConfirmation}
          onOpen={() => setOpenConfirmation(true)}
        />
      </div>
      {/* Confirmation modal sits on top of all components*/}
      <div className="z-20">
        <ConfirmationModal
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onChange={handleClearNotifications}
          text="Are you sure you want to clear all notifications?"
        />
      </div>
    </div>
  );
};

export default Notifications;
