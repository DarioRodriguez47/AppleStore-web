import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import CartSummary from "../organisms/CartSummary";
import CheckoutForm from "../organisms/CheckoutForm";
import "./CarritoPage.css";

const CarritoPage = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleCheckout = async ({ cliente, entrega }) => {
    setSubmitting(true);
    const response = await createOrder({
      cliente,
      entrega,
      items: items.map(({ id, nombre, precio, cantidad }) => ({
        id,
        nombre,
        precio,
        cantidad,
      })),
      total: totalPrice,
    });
    setSubmitting(false);
    setConfirmedOrder(response.data.pedido);
    clearCart();
  };

  if (confirmedOrder) {
    return (
      <div className="carrito-container">
        <div className="order-confirmation">
          <h2>¡Gracias, {confirmedOrder.cliente.nombre}!</h2>
          <p>
            Tu pedido <strong>#{confirmedOrder.id}</strong> fue registrado.
          </p>
          <p>
            {confirmedOrder.entrega.tipo === "delivery"
              ? `Lo enviaremos a: ${confirmedOrder.entrega.direccion}`
              : "Puedes retirarlo en tienda."}
          </p>
          <div className="order-confirmation-actions">
            <Link to="/catalogo" className="checkout-submit">
              Seguir comprando
            </Link>
            <Link to="/mis-pedidos" className="link-button">
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <Link to="/catalogo" className="back-link">
        &larr; Volver a la tienda
      </Link>
      <h2 className="carrito-title">Tu carrito</h2>
      <div className="carrito-grid">
        <CartSummary
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          total={totalPrice}
        />
        {items.length > 0 && (
          <CheckoutForm onSubmit={handleCheckout} submitting={submitting} />
        )}
      </div>
    </div>
  );
};

export default CarritoPage;
