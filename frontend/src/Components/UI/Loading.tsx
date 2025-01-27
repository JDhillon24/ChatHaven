import { useEffect } from "react";
import "./FullPageDiv.css";
import Spinner from "./Spinner";
import { useLocation } from "react-router-dom";

const Loading = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = "Loading | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="full-page-div">
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    </div>
  );
};

export default Loading;
