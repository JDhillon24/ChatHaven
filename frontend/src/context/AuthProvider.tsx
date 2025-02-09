import React, { createContext, useState, useEffect } from "react";

interface AuthStateAuthenticated {
  isAuthenticated: true;
  user: {
    name: string;
    email: string;
    profilePicture: string;
    accessToken: string;
  };
}

interface AuthStateNotAuthenticated {
  isAuthenticated: false;
  user?: undefined;
}

export type AuthState = AuthStateAuthenticated | AuthStateNotAuthenticated;

export function isAuthenticatedState(
  state: AuthState
): state is AuthStateAuthenticated {
  return state.isAuthenticated === true;
}

export interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false });

  const [persist, setPersist] = useState(() => {
    const persistData = localStorage.getItem("persist");
    return persistData ? JSON.parse(persistData) : false;
  });

  // Sync persist state with localStorage
  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
