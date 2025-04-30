import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterForm from "../Components/Register/RegisterForm";
import Logo from "../Components/UI/Logo";
import { Link } from "react-router-dom";
import LeftGridForms from "../Components/UI/LeftGridForms";
import SmallLogo from "../Components/UI/SmallLogo";
import { motion } from "framer-motion";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="w-full h-screen [@supports(height:100dvh)]:h-[100dvh] bg-gradient-to-b from-white to-[#2bb3c0] overflow-hidden ">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3">
        <LeftGridForms />
        <div className="w-full flex flex-col justify-center items-center overflow-y-auto bg-white p-2 mx-auto xl:rounded-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="w-full flex flex-col justify-center items-center gap-8"
          >
            <div onClick={() => navigate("/")}>
              <Logo classes="mt-10 w-36 flex lg:hidden cursor-pointer" />
            </div>
            <div onClick={() => navigate("/")}>
              <SmallLogo classes="mt-10 w-14 hidden lg:flex cursor-pointer" />
            </div>
            <div className="flex flex-col justify-center text-center">
              <p className="text-3xl font-medium">Register</p>
              <p className="mt-2 text-sm font-normal">
                Please enter your details
              </p>
            </div>
            <RegisterForm />
            <div className="flex flex-col justify-end pb-10">
              <p className="text-sm font-normal">
                Already have an account?{" "}
                <Link
                  className="text-sm font-medium hover:underline"
                  to="/Login"
                >
                  Login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
