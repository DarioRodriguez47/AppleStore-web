import React, { useEffect } from "react";
import ProductoForm from "../../components/ProductoForm";
import "../../components/modals/Modal.css";
import "./ProductFormModal.css";

const ProductFormModal = ({ producto, isEdit, onClose, fetchProductos }) => {
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

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div
        className="login-container products-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
      >
        <button
          className="login-close-button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h3 id="product-form-title" className="products-modal-title">
          {isEdit ? `Editar: ${producto.nombre}` : "Nuevo producto"}
        </h3>
        <ProductoForm
          producto={producto}
          isEdit={isEdit}
          onCancel={onClose}
          fetchProductos={fetchProductos}
        />
      </div>
    </div>
  );
};

export default ProductFormModal;
