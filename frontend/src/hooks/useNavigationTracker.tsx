import React, { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type ContextType = {
  historyStack: string[];
};

const NavigationContext = createContext<ContextType>({
  historyStack: [],
});

export const NavigationTracker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const historyStack = useRef<string[]>([]);

  useEffect(() => {
    historyStack.current.push(location.pathname);
  }, [location]);
  return (
    <NavigationContext.Provider value={{ historyStack: historyStack.current }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationTracker = () => useContext(NavigationContext);
