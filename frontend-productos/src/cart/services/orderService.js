// Servicio de pedidos: mismo patrón que productoService (localStorage a modo
// de "backend"), para que el checkout se sienta completo sin servidor real.
const ORDERS_KEY = "pedidos";

export const ESTADOS_PEDIDO = [
  "pendiente",
  "en_preparacion",
  "enviado",
  "entregado",
  "cancelado",
];

const seedSampleOrders = () => {
  if (localStorage.getItem(ORDERS_KEY)) return;
  const sampleOrders = [
    {
      id: "ord_1785597600000",
      fecha: "2026-08-01T15:20:00.000Z",
      // Sin "email": son pedidos de ejemplo para poblar el panel de admin,
      // no de una cuenta real, así que nunca deben aparecer en "mis
      // pedidos" de nadie.
      cliente: { nombre: "Valentina Cruz", telefono: "0991234567" },
      entrega: { tipo: "delivery", direccion: "Av. Amazonas N34-120, Quito" },
      items: [
        { id: "2", nombre: "iPhone 15 Pro", precio: 999, cantidad: 1 },
        { id: "7", nombre: "AirPods Pro (2ª generación)", precio: 249, cantidad: 1 },
      ],
      total: 1248,
      estado: "en_preparacion",
    },
    {
      id: "ord_1785751500000",
      fecha: "2026-08-03T10:05:00.000Z",
      cliente: { nombre: "Mateo Salazar", telefono: "0987654321" },
      entrega: { tipo: "retiro" },
      items: [{ id: "5", nombre: "Apple Watch Series 9", precio: 429, cantidad: 1 }],
      total: 429,
      estado: "pendiente",
    },
  ];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(sampleOrders));
};
seedSampleOrders();

const readOrders = () => JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
const writeOrders = (orders) =>
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

export const getOrders = async () => {
  const pedidos = [...readOrders()].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha),
  );
  return { data: { pedidos } };
};

// Pedidos de la cuenta logueada (por email). Los pedidos de ejemplo no
// tienen email, así que nunca calzan con una cuenta real.
export const getMyOrders = async (email) => {
  const pedidos = readOrders()
    .filter((p) => p.cliente.email === email)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return { data: { pedidos } };
};

export const createOrder = async ({ cliente, entrega, items, total }) => {
  const pedido = {
    id: `ord_${Date.now()}`,
    fecha: new Date().toISOString(),
    cliente,
    entrega,
    items,
    total,
    estado: "pendiente",
  };
  const orders = readOrders();
  orders.push(pedido);
  writeOrders(orders);
  return { data: { pedido } };
};

// Número de pedido corto para mostrar al usuario (el id interno es largo
// y poco natural para un comprobante de compra).
export const formatOrderId = (id) => id.replace(/^ord_/, "").slice(-6);

export const updateOrderStatus = async (id, estado) => {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return { data: { pedido: null } };
  orders[idx] = { ...orders[idx], estado };
  writeOrders(orders);
  return { data: { pedido: orders[idx] } };
};

// Rastreo público (sin sesión): número de pedido + teléfono, igual que
// "rastrea tu pedido" en una tienda real. El teléfono actúa como
// verificación mínima para no exponer el pedido de otra persona con solo
// adivinar el número.
export const trackOrder = async (numeroPedido, telefono) => {
  const numero = String(numeroPedido || "").trim();
  const tel = String(telefono || "").trim();
  const pedido = readOrders().find(
    (o) => formatOrderId(o.id) === numero && o.cliente.telefono === tel,
  );
  return { data: { pedido: pedido || null } };
};
