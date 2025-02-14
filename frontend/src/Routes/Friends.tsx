import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Friends = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = "Friends | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="w-full flex h-screen overflow-hidden">
      <div className="flex z-10">
        <Sidebar index={1} />
      </div>
      <div className="lg:ml-24 ml-18 flex-1 flex z-0">Friends</div>
    </div>
  );
};

export default Friends;
