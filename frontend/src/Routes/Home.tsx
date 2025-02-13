import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { io, Socket } from "socket.io-client";
import Sidebar from "../Components/Sidebar";
import Conversations from "../Components/Home/Conversations";
import Chat from "../Components/Home/Chat";
import Info from "../Components/Home/Info";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

type Section = "conversations" | "chat" | "info";

const Home = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  // const [socket, setSocket] = useState<Socket | null>(null);
  const storageSection =
    (localStorage.getItem("activeSection") as Section) || "conversations";
  const [activeSection, setActiveSection] = useState<Section>(storageSection);
  const [isChatActive, setIsChatActive] = useState(
    localStorage.getItem("activeSection") === "chat"
  );

  const handleSectionChange = (section: Section) => {
    localStorage.setItem("activeSection", section);
    const activeSection = localStorage.getItem("activeSection") as Section;
    setActiveSection(activeSection);

    if (section === "chat") {
      setIsChatActive(true);
    } else {
      setIsChatActive(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axiosPrivate.get("/user/search", {
        params: {
          name: "J",
        },
      });
      console.log(response.data);
    };
    console.log(auth);

    // getData();
  }, []);

  // useEffect(() => {
  //   const newSocket = io("http://localhost:5000", {
  //     withCredentials: true,
  //     transports: ["websocket"],
  //   });

  //   setSocket(newSocket);

  //   newSocket.on("connect", () => {
  //     console.log("Connected to server:", newSocket.id);
  //   });

  //   newSocket.on("connect_error", (err) => {
  //     console.error("Connection failed:", err);
  //   });

  //   newSocket.on("disconnect", (reason) => {
  //     console.log("Disconnected:", reason); // Connection lost details
  //   });

  //   // Cleanup function to prevent duplicate connections
  //   return () => {
  //     newSocket.disconnect();
  //     console.log("socket disconnected on unmount");
  //   };
  // }, []);

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <div
        className={`${
          activeSection === "conversations" ? "" : "hidden"
        } lg:flex z-10`}
      >
        <Sidebar index={0} />
      </div>
      <div
        className={`lg:ml-24 ${
          activeSection === "conversations" ? "ml-18" : ""
        } flex-1 flex z-0`}
      >
        <div
          className={`grid lg:grid-cols-4 ${
            activeSection === "chat" ? "grid-cols-2" : "grid-cols-1"
          } w-full`}
        >
          <div
            className={`flex flex-col h-screen ${
              activeSection === "conversations" ? "" : "hidden"
            } lg:flex`}
          >
            <Conversations onSelect={() => handleSectionChange("chat")} />
          </div>
          <div
            className={`flex flex-col col-span-2 h-screen ${
              activeSection === "chat" ? "" : "hidden"
            } lg:flex`}
          >
            <Chat
              onBack={() => handleSectionChange("conversations")}
              onShowInfo={() => handleSectionChange("info")}
              isActive={isChatActive}
            />
          </div>
          <div
            className={`flex flex-col h-screen ${
              activeSection === "info" ? "" : "hidden"
            } lg:flex`}
          >
            <Info onBack={() => handleSectionChange("chat")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
