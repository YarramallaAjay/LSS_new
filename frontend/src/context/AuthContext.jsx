import { createContext, useContext, useState } from "react";
import * as adminApi from "../api/admin";
import { STORAGE_KEYS } from "../lib/constants.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN));
  const [username, setUsername] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.ADMIN_USERNAME)
  );

  const login = async (user, password) => {
    const data = await adminApi.adminLogin(user, password);
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERNAME, data.username);
    setToken(data.token);
    setUsername(data.username);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USERNAME);
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
