import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import NotificationsMain from "../Components/Notifications/NotificationsMain";

const Notifications = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = "Friends | ChatHaven";
  }, [location.pathname]);

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <div className="flex z-10">
        <Sidebar index={2} />
      </div>
      <div className="md:ml-24 ml-18 flex-1 flex z-0">
        <NotificationsMain />
      </div>
    </div>
  );
};

export default Notifications;
