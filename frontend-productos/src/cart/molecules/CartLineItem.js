import React from "react";
import QuantityStepper from "../atoms/QuantityStepper";
import { getImage } from "../../services/productoService";
import "./CartLineItem.css";

const CartLineItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="cart-line-item">
    {item.imagen && (
      <img
        src={getImage(item.imagen)}
        alt={item.nombre}
        className="cart-line-image"
      />
    )}
    <div className="cart-line-info">
      <span className="cart-line-name">{item.nombre}</span>
      <span className="cart-line-price">${item.precio}</span>
    </div>
    <QuantityStepper
      value={item.cantidad}
      onChange={(cantidad) => onUpdateQuantity(item.id, cantidad)}
    />
    <span className="cart-line-subtotal">
      ${(item.precio * item.cantidad).toFixed(0)}
    </span>
    <button
      type="button"
      className="cart-line-remove"
      onClick={() => onRemove(item.id)}
      aria-label="Quitar del carrito"
    >
      ×
    </button>
  </div>
);

export default CartLineItem;
