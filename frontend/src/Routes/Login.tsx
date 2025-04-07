import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Components/UI/Logo";
import { Link } from "react-router-dom";
import LoginForm from "../Components/Login/LoginForm";
import SuccessModal from "../Components/UI/SuccessModal";
import axios from "../api/axios";
import VerifyFailedModal from "../Components/Login/VerifyFailedModal";

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
      const response = axios.post(
        "/user/resendverificationlink",
        JSON.stringify({ email })
      );
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
    <div className="w-full h-screen bg-slate-100">
      <div className="lg:w-1/3 w-full h-full mx-auto flex flex-col justify-center bg-white m-2 rounded-2xl col-span-2">
        <div className="flex flex-col justify-center items-center gap-8">
          <Logo classes="w-36" />
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
