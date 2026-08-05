import React, { createContext, useContext, useState } from "react";
import { login as loginService } from "../services/AuthService";

const USER_KEY = "auth_user";

const AuthContext = createContext(null);

// En esta demo no hay un rol de "cliente" separado: cualquier sesión iniciada
// puede administrar el catálogo (crear/editar/borrar). Sin sesión, la app se
// muestra en modo público (solo lectura).
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    await loginService(email, password);
    const loggedUser = { email };
    localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
