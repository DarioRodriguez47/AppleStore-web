// components/LoginModal.js

import React, { useState, useEffect } from "react";
import "./AppleProducts.css";
import { login, register } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
const LoginModal = ({ onClose, onOpenForgot }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLoginToggle = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleAutofillAdmin = () => {
    // Solo habilitar autofill en desarrollo
    if (process.env.NODE_ENV === 'production') return;
    setUsername('admin@example.com');
    setPassword('admin123');
  };

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
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
        setLoading(false);
        navigate(`/`);
        onClose();
      } else {
        await register(username, password);
        setIsLogin(true);
        navigate(`/`);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Error en autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-container">
        <h2>{isLogin ? "Iniciar Sesión" : "Registro"}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Correo electrónico"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? (isLogin ? "Ingresando..." : "Registrando...") : isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
        <div style={{ marginBottom: "10px" }}>
          <a href="#" className="link" onClick={(e) => { e.preventDefault(); handleLoginToggle(); }}>
            {isLogin ? "¿No tienes una cuenta? Regístrate" : "¿Ya tienes una cuenta? Inicia sesión"}
          </a>
          {isLogin && (
            <>
              <br />
              <a href="#" className="link" onClick={(e) => { e.preventDefault(); onOpenForgot && onOpenForgot(); }}>
                ¿Olvidaste tu contraseña?
              </a>
              {process.env.NODE_ENV !== 'production' && (
                <div style={{ marginTop: 8 }}>
                  <button className="link" onClick={(e) => { e.preventDefault(); handleAutofillAdmin(); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    🔐 Autofill admin
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <button className="login-close-button" onClick={onClose} aria-label="Cerrar diálogo">
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
