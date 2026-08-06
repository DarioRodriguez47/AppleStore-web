import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../services/orderService";
import OrderCard from "../molecules/OrderCard";
import "./MisPedidosPage.css";

// "Mis pedidos" son los pedidos hechos por la cuenta logueada (por email).
// Solo se llega aquí con sesión iniciada (el enlace del nav ya está oculto
// si no la hay); si alguien entra por una URL vieja sin sesión, se lo
// manda de vuelta a la tienda en vez de mostrarle un formulario de login.
const MisPedidosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/productos", { replace: true });
      return;
    }
    getMyOrders(user.email).then((response) => setPedidos(response.data.pedidos));
  }, [user, navigate]);

  if (!user) return null;

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
