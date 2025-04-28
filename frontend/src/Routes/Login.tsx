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

const Login = () => {
  const location = useLocation();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const navigate = useNavigate();
  const [openResend, setOpenResend] = useState(false);
  const [resendText, setResendText] = useState("");
  const [stateEmail, setStateEmail] = useState("");

  const { verifySent, verifySuccess, verifyFailed, email, passwordReset } =
    location.state || {};

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

  const handleSuccessClose = () => {
    setOpenSuccess(false);
    navigate(location.pathname, { replace: true, state: {} });
  };

  const handleResendClose = () => {
    setOpenResend(false);
    navigate(location.pathname, { replace: true, state: {} });
  };

  const handleResend = async (email: string) => {
    try {
      axios.post("/user/resendverificationlink", JSON.stringify({ email }));
      setOpenResend(false);
      setSuccessText("The new verification link has successfully been sent!");
      setOpenSuccess(true);
    } catch (error) {
      console.error;
    }
  };

  useEffect(() => {
    document.title = "Login | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="w-full min-h-screen [@supports(height:100dvh)]:h-[100dvh] bg-gradient-to-b from-white to-[#2bb3c0] overflow-hidden ">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3">
        <LeftGridForms />
        <div className="w-full flex flex-col items-center justify-start lg:justify-center overflow-y-auto bg-white p-2 mx-auto xl:rounded-2xl">
          <div className="w-full flex flex-col justify-center items-center gap-8">
            <Logo classes="mt-10 w-36 flex lg:hidden" />
            <SmallLogo classes="mt-10 w-14 hidden lg:flex" />
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
          </div>
        </div>
      </div>
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
