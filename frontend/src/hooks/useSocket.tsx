import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket | null = null;

const useSocket = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      socket?.disconnect();
      socket = null;
      return;
    }

    if (socket) {
      socket.disconnect();
      socket = null;
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
        console.error(err.message);
        if (err.message === "Authentication error: invalid or expired token") {
          try {
            const newAccessToken = await refresh();

            socket?.emit("reauthenticate", { token: newAccessToken });
          } catch (error) {
            console.error("Failed to refresh token:", error);
          }
        }
      });

      // socket.onAny((event, ...args) => {
      //   console.log(`Received event: ${event}`, args);
      // });
    }

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [auth]);
  return { socket, isConnected };
};

export default useSocket;
