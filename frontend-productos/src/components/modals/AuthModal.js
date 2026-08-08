import React, { useState } from "react";
import "../AppleProducts.css";
import "./Modal.css";
import { useModalDismiss } from "../../hooks/useModalDismiss";
import LoginView from "../LoginView";
import RegisterView from "../RegisterView";
import ForgotPasswordView from "./ForgotPasswordView";

const AuthModal = ({ initialView = "login", onClose }) => {
  const [view, setView] = useState(initialView); // 'login' | 'register' | 'forgot'
  const handleOverlayClick = useModalDismiss(onClose);

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
          <LoginView onClose={onClose} onSwitch={(v) => setView(v)} />
        )}
        {view === "register" && (
          <RegisterView onSwitch={(v) => setView(v)} onClose={onClose} />
        )}
        {view === "forgot" && (
          <ForgotPasswordView onSwitch={(v) => setView(v)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
