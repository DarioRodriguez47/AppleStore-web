import React, { useState, useEffect } from "react";
import "./AppleProducts.css";
import { requestPasswordReset } from "../services/AuthService";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !/^[\w\-.]+@[\w\-]+\.[A-Za-z]{2,}$/.test(email)) {
      setError("Introduce un correo válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setMessage(res?.message || "Se ha enviado un correo con instrucciones si el email existe.");
    } catch (err) {
      setError(err.message || "Error al solicitar recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-container" role="dialog" aria-modal="true">
        <h2>Recuperar contraseña</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>
        <button className="login-close-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
