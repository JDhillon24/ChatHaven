import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.post("/user/token", {
      withCredentials: true,
    });

    setAuth(() => {
      // console.log(`prev: ${JSON.stringify(prev)}`);
      return {
        isAuthenticated: true,
        user: {
          name: response.data.name,
          email: response.data.email,
          accessToken: response.data.accessToken,
        },
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
