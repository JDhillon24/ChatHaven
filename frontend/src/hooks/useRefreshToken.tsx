import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  //grants new access token based on refresh token in cookies
  const refresh = async () => {
    const response = await axios.post("/user/token", {
      withCredentials: true,
    });

    setAuth(() => {
      return {
        isAuthenticated: true,
        user: {
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture,
          accessToken: response.data.accessToken,
        },
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
