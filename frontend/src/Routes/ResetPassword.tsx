import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Logo from "../Components/UI/Logo";
import SmallLogo from "../Components/UI/SmallLogo";
import ErrorModal from "../Components/UI/ErrorModal";
import ResetPasswordForm from "../Components/ForgotPassword/ResetPasswordForm";
import LeftGridForms from "../Components/UI/LeftGridForms";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //state variable for error modal
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password | ChatHaven";
  }, [location.pathname]);

  return (
    <div className="w-full h-screen [@supports(height:100dvh)]:h-[100dvh] bg-gradient-to-b from-white to-[#2bb3c0] overflow-hidden ">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3">
        {/* Left Section only shown on lg screens */}
        <LeftGridForms />

        {/* Reset Password Form */}
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
              <p className="text-3xl font-medium">Reset your Password!</p>
              <p className="mt-2 text-sm font-normal">
                Please enter your new password
              </p>
            </div>
            <ResetPasswordForm onOpenError={() => setOpenError(true)} />
            <div className="flex flex-col justify-end pb-10">
              <p className="text-sm font-normal">
                Remember your password?{" "}
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
      <ErrorModal
        open={openError}
        onClose={() => setOpenError(false)}
        text="The password reset link is invalid or expired. Please request a new link."
      />
    </div>
  );
};

export default ResetPassword;
