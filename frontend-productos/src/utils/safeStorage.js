// Envoltura de localStorage que nunca revienta la app: si falla (cuota
// llena, modo privado sin storage habilitado, etc.), lo registra en
// consola y sigue en vez de dejar caer el árbol de React a una pantalla
// en blanco.
export const safeGetItem = (key, fallback = null) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (err) {
    console.warn(`No se pudo leer "${key}" de localStorage:`, err);
    return fallback;
  }
};

export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`No se pudo guardar "${key}" en localStorage:`, err);
    return false;
  }
};
