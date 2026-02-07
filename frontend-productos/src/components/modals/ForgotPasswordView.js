import React, { useState, useRef } from "react";
import { requestPasswordReset } from "../../services/AuthService";
import "./Modal.css";

const emailRegex = /^[\w-.]+@[\w-]+\.[A-Za-z]{2,}$/;

const ForgotPasswordView = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const liveRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !emailRegex.test(email)) {
      setError("Introduce un correo válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      const successMsg =
        res?.message ||
        "Si el correo está registrado, recibirás instrucciones.";
      setMessage(successMsg);
      setEmail("");
      if (liveRef.current) liveRef.current.focus();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al solicitar recuperación",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="modal-header">
        <div>
          <h2 id="forgot-title">Recuperar contraseña</h2>
          <p className="modal-subtitle">
            Te enviaremos instrucciones al correo
          </p>
        </div>
      </div>

      <div className="modal-body">
        <div
          tabIndex={-1}
          ref={liveRef}
          aria-live="polite"
          style={{ outline: "none" }}
        >
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>

        {!message && (
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <span className="input-icon">@</span>
              <label htmlFor="fp-email" style={{ display: "none" }}>
                Correo
              </label>
              <input
                id="fp-email"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
              />
            </div>
            <button
              className="primary-button"
              type="submit"
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>
        )}

        <div className="modal-footer" style={{ marginTop: 12 }}>
          <button
            type="button"
            className="link-button"
            onClick={() => onSwitch("login")}
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
