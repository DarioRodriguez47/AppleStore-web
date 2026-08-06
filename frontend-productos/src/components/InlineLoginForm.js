import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./InlineLoginForm.css";

// Formulario de login de página completa (no modal), reutilizado por
// cualquier vista que necesite una sesión para mostrar su contenido
// (por ejemplo /admin o /mis-pedidos), cada una con su propio título.
const InlineLoginForm = ({ title = "Inicia sesión", subtitle }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-login">
      <form className="inline-login-form" onSubmit={handleSubmit}>
        <h2>{title}</h2>
        {subtitle && <p className="demo-hint">{subtitle}</p>}
        {error && <div className="checkout-error">{error}</div>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="checkout-submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <p className="demo-hint">Demo administrador: admin@apple.com / admin123</p>
      </form>
    </div>
  );
};

export default InlineLoginForm;
