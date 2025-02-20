import { Outlet } from "react-router-dom";
import { SocketProvider } from "../context/SocketProvider";

const SocketWrapper = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};

export default SocketWrapper;
