import React from "react";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.post("/user/token", {
      withCredentials: true,
    });

    setAuth((prev) => {
      return {
        ...prev,
        user: {
          name: prev.user.name,
          email: prev.user.email,
          accessToken: response.data.accessToken,
        },
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
