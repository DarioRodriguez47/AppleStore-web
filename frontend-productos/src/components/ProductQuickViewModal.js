import React, { useEffect, useState } from "react";
import { getImage } from "../services/productoService";
import "./modals/Modal.css";
import "./ProductQuickViewModal.css";

// Vista rápida del producto sobre la misma tienda (no navega a otra página),
// igual que el resto de los modales de la app (login, formulario de admin).
const ProductQuickViewModal = ({ producto, onClose, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddToCart = () => {
    onAddToCart(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div
        className="login-container product-quick-view"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        <button
          className="login-close-button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        {producto.imagen && (
          <img
            src={getImage(producto.imagen)}
            alt={producto.nombre}
            className="quick-view-image"
          />
        )}

        <h2 id="quick-view-title" className="quick-view-title">
          {producto.nombre}
        </h2>
        <p className="quick-view-description">{producto.descripcion}</p>

        <div className="quick-view-specs">
          <span>
            <strong>Edición:</strong> {producto.edicion}
          </span>
          <span>
            <strong>Año:</strong> {producto.anio}
          </span>
          <span className="quick-view-price">${producto.precio}</span>
        </div>

        <button className="checkout-submit" onClick={handleAddToCart}>
          {added ? "Agregado ✓" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
