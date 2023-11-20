import { createContext, useContext, useState } from "react";

import {
  clearStoredLoginData,
  getStoredLoginData,
  setStoredLoginData,
} from "./local-storage";
import { LoginData } from "./types";

type AuthContextValue = {
  loginData: LoginData;
  setLoginData: (loginData: LoginData) => void;
  clearLoginData: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useLoginData = () => {
  const authId = useContext(AuthContext);
  if (!authId) {
    throw new Error(
      "Error! AuthContext called from outside the AuthContextProvider"
    );
  }

  return authId;
};

export const AuthContextProvider = ({
  children,
}: React.PropsWithChildren<object>) => {
  const [loginData, setLoginDataRaw] = useState<LoginData | null>(() =>
    getStoredLoginData()
  );

  const setLoginData = ({ userId, userToken }: LoginData) => {
    setLoginDataRaw({ userId, userToken });
    setStoredLoginData({ userId, userToken });
  };

  const clearLoginData = () => {
    setLoginDataRaw(null);
    clearStoredLoginData();
  };

  return (
    <AuthContext.Provider value={{ loginData, clearLoginData, setLoginData }}>
      {children}
    </AuthContext.Provider>
  );
};
