import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { io, Socket } from "socket.io-client";

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
    <div>
      {JSON.stringify(auth)}
      <div className="flex justify-center">
        <button
          onClick={signOut}
          className="bg-red-500 rounded-full py-2 px-4 text-white hover:bg-red-400 cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Home;
