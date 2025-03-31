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
        const response = await axios.get(
          `/user/verifyemail?token=${token}&email=${email}`
        );
        navigate("/Home", { state: { verifySuccess: true } });
      } catch (error) {
        navigate("/Home", { state: { verifyFailed: true, email } });
      }
    };

    verifyToken();
  }, []);

  return null;
};

export default Verify;
