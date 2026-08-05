// Servicio adaptado para sitio estático: usa JSON en `public/data` y localStorage para mutaciones.
// El catálogo base (productos.json) se combina con lo que el usuario cree/edite/borre en localStorage,
// para que el CRUD se sienta real aunque no haya backend.
const BASE = process.env.PUBLIC_URL || "";
const LOCAL_KEY = "productos_local";
const DELETED_KEY = "productos_eliminados";

let baseCatalogoCache = null;

const cargarCatalogoBase = async () => {
  if (baseCatalogoCache) return baseCatalogoCache;
  const res = await fetch(`${BASE}/data/productos.json`);
  baseCatalogoCache = await res.json();
  return baseCatalogoCache;
};

const cargarProductosLocales = () =>
  JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");

const cargarEliminados = () =>
  JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");

const obtenerCatalogoCompleto = async () => {
  const base = await cargarCatalogoBase();
  const locales = cargarProductosLocales();
  const eliminados = cargarEliminados();

  const combinados = [...base, ...locales].filter(
    (p) => !eliminados.includes(String(p._id)),
  );

  // Si un producto local sobreescribe uno base (mismo _id), se queda con la versión editada.
  const porId = new Map();
  combinados.forEach((p) => porId.set(String(p._id), p));
  return Array.from(porId.values());
};

export const getProductos = async () => {
  const productos = await obtenerCatalogoCompleto();
  return { data: { productos } };
};

export const getProducto = async (id) => {
  const productos = await obtenerCatalogoCompleto();
  const producto = productos.find((p) => String(p._id) === String(id)) || null;
  return { data: { producto } };
};

export const saveProducto = async (producto) => {
  const stored = cargarProductosLocales();
  const nuevoProducto = { ...producto, _id: producto._id || `local_${Date.now()}` };
  stored.push(nuevoProducto);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(stored));
  return { data: { producto: nuevoProducto } };
};

export const updateProducto = async (id, producto) => {
  const stored = cargarProductosLocales();
  const idx = stored.findIndex((p) => String(p._id) === String(id));

  let productoActualizado;
  if (idx >= 0) {
    stored[idx] = { ...stored[idx], ...producto, _id: id };
    productoActualizado = stored[idx];
  } else {
    // Es un producto del catálogo base: se clona a localStorage con los cambios aplicados.
    const base = await cargarCatalogoBase();
    const original = base.find((p) => String(p._id) === String(id)) || {};
    productoActualizado = { ...original, ...producto, _id: id };
    stored.push(productoActualizado);
  }

  localStorage.setItem(LOCAL_KEY, JSON.stringify(stored));
  return { data: { producto: productoActualizado } };
};

export const deleteProducto = async (id) => {
  const stored = cargarProductosLocales().filter(
    (p) => String(p._id) !== String(id),
  );
  localStorage.setItem(LOCAL_KEY, JSON.stringify(stored));

  const eliminados = cargarEliminados();
  if (!eliminados.includes(String(id))) {
    eliminados.push(String(id));
    localStorage.setItem(DELETED_KEY, JSON.stringify(eliminados));
  }

  return { data: { deleted: id } };
};

export const uploadImage = async (id, formData) => {
  // En sitio estático no se suben archivos; simular respuesta
  return { data: { message: "Upload disabled in static build" } };
};

export const getImage = (imageName) => {
  if (!imageName) return "";
  if (imageName.startsWith("http") || imageName.startsWith("data:")) return imageName;
  return `${BASE}/img/products/${imageName}`;
};
