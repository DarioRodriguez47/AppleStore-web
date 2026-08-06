import React, { useState } from "react";
import { Link } from "react-router-dom";
import { trackOrder } from "../services/orderService";
import OrderCard from "../molecules/OrderCard";
import "./TrackOrderPage.css";

// Rastreo público de pedidos (sin sesión): número de pedido + teléfono,
// como el "rastrea tu pedido" de cualquier tienda real. "Mis pedidos"
// (con historial completo) solo está disponible con sesión iniciada.
const TrackOrderPage = () => {
  const [numero, setNumero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pedido, setPedido] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await trackOrder(numero.trim().replace(/^#/, ""), telefono.trim());
    setPedido(response.data.pedido);
    setLoading(false);
  };

  return (
    <div className="track-order-container">
      <Link to="/catalogo" className="back-link">
        &larr; Volver a la tienda
      </Link>
      <h2 className="track-order-title">Rastrear pedido</h2>
      <p className="track-order-subtitle">
        Ingresa el número de tu pedido y el teléfono con el que compraste.
      </p>

      <form className="track-order-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Número de pedido"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <button type="submit" className="checkout-submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar pedido"}
        </button>
      </form>

      {pedido === null && (
        <p className="track-order-empty">
          No encontramos un pedido con esos datos. Revisa el número y el teléfono.
        </p>
      )}

      {pedido && (
        <div className="track-order-result">
          <OrderCard pedido={pedido} />
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
