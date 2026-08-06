import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import OrderCard from "../molecules/OrderCard";
import "./MisPedidosPage.css";

// Como no hay cuentas de cliente reales (solo la sesión de administrador),
// "mis pedidos" son los pedidos hechos desde este navegador (no los de demo
// que ve el administrador).
const MisPedidosPage = () => {
  const [pedidos, setPedidos] = useState(null);

  useEffect(() => {
    getMyOrders().then((response) => setPedidos(response.data.pedidos));
  }, []);

  return (
    <div className="mis-pedidos-container">
      <Link to="/catalogo" className="back-link">
        &larr; Volver a la tienda
      </Link>
      <h2 className="mis-pedidos-title">Mis pedidos</h2>

      {pedidos === null && <p className="mis-pedidos-empty">Cargando...</p>}

      {pedidos !== null && pedidos.length === 0 && (
        <p className="mis-pedidos-empty">
          Todavía no has hecho ningún pedido.{" "}
          <Link to="/catalogo">Ir a la tienda</Link>
        </p>
      )}

      {pedidos !== null && pedidos.length > 0 && (
        <div className="mis-pedidos-list">
          {pedidos.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidosPage;
