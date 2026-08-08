// services/AuthService.js
//
// Nota interna: persiste en localStorage (no hay backend propio todavía).
// Ningún mensaje de cara al usuario debe delatar esto — mantenerlos como
// los de un login real.
import { safeGetItem, safeSetItem } from "../utils/safeStorage";

const USERS_KEY = "static_users";

// Única cuenta con rol "admin"; todo el que se registra desde el sitio
// público queda como "cliente" (ver register()).
const ADMIN_DEMO_USER = {
  username: "admin@apple.com",
  password: "admin123",
  name: "Administrador",
  role: "admin",
};

const seedDemoAdmin = () => {
  const users = JSON.parse(safeGetItem(USERS_KEY) || "[]");
  if (users.length === 0) {
    safeSetItem(USERS_KEY, JSON.stringify([ADMIN_DEMO_USER]));
  }
};
seedDemoAdmin();

export const login = async (username, password) => {
  const users = JSON.parse(safeGetItem(USERS_KEY) || "[]");
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) throw new Error("Credenciales incorrectas. Inténtalo de nuevo.");
  return {
    token: `local-token-${btoa(username)}`,
    user: { email: user.username, name: user.name || "", role: user.role || "cliente" },
  };
};

export const register = async (username, password, extra = {}) => {
  const users = JSON.parse(safeGetItem(USERS_KEY) || "[]");
  if (users.find((u) => u.username === username))
    throw new Error("Ya existe una cuenta con ese correo");
  const newUser = { username, password, ...extra, role: "cliente" };
  users.push(newUser);
  if (!safeSetItem(USERS_KEY, JSON.stringify(users))) {
    throw new Error("No se pudo crear la cuenta. Intenta de nuevo.");
  }
  return { message: "Cuenta creada correctamente" };
};

export const requestPasswordReset = async (email) => {
  return {
    message: "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
  };
};
