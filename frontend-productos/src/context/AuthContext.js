import React, { createContext, useContext, useState } from "react";
import { login as loginService } from "../services/AuthService";

const USER_KEY = "auth_user";

const AuthContext = createContext(null);

// Dos roles: "admin" (administra el catálogo y los pedidos) y "cliente"
// (compra en la tienda). Quien se registra desde el sitio público siempre
// queda como "cliente"; la única cuenta "admin" es la sembrada por demo.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const response = await loginService(email, password);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        isCliente: user?.role === "cliente",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
