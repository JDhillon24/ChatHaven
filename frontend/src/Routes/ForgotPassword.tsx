import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../Components/UI/Logo";
import { Link } from "react-router-dom";
import SuccessModal from "../Components/UI/SuccessModal";
import ForgotPasswordForm from "../Components/ForgotPassword/ForgotPasswordForm";

const ForgotPassword = () => {
  const location = useLocation();
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="w-full h-screen [@supports(height:100dvh)]:h-[100dvh] bg-slate-100">
      <div className="lg:w-1/3 w-full h-full mx-auto flex flex-col justify-center bg-white m-2 rounded-2xl col-span-2">
        <div className="flex flex-col justify-center items-center gap-8">
          <Logo classes="w-36" />
          <div className="flex flex-col justify-center text-center">
            <p className="text-3xl font-medium">Forgot your Password?</p>
            <p className="mt-2 text-sm font-normal">Please enter your email</p>
          </div>
          <ForgotPasswordForm onOpenSuccess={() => setOpenSuccess(true)} />
          <div className="flex flex-col justify-end pb-10">
            <p className="text-sm font-normal">
              Remember your password?{" "}
              <Link className="text-sm font-medium hover:underline" to="/Login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <SuccessModal
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        text="If there’s an account with that email, we’ve sent over a link to reset your password!"
      />
    </div>
  );
};

export default ForgotPassword;
