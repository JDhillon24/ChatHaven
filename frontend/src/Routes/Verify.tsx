import { useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`/user/verifyemail?token=${token}`);
        navigate("/Home", { state: { verifySuccess: true } });
      } catch (error) {
        navigate("/Home", { state: { verifyFailed: true } });
      }
    };

    verifyToken();
  }, []);

  return null;
};

export default Verify;
