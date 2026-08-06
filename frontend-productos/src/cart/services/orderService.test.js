import { createOrder, getOrders, getMyOrders, updateOrderStatus } from './orderService';

beforeEach(() => {
  localStorage.clear();
});

const baseOrder = {
  cliente: { nombre: 'Ana', telefono: '0990000000' },
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

test('getMyOrders only returns orders created from this browser', async () => {
  // Simula un pedido de "otro" (por ejemplo, seedDemoOrders) que no debería
  // aparecer en "mis pedidos" aunque esté en el almacenamiento global.
  localStorage.setItem(
    'pedidos',
    JSON.stringify([
      { id: 'demo-999', fecha: '2026-01-01T00:00:00.000Z', cliente: {}, entrega: {}, items: [], total: 0, estado: 'pendiente' },
    ]),
  );

  const { data } = await createOrder(baseOrder);

  const { data: mineData } = await getMyOrders();
  expect(mineData.pedidos.map((p) => p.id)).toEqual([data.pedido.id]);

  const { data: allData } = await getOrders();
  expect(allData.pedidos.map((p) => p.id).sort()).toEqual(
    ['demo-999', data.pedido.id].sort(),
  );
});
