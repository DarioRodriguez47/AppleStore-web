import React, { useState } from "react";
import "./CheckoutForm.css";

const CheckoutForm = ({ onSubmit, submitting }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("retiro");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipoEntrega === "delivery" && !direccion.trim()) {
      setError("Ingresa una dirección de entrega.");
      return;
    }
    setError("");
    onSubmit({
      cliente: { nombre, telefono },
      entrega:
        tipoEntrega === "delivery"
          ? { tipo: "delivery", direccion }
          : { tipo: "retiro" },
    });
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h3>Datos de contacto</h3>
      {error && <div className="checkout-error">{error}</div>}

      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
      />

      <h3>Entrega</h3>
      <div className="delivery-options">
        <label className={tipoEntrega === "retiro" ? "selected" : ""}>
          <input
            type="radio"
            name="entrega"
            value="retiro"
            checked={tipoEntrega === "retiro"}
            onChange={() => setTipoEntrega("retiro")}
          />
          Retiro en tienda
        </label>
        <label className={tipoEntrega === "delivery" ? "selected" : ""}>
          <input
            type="radio"
            name="entrega"
            value="delivery"
            checked={tipoEntrega === "delivery"}
            onChange={() => setTipoEntrega("delivery")}
          />
          Delivery a domicilio
        </label>
      </div>

      {tipoEntrega === "delivery" && (
        <input
          type="text"
          placeholder="Dirección de entrega"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      )}

      <button type="submit" className="checkout-submit" disabled={submitting}>
        {submitting ? "Procesando..." : "Confirmar pedido"}
      </button>
    </form>
  );
};

export default CheckoutForm;
