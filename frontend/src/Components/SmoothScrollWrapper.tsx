import { useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";

const SmoothScrollWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      document.documentElement.classList.add("scroll-smooth");
    } else {
      document.documentElement.classList.remove("scroll-smooth");
    }
  }, [location.pathname]);

  return <Outlet />;
};

export default SmoothScrollWrapper;
