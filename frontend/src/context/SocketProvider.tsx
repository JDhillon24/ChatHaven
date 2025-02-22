import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  notifications: (ResponseData | ResponseDataGroup)[];
  setNotifications: React.Dispatch<
    React.SetStateAction<(ResponseData | ResponseDataGroup)[]>
  >;
  hasNewNotification: boolean;
  setHasNewNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

type ResponseData = {
  type: "friend_request" | "accept_request";
  sender: { _id: string; name: string; profilePicture: string };
  createdAt: string;
};

type ResponseDataGroup = {
  type: "group_invite";
  sender: { _id: string; name: string; profilePicture: string };
  room: { _id: string; name: string };
  createdAt: string;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket, isConnected } = useSocket();
  const [hasNewNotification, setHasNewNotification] = useState(
    () => localStorage.getItem("newNotification") === "true"
  );
  const [notifications, setNotifications] = useState<
    (ResponseData | ResponseDataGroup)[]
  >([]);
  const location = useLocation();

  useEffect(() => {
    if (!socket || isConnected === false) return;

    socket.on("notification", (notification) => {
      if (location.pathname !== "/Notifications") {
        setHasNewNotification(true);
        localStorage.setItem("newNotification", "true");
      }
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, location.pathname, isConnected]);

  useEffect(() => {
    const handleStorageChange = () => {
      setHasNewNotification(localStorage.getItem("newNotification") === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        setNotifications,
        hasNewNotification,
        setHasNewNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
