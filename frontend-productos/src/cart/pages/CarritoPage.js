import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder, formatOrderId } from "../services/orderService";
import CartSummary from "../organisms/CartSummary";
import CheckoutForm from "../organisms/CheckoutForm";
import AuthModal from "../../components/modals/AuthModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { useConfirm } from "../../hooks/useConfirm";
import "./CarritoPage.css";

const CarritoPage = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const { pending, requestConfirm, handleConfirm, handleCancel } = useConfirm();

  const handleRemoveItem = (id) => {
    const item = items.find((i) => i.id === id);
    requestConfirm(
      {
        title: "Quitar producto",
        message: `¿Quitar "${item?.nombre}" del carrito?`,
        confirmLabel: "Quitar",
      },
      () => removeItem(id)
    );
  };

  const submitOrder = async ({ cliente, entrega }) => {
    setSubmitting(true);
    setCheckoutError('');
    try {
      const response = await createOrder({
        cliente: { ...cliente, email: user.email },
        entrega,
        items: items.map(({ id, nombre, precio, cantidad }) => ({
          id,
          nombre,
          precio,
          cantidad,
        })),
        total: totalPrice,
      });
      setConfirmedOrder(response.data.pedido);
      clearCart();
    } catch (err) {
      setCheckoutError(err.message || 'No se pudo completar el pedido. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = ({ cliente, entrega }) => {
    requestConfirm(
      {
        title: "Confirmar pedido",
        message: `¿Confirmar tu pedido por $${totalPrice}? Recibirás la confirmación al instante.`,
        confirmLabel: "Confirmar pedido",
      },
      () => submitOrder({ cliente, entrega })
    );
  };

  if (confirmedOrder) {
    return (
      <div className="carrito-container">
        <div className="order-confirmation">
          <h2>¡Gracias, {confirmedOrder.cliente.nombre}!</h2>
          <p>
            Tu pedido <strong>#{formatOrderId(confirmedOrder.id)}</strong> fue registrado.
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
          onRemove={handleRemoveItem}
          total={totalPrice}
        />
        {items.length > 0 && (
          user ? (
            <div>
              {checkoutError && <p className="checkout-error">{checkoutError}</p>}
              <CheckoutForm onSubmit={handleCheckout} submitting={submitting} />
            </div>
          ) : (
            <div className="checkout-form login-required">
              <h3>Inicia sesión para comprar</h3>
              <p>Regístrate o inicia sesión para completar tu pedido.</p>
              <button className="checkout-submit" onClick={() => setShowAuth(true)}>
                Iniciar sesión / Registrarme
              </button>
            </div>
          )
        )}
      </div>

      {showAuth && (
        <AuthModal initialView="register" onClose={() => setShowAuth(false)} />
      )}

      {pending && (
        <ConfirmModal
          title={pending.title}
          message={pending.message}
          confirmLabel={pending.confirmLabel}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default CarritoPage;
