import { createContext, useContext, useState } from "react";
import * as adminApi from "../api/admin";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));
  const [username, setUsername] = useState(() => localStorage.getItem("adminUsername"));

  const login = async (user, password) => {
    const data = await adminApi.adminLogin(user, password);
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUsername", data.username);
    setToken(data.token);
    setUsername(data.username);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
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
