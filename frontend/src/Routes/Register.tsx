import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import RegisterForm from "../Components/Register/RegisterForm";
import Logo from "../Components/UI/Logo";
import { Link } from "react-router-dom";

const Register = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Register | ChatHaven";
  }, [location.pathname]);
  return (
    <div className="w-full bg-slate-100">
      <div className="lg:w-1/3 w-full mx-auto flex flex-col justify-center bg-white m-2 rounded-2xl col-span-2">
        <div className="flex flex-col justify-center items-center gap-8">
          <Logo classes="w-36" />
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
              <Link className="text-sm font-medium hover:underline" to="/Login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
