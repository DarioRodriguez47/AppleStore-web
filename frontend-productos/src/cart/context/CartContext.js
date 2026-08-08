import React, { createContext, useContext, useEffect, useState } from "react";
import { safeGetItem, safeSetItem } from "../../utils/safeStorage";

const CART_KEY = "cart_items";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = safeGetItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    safeSetItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (producto) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === producto._id);
      if (existing) {
        return prev.map((item) =>
          item.id === producto._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: producto._id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          cantidad: 1,
        },
      ];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item)),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.cantidad * item.precio,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
