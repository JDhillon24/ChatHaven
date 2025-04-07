import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./useAuth";

const SOCKET_URL = "http://localhost:5000";

const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { auth } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    if (socketRef.current) {
      console.log(
        "Existing socket found. Disconnecting before reconnecting..."
      );
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // console.log("new socket connecting");
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
      // console.log(`connection has been made: ${socket?.id}`);
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnecting... Attempt ${attempt}`);
    });

    socket.on("reconnect", () => {
      console.log("socket reconnected");
      setIsConnected(true);
    });

    socket.on("connect_error", async (err) => {
      console.log(err);
    });

    return () => {
      if (socketRef.current) {
        // console.log("cleaning up socket: disconnecting");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [auth]);
  return { socket: socketRef.current, isConnected };
};

export default useSocket;
