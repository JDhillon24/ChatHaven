import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // useEffect(() => {
  //   console.log(auth);
  // }, []);
  return auth.user?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/Login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
