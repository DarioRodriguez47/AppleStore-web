import React from "react";
import StatusBadge from "../atoms/StatusBadge";
import { formatOrderId } from "../services/orderService";
import "./OrderCard.css";

const OrderCard = ({ pedido }) => (
  <div className="order-card">
    <div className="order-card-header">
      <div>
        <span className="order-card-id">Pedido #{formatOrderId(pedido.id)}</span>
        <span className="order-card-date">
          {new Date(pedido.fecha).toLocaleDateString()}
        </span>
      </div>
      <StatusBadge estado={pedido.estado} />
    </div>

    <ul className="order-card-items">
      {pedido.items.map((item) => (
        <li key={item.id}>
          <span>
            {item.cantidad}× {item.nombre}
          </span>
          <span>${item.precio * item.cantidad}</span>
        </li>
      ))}
    </ul>

    <div className="order-card-footer">
      <span className="order-card-delivery">
        {pedido.entrega.tipo === "delivery"
          ? `Delivery: ${pedido.entrega.direccion}`
          : "Retiro en tienda"}
      </span>
      <span className="order-card-total">${pedido.total}</span>
    </div>
  </div>
);

export default OrderCard;
