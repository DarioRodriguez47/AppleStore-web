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

      <div className="track-order-header">
        <div className="track-order-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 7.5L12 3L3 7.5M21 7.5L12 12M21 7.5V16.5L12 21M12 12L3 7.5M12 12V21M3 7.5V16.5L12 21"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="track-order-title">Rastrear pedido</h2>
        <p className="track-order-subtitle">
          Ingresa el número de tu pedido y el teléfono con el que compraste.
        </p>
      </div>

      <form className="track-order-form" onSubmit={handleSubmit}>
        <div className="track-order-field">
          <label htmlFor="numero-pedido">Número de pedido</label>
          <input
            id="numero-pedido"
            type="text"
            placeholder="Ej. 385425"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
        </div>
        <div className="track-order-field">
          <label htmlFor="telefono-pedido">Teléfono</label>
          <input
            id="telefono-pedido"
            type="tel"
            placeholder="Ej. 0991234567"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="checkout-submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar pedido"}
        </button>
      </form>

      {pedido === null && (
        <div className="track-order-empty">
          <span className="track-order-empty-icon" aria-hidden="true">?</span>
          <p>No encontramos un pedido con esos datos.</p>
          <p className="track-order-empty-hint">
            Revisa el número y el teléfono e intenta de nuevo.
          </p>
        </div>
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
