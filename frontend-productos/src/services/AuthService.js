// services/AuthService.js

// Auth service adaptado para sitio estático: usa localStorage para simular registro/login

const USERS_KEY = "static_users";

export const login = async (username, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) throw new Error("Credenciales inválidas (sitio estático)");
  // Retornar token simulado
  return { token: `local-token-${btoa(username)}` };
};

export const register = async (username, password, extra = {}) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  if (users.find((u) => u.username === username))
    throw new Error("Usuario ya existe");
  const newUser = { username, password, ...extra };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { message: "Usuario registrado (sitio estático)" };
};

export const requestPasswordReset = async (email) => {
  // En sitio estático, solo simular
  return {
    message: "Si ese email existiera, se habría enviado un enlace (simulado).",
  };
};

export const resetPassword = async (token, password) => {
  // Simulación: no soportado en static
  return { message: "Reset de contraseña simulado en sitio estático." };
};
