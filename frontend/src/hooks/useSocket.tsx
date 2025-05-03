import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./useAuth";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const useSocket = () => {
  //ref for current socket instance
  const socketRef = useRef<Socket | null>(null);
  const { auth } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    //disconnect and clean socket if user isn't authenticated
    if (auth.isAuthenticated === false) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    //cleaning up old socket instances
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    //initialization
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: auth.user.accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.emit("join", auth.user.email);

    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("reconnect_attempt", (attempt) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Reconnecting... Attempt ${attempt}`);
      }
    });

    socket.on("reconnect", () => {
      setIsConnected(true);
    });

    socket.on("connect_error", async (err) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(err);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [auth]);
  return { socket: socketRef.current, isConnected };
};

export default useSocket;
