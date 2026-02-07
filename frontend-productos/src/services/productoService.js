// Servicio adaptado para sitio estático: usa JSON en `public/data` y localStorage para mutaciones
const BASE = process.env.PUBLIC_URL || "";

export const getProductos = async () => {
  const res = await fetch(`${BASE}/data/productos.json`);
  const data = await res.json();
  return { data };
};

export const getProducto = async (id) => {
  const res = await fetch(`${BASE}/data/productos.json`);
  const productos = await res.json();
  const item = productos.find((p) => String(p._id) === String(id));
  return { data: item || null };
};

// Mutaciones: persistir en localStorage como demo (no persistirá en servidor)
const LOCAL_KEY = "productos_local";

export const saveProducto = async (producto) => {
  const stored = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  // Generar id simple si no existe
  producto._id = producto._id || `local_${Date.now()}`;
  stored.push(producto);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(stored));
  return { data: producto };
};

export const updateProducto = async (id, producto) => {
  const stored = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  const idx = stored.findIndex((p) => String(p._id) === String(id));
  if (idx >= 0) {
    stored[idx] = { ...stored[idx], ...producto };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(stored));
    return { data: stored[idx] };
  }
  return { data: null };
};

export const deleteProducto = async (id) => {
  const stored = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  const filtered = stored.filter((p) => String(p._id) !== String(id));
  localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  return { data: { deleted: id } };
};

export const uploadImage = async (id, formData) => {
  // En sitio estático no se suben archivos; simular respuesta
  return { data: { message: "Upload disabled in static build" } };
};

export const getImage = (imageName) => {
  return `${BASE}/img/uploads/${imageName}`;
};
