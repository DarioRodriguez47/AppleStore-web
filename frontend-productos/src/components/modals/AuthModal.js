import React, { useEffect, useState } from "react";
import "../AppleProducts.css";
import "./Modal.css";
import LoginView from "../LoginView";
import RegisterView from "../RegisterView";
import ForgotPasswordView from "./ForgotPasswordView";

const AuthModal = ({ initialView = "login", onClose }) => {
  const [view, setView] = useState(initialView); // 'login' | 'register' | 'forgot'
  const [notice, setNotice] = useState("");

  // Deshabilitar scroll del body al abrir el modal
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleRegisterSuccess = (message) => {
    setNotice(message || "Registro exitoso. Inicia sesión.");
    setView("login");
  };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div
        className="login-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button
          className="login-close-button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        {view === "login" && (
          <LoginView
            onClose={onClose}
            onSwitch={(v) => {
              setView(v);
              setNotice("");
            }}
            notice={notice}
          />
        )}
        {view === "register" && (
          <RegisterView
            onSwitch={(v) => setView(v)}
            onRegistered={handleRegisterSuccess}
          />
        )}
        {view === "forgot" && (
          <ForgotPasswordView onSwitch={(v) => setView(v)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
