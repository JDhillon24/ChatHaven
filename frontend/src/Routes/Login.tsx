import React from "react";
import Logo from "../Components/UI/Logo";
import { Link } from "react-router-dom";
import LoginForm from "../Components/Login/LoginForm";

const Login = () => {
  return (
    <div className="w-full bg-slate-100">
      <div className="lg:w-1/3 w-full mx-auto flex flex-col justify-center bg-white m-2 rounded-2xl col-span-2">
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
                to="/Signup"
                className="text-sm font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
