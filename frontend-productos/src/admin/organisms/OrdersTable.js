import React, { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
  formatOrderId,
  ESTADOS_PEDIDO,
} from "../../cart/services/orderService";
import StatusBadge, { ESTADO_LABELS } from "../../cart/atoms/StatusBadge";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { useConfirm } from "../../hooks/useConfirm";
import "./OrdersTable.css";

const OrdersTable = () => {
  const [pedidos, setPedidos] = useState([]);
  const { pending, requestConfirm, handleConfirm, handleCancel } = useConfirm();

  const fetchPedidos = async () => {
    const response = await getOrders();
    setPedidos(response.data.pedidos);
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleStatusChange = (id, estado) => {
    requestConfirm(
      {
        title: "Cambiar estado del pedido",
        message: `¿Cambiar el pedido #${formatOrderId(id)} a "${ESTADO_LABELS[estado]}"?`,
        confirmLabel: "Cambiar estado",
        danger: estado === "cancelado",
      },
      async () => {
        await updateOrderStatus(id, estado);
        fetchPedidos();
      }
    );
  };

  if (pedidos.length === 0) {
    return <p className="orders-empty">Todavía no hay pedidos.</p>;
  }

  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Entrega</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>
                <span className="order-id">#{formatOrderId(pedido.id)}</span>
                <span className="order-date">
                  {new Date(pedido.fecha).toLocaleDateString()}
                </span>
              </td>
              <td>
                <span className="order-customer-name">{pedido.cliente.nombre}</span>
                <span className="order-phone">{pedido.cliente.telefono}</span>
              </td>
              <td>
                {pedido.entrega.tipo === "delivery"
                  ? `Delivery: ${pedido.entrega.direccion}`
                  : "Retiro en tienda"}
              </td>
              <td>
                <ul className="order-items">
                  {pedido.items.map((item) => (
                    <li key={item.id}>
                      {item.cantidad}× {item.nombre}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="order-total">${pedido.total}</td>
              <td>
                <StatusBadge estado={pedido.estado} />
                <select
                  className="order-status-select"
                  value={pedido.estado}
                  onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                >
                  {ESTADOS_PEDIDO.map((estado) => (
                    <option key={estado} value={estado}>
                      {ESTADO_LABELS[estado]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pending && (
        <ConfirmModal
          title={pending.title}
          message={pending.message}
          confirmLabel={pending.confirmLabel}
          danger={pending.danger}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default OrdersTable;
