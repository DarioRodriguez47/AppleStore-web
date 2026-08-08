import React from "react";
import ProductoForm from "../../components/ProductoForm";
import { useModalDismiss } from "../../hooks/useModalDismiss";
import "../../components/modals/Modal.css";
import "./ProductFormModal.css";

const ProductFormModal = ({ producto, isEdit, onClose, fetchProductos }) => {
  const handleOverlayClick = useModalDismiss(onClose);

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
