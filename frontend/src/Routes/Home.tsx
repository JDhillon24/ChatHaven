import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { io, Socket } from "socket.io-client";
import Sidebar from "../Components/Sidebar";
import Conversations from "../Components/Home/Conversations";
import Chat from "../Components/Home/Chat";
import Info from "../Components/Home/Info";

const Home = () => {
  const logout = useLogout();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeSection, setActiveSection] = useState<
    "conversations" | "chat" | "info"
  >("info");

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
      <div
        className={`${
          activeSection === "conversations" ? "" : "hidden"
        } md:flex`}
      >
        <Sidebar index={0} />
      </div>
      <div
        className={`md:ml-24 ${
          activeSection === "conversations" ? "ml-18" : ""
        } flex-1 flex`}
      >
        <div
          className={`grid md:grid-cols-4 ${
            activeSection === "chat" ? "grid-cols-2" : "grid-cols-1"
          } w-full`}
        >
          <div
            className={`flex flex-col h-screen ${
              activeSection === "conversations" ? "" : "hidden"
            } md:flex`}
          >
            <Conversations onSelect={() => setActiveSection("chat")} />
          </div>
          <div
            className={`flex flex-col col-span-2 h-screen ${
              activeSection === "chat" ? "" : "hidden"
            } md:flex`}
          >
            <Chat
              onBack={() => setActiveSection("conversations")}
              onShowInfo={() => setActiveSection("info")}
            />
          </div>
          <div
            className={`flex flex-col h-screen ${
              activeSection === "info" ? "" : "hidden"
            } md:flex`}
          >
            <Info onBack={() => setActiveSection("chat")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
