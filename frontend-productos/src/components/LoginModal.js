// components/LoginModal.js

import React, { useState } from "react";
import "./AppleProducts.css";
import { login, register } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
const LoginModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLoginToggle = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await login(username, password);
        alert("Inicio de sesión exitoso");
        navigate(`/`);

        onClose();
      } else {
        await register(username, password);
        alert("Registro exitoso");
        setIsLogin(true);
        navigate(`/`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-overlay">
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
          <button type="submit">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
        <a
          href="#"
          className="link"
          onClick={(e) => {
            e.preventDefault();
            handleLoginToggle();
          }}
          style={{ marginBottom: "10px" }}
        >
          {isLogin
            ? "¿No tienes una cuenta? Regístrate"
            : "¿Ya tienes una cuenta? Inicia sesión"}
        </a>
        <button className="login-close-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
