import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LeftGridForms = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full hidden lg:flex flex-col justify-center items-center lg:col-span-2">
      <div className="section-heading">
        <div className="flex justify-center">
          <div
            onClick={() => navigate("/")}
            className="inline-flex relative before:content-[''] before:top-0 before:bottom-0 before:blur before:h-full before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute cursor-pointer"
          >
            <Logo classes="w-42 relative" />
          </div>
        </div>
        <h1 className="section-title mt-5">It’s All About the Conversation</h1>
        <div className="section-description mt-5">
          No judgments, no pressure. Just a place to talk, share, and be
          yourself.
        </div>
      </div>
    </div>
  );
};

export default LeftGridForms;
