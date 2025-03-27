import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../Components/UI/Logo";
import { Link } from "react-router-dom";
import LoginForm from "../Components/Login/LoginForm";
import SuccessModal from "../Components/UI/SuccessModal";

const Login = () => {
  const location = useLocation();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const { verifySent, verifySuccess, verifyFailed, email } =
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
    } else if (verifyFailed) {
    }
  });

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
          <LoginForm />
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
        onClose={() => setOpenSuccess(false)}
        text={successText}
      />
    </div>
  );
};

export default Login;
