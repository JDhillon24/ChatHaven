import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
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
