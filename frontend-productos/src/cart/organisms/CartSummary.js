import React from "react";
import CartLineItem from "../molecules/CartLineItem";
import "./CartSummary.css";

const CartSummary = ({ items, onUpdateQuantity, onRemove, total }) => (
  <div className="cart-summary">
    {items.length === 0 ? (
      <p className="cart-empty">Tu carrito está vacío.</p>
    ) : (
      <>
        <div className="cart-lines">
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </div>
        <div className="cart-total">
          <span>Total</span>
          <strong>${total}</strong>
        </div>
      </>
    )}
  </div>
);

export default CartSummary;
