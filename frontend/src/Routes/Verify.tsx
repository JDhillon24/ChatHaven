import { useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const email = emailParam ? decodeURIComponent(emailParam) : "";

  useEffect(() => {
    const verifyToken = async () => {
      try {
        //redirect to login with success modal if verification is successful
        await axios.get(`/user/verifyemail?token=${token}&email=${email}`);
        navigate("/Login", { state: { verifySuccess: true } });
      } catch (error) {
        //redirect to login with error modal if verification fails or link is invalid
        navigate("/Login", { state: { verifyFailed: true, email } });
      }
    };

    verifyToken();
  }, []);

  return null;
};

export default Verify;
