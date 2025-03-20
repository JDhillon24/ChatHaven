import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./useAuth";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket | null = null;

const useSocket = () => {
  const { auth } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      socket?.disconnect();
      socket = null;
      return;
    }

    if (!socket) {
      socket = io(SOCKET_URL, {
        withCredentials: true,
        auth: { token: auth.user.accessToken },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      socket.emit("join", auth.user.email);

      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));

      socket.on("reconnect_attempt", (attempt) => {
        console.log(`Reconnecting... Attempt ${attempt}`);
      });

      socket.on("reconnect", () => setIsConnected(true));

      socket.on("connect_error", (err) => {
        console.error(err.message);
      });
    }

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [auth]);
  return { socket, isConnected };
};

export default useSocket;
