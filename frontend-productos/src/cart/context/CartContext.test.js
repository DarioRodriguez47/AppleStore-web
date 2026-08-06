import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const iphone = { _id: '1', nombre: 'iPhone', precio: 100, imagen: 'iphone.jpg' };

beforeEach(() => {
  localStorage.clear();
});

test('addItem adds a new product and increments quantity on repeat', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addItem(iphone);
  });
  expect(result.current.items).toHaveLength(1);
  expect(result.current.totalItems).toBe(1);

  act(() => {
    result.current.addItem(iphone);
  });
  expect(result.current.items).toHaveLength(1);
  expect(result.current.items[0].cantidad).toBe(2);
  expect(result.current.totalPrice).toBe(200);
});

test('updateQuantity removes the item once quantity drops below 1', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addItem(iphone);
  });
  act(() => {
    result.current.updateQuantity(iphone._id, 0);
  });

  expect(result.current.items).toHaveLength(0);
});

test('removeItem takes a product out of the cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addItem(iphone);
  });
  act(() => {
    result.current.removeItem(iphone._id);
  });

  expect(result.current.items).toHaveLength(0);
  expect(result.current.totalPrice).toBe(0);
});
