import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Logo from "../Components/UI/Logo";
import ErrorModal from "../Components/UI/ErrorModal";
import ResetPasswordForm from "../Components/ForgotPassword/ResetPasswordForm";

const ResetPassword = () => {
  const location = useLocation();
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password | ChatHaven";
  }, [location.pathname]);

  return (
    <div className="w-full h-screen bg-slate-100">
      <div className="lg:w-1/3 w-full h-full mx-auto flex flex-col justify-center bg-white m-2 rounded-2xl col-span-2">
        <div className="flex flex-col justify-center items-center gap-8">
          <Logo classes="w-36" />
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
              <Link className="text-sm font-medium hover:underline" to="/Login">
                Login
              </Link>
            </p>
          </div>
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
