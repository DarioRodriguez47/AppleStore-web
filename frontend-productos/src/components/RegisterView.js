import React, { useState } from "react";
import { register } from "../services/AuthService";
import { useAuth } from "../context/AuthContext";

const RegisterView = ({ onSwitch, onClose }) => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, { name });
      // Entra directo comprando: se loguea automáticamente en vez de
      // pedirle que vuelva a escribir sus credenciales.
      await login(email, password);
      onClose?.();
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="modal-header">
        <div className="logo-icon"></div>
        <h2>Crear cuenta</h2>
        <p className="modal-subtitle">Regístrate para comprar en la tienda</p>
      </div>

      <div className="modal-body">
        {error && <div className="error-message">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="modal-footer">
          <button
            type="button"
            className="link-button"
            onClick={() => onSwitch("login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
