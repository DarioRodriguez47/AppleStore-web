import React from "react";
import "./OrderStatusTracker.css";

const STEPS = [
  { key: "pendiente", label: "Pendiente" },
  { key: "en_preparacion", label: "En preparación" },
  { key: "enviado", label: "Enviado" },
  { key: "entregado", label: "Entregado" },
];

// Línea de tiempo visual del pedido — más claro de un vistazo que solo un
// badge de texto con el estado actual.
const OrderStatusTracker = ({ estado }) => {
  if (estado === "cancelado") {
    return (
      <div className="status-tracker-cancelled">
        <span className="status-tracker-cancelled-icon" aria-hidden="true">×</span>
        <span>Este pedido fue cancelado</span>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === estado);

  return (
    <div className="status-tracker">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <React.Fragment key={step.key}>
            <div className={`status-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
              <span className="status-step-dot">{isCompleted ? "✓" : index + 1}</span>
              <span className="status-step-label">{step.label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`status-step-line ${index < currentIndex ? "completed" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
