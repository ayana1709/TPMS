/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

import api from "../api";
const StoreContext = createContext({});

function StoreProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isManagerSuccessModalOpen, setIsManagerSuccessModalOpen] =
    useState(true);
  return (
    <StoreContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isManagerSuccessModalOpen,
        setIsManagerSuccessModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function useStores() {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("context used outside of scope");
  return context;
}

export { StoreProvider, useStores };
