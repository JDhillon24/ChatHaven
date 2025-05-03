import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Components/UI/Logo";
import { Link } from "react-router-dom";
import LoginForm from "../Components/Login/LoginForm";
import SuccessModal from "../Components/UI/SuccessModal";
import axios from "../api/axios";
import VerifyFailedModal from "../Components/Login/VerifyFailedModal";
import LeftGridForms from "../Components/UI/LeftGridForms";
import SmallLogo from "../Components/UI/SmallLogo";
import { motion } from "framer-motion";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //state variables for modals
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [openResend, setOpenResend] = useState(false);
  const [resendText, setResendText] = useState("");
  const [stateEmail, setStateEmail] = useState("");

  //location state for different behaviours
  const { verifySent, verifySuccess, verifyFailed, email, passwordReset } =
    location.state || {};

  //sets modal text and opens modal based on location state
  useEffect(() => {
    if (verifySent && email) {
      setSuccessText(
        `Thanks for signing up! We've sent an email to ${email} to verify your account. Please check your inbox (and spam just in case)!`
      );
      setOpenSuccess(true);
    } else if (verifySuccess) {
      setSuccessText(
        "Your account has been successfully verified! Go ahead and log in to get started!"
      );
      setOpenSuccess(true);
    } else if (verifyFailed && email) {
      setResendText(
        `The verification link is invalid or expired. Would you like to have a new link sent to ${email}?`
      );
      setOpenResend(true);
    } else if (passwordReset) {
      setSuccessText(
        "Your password has been successfully reset! Feel free to log in!"
      );
      setOpenSuccess(true);
    }
  }, [location]);

  //functions to clear location state after modal close
  const handleSuccessClose = () => {
    setOpenSuccess(false);
    navigate(location.pathname, { replace: true, state: {} });
  };

  const handleResendClose = () => {
    setOpenResend(false);
    navigate(location.pathname, { replace: true, state: {} });
  };

  //function for resending verification email
  const handleResend = async (email: string) => {
    try {
      axios.post("/user/resendverificationlink", JSON.stringify({ email }));
      setOpenResend(false);
      setSuccessText("The new verification link has successfully been sent!");
      setOpenSuccess(true);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error();
      }
    }
  };

  useEffect(() => {
    document.title = "Login | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="w-full h-screen [@supports(height:100dvh)]:h-[100dvh] bg-gradient-to-b from-white to-[#2bb3c0] overflow-hidden ">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3">
        {/* Left section only shown on lg screens */}
        <LeftGridForms />

        {/* Login Form */}
        <div className="w-full flex flex-col items-center justify-center overflow-y-auto bg-white p-2 mx-auto xl:rounded-2xl">
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
              <p className="text-3xl font-medium">Welcome!</p>
              <p className="mt-2 text-sm font-normal">
                Please enter your details
              </p>
            </div>
            <LoginForm
              setEmail={setStateEmail}
              openResend={() => setOpenResend(true)}
              setResendText={setResendText}
            />
            <div className="flex flex-col justify-end pb-10">
              <p className="text-sm font-normal">
                Don't have an account?{" "}
                <Link
                  to="/Register"
                  className="text-sm font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <SuccessModal
        open={openSuccess}
        onClose={handleSuccessClose}
        text={successText}
      />
      <VerifyFailedModal
        open={openResend}
        onClose={handleResendClose}
        handleResend={() => handleResend(email || stateEmail)}
        text={resendText}
      />
    </div>
  );
};

export default Login;
