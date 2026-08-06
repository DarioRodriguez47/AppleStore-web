import React from "react";
import "./StatusBadge.css";

export const ESTADO_LABELS = {
  pendiente: "Pendiente",
  en_preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const StatusBadge = ({ estado }) => (
  <span className={`status-badge status-${estado}`}>
    {ESTADO_LABELS[estado] || estado}
  </span>
);

export default StatusBadge;
