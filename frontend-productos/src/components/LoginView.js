import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginView = ({ onClose, onSwitch, notice }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      onClose();
      navigate("/");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view-container">
      {/* Botón X posicionado arriba y con espacio */}
      <button
        className="login-close-button"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>

      <div className="modal-header">
        <h2>Iniciar Sesión</h2>
        <p className="modal-subtitle">Accede a tu cuenta de Apple Products</p>
      </div>

      <div className="modal-body">
        {notice && <div className="success-message">{notice}</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="demo-hint">
          Demo administrador: <strong>admin@apple.com</strong> / <strong>admin123</strong>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="modal-footer">
          <button className="link-button" onClick={() => onSwitch("register")}>
            ¿No tienes una cuenta? <strong>Regístrate</strong>
          </button>
          <button
            className="link-button forgot-password"
            onClick={() => onSwitch("forgot")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
