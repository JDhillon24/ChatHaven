import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  //clears auth state and cookie
  const logout = async () => {
    setAuth({ isAuthenticated: false });
    try {
      await axios.post("/user/logout");
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};

export default useLogout;
