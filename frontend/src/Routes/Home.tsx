import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { io, Socket } from "socket.io-client";
import Sidebar from "../Components/Sidebar";
import Conversations from "../Components/Home/Conversations";
import Chat from "../Components/Home/Chat";

const Home = () => {
  const logout = useLogout();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection failed:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason); // Connection lost details
    });

    // Cleanup function to prevent duplicate connections
    return () => {
      newSocket.disconnect();
      console.log("socket disconnected on unmount");
    };
  }, []);

  const signOut = async () => {
    await logout();
    window.location.reload();
  };
  const { auth } = useAuth();
  return (
    <div className="w-full flex h-screen overflow-hidden">
      <Sidebar index={0} />
      <div className="ml-24 flex-1 flex">
        <div className="grid grid-cols-4 w-full">
          <div className="flex flex-col h-screen">
            <Conversations />
          </div>
          <div className="flex flex-col col-span-2 h-screen">
            <Chat />
          </div>
          <div className="flex flex-col">Right</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
