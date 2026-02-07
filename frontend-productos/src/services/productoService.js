// Servicio adaptado para sitio estático.
// Lee `public/data/productos.json` en producción (CRA copia `public` a `build`).
const API_BASE = process.env.PUBLIC_URL || '';

export const getProductos = async () => {
  // Mantener la forma { data: { productos } } para compatibilidad con componentes existentes
  const res = await fetch(`${API_BASE}/data/productos.json`);
  const productos = await res.json().catch(() => []);
  return { data: { productos } };
};

export const getProducto = async (id) => {
  const res = await fetch(`${API_BASE}/data/productos.json`);
  const productos = await res.json().catch(() => []);
  const producto = productos.find(p => String(p._id) === String(id));
  return { data: { producto } };
};

// Las funciones que mutan datos no están disponibles en sitio estático.
export const saveProducto = async () => { throw new Error('saveProducto no disponible en sitio estático'); };
export const updateProducto = async () => { throw new Error('updateProducto no disponible en sitio estático'); };
export const deleteProducto = async () => { throw new Error('deleteProducto no disponible en sitio estático'); };
export const uploadImage = async () => { throw new Error('uploadImage no disponible en sitio estático'); };

export const getImage = (imageName) => {
  // Si tienes imágenes en `public/uploads` usa `${API_BASE}/uploads/${imageName}`
  return `${API_BASE}/data/${imageName}`;
};


