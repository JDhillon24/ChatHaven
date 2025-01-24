import React from "react";
import axios from "../api/axios";
import useAuth from "./useAuth";
import { AuthState, isAuthenticatedState } from "../context/AuthProvider";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.post("/user/token", {
      withCredentials: true,
    });

    setAuth((prev: AuthState) => {
      if (isAuthenticatedState(prev)) {
        return {
          ...prev,
          user: {
            name: prev.user.name,
            email: prev.user.email,
            accessToken: response.data.accessToken,
          },
        };
      } else {
        return {
          ...prev,
        };
      }
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
