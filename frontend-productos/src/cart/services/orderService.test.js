import { createOrder, getOrders, getMyOrders, updateOrderStatus, trackOrder, formatOrderId } from './orderService';

beforeEach(() => {
  localStorage.clear();
});

const baseOrder = {
  cliente: { nombre: 'Ana', telefono: '0990000000', email: 'ana@example.com' },
  entrega: { tipo: 'retiro' },
  items: [{ id: '1', nombre: 'iPhone', precio: 100, cantidad: 1 }],
  total: 100,
};

test('createOrder persists an order retrievable via getOrders', async () => {
  const { data } = await createOrder(baseOrder);
  expect(data.pedido.estado).toBe('pendiente');

  const { data: listData } = await getOrders();
  expect(listData.pedidos.some((p) => p.id === data.pedido.id)).toBe(true);
});

test('updateOrderStatus changes the stored status', async () => {
  const { data } = await createOrder(baseOrder);

  await updateOrderStatus(data.pedido.id, 'entregado');

  const { data: listData } = await getOrders();
  const updated = listData.pedidos.find((p) => p.id === data.pedido.id);
  expect(updated.estado).toBe('entregado');
});

test('getMyOrders only returns orders belonging to that email', async () => {
  // Simula un pedido de demo sin email (los que ve el admin) y uno de otra
  // cuenta: ninguno debería aparecer en "mis pedidos" de ana@example.com.
  localStorage.setItem(
    'pedidos',
    JSON.stringify([
      { id: 'demo-999', fecha: '2026-01-01T00:00:00.000Z', cliente: {}, entrega: {}, items: [], total: 0, estado: 'pendiente' },
    ]),
  );
  await createOrder({ ...baseOrder, cliente: { nombre: 'Otro', telefono: '000', email: 'otro@example.com' } });

  const { data } = await createOrder(baseOrder);

  const { data: mineData } = await getMyOrders('ana@example.com');
  expect(mineData.pedidos.map((p) => p.id)).toEqual([data.pedido.id]);

  const { data: allData } = await getOrders();
  expect(allData.pedidos).toHaveLength(3);
});

test('trackOrder finds an order by short id + phone without needing a session', async () => {
  const { data } = await createOrder(baseOrder);

  const found = await trackOrder(formatOrderId(data.pedido.id), baseOrder.cliente.telefono);
  expect(found.data.pedido.id).toBe(data.pedido.id);

  const wrongPhone = await trackOrder(formatOrderId(data.pedido.id), '9999999999');
  expect(wrongPhone.data.pedido).toBeNull();
});
