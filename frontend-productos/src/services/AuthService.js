// services/AuthService.js

// Auth service adaptado para sitio estático: usa localStorage para simular registro/login

const USERS_KEY = "static_users";

// Única cuenta con rol "admin" en la demo; todo el que se registra desde el
// sitio público queda como "cliente" (ver register()).
const ADMIN_DEMO_USER = {
  username: "admin@apple.com",
  password: "admin123",
  name: "Administrador",
  role: "admin",
};

const seedDemoAdmin = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  if (users.length === 0) {
    localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN_DEMO_USER]));
  }
};
seedDemoAdmin();

export const login = async (username, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) throw new Error("Credenciales inválidas (sitio estático)");
  return {
    token: `local-token-${btoa(username)}`,
    user: { email: user.username, name: user.name || "", role: user.role || "cliente" },
  };
};

export const register = async (username, password, extra = {}) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  if (users.find((u) => u.username === username))
    throw new Error("Usuario ya existe");
  const newUser = { username, password, ...extra, role: "cliente" };
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
