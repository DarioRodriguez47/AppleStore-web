import React from "react";
import { useModalDismiss } from "../../hooks/useModalDismiss";
import "./Modal.css";
import "./ConfirmModal.css";

// Modal de confirmación reutilizable para cualquier acción importante
// (borrar producto, quitar del carrito, cerrar sesión, cambiar estado de
// un pedido, confirmar compra), en vez del window.confirm() nativo del
// navegador, para que se vea consistente con el resto del sitio.
const ConfirmModal = ({
  title = "¿Estás seguro?",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  const handleOverlayClick = useModalDismiss(onCancel);

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div
        className="login-container confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <h2 id="confirm-modal-title" className="confirm-modal-title">
          {title}
        </h2>
        {message && <p className="confirm-modal-message">{message}</p>}

        <div className="confirm-modal-actions">
          <button type="button" className="confirm-modal-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? "confirm-modal-confirm danger" : "confirm-modal-confirm"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
