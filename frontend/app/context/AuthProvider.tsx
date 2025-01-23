import React, { createContext, useState } from "react";

interface AuthStateAuthenticated {
  isAuthenticated: true;
  user: {
    name: string;
    email: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
