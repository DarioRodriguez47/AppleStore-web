import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InlineLoginForm from "../../components/InlineLoginForm";
import OrdersTable from "../organisms/OrdersTable";
import ProductsAdminPanel from "../organisms/ProductsAdminPanel";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { useConfirm } from "../../hooks/useConfirm";
import "./AdminPage.css";

const AdminPage = () => {
  const { user, isAdmin, logout } = useAuth();
  const [tab, setTab] = useState("pedidos");
  const navigate = useNavigate();
  const { pending, requestConfirm, handleConfirm, handleCancel } = useConfirm();

  const handleLogout = () => {
    requestConfirm(
      {
        title: "Cerrar sesión",
        message: "¿Seguro que quieres cerrar sesión de administrador?",
        confirmLabel: "Cerrar sesión",
      },
      () => {
        logout();
        navigate("/productos");
      }
    );
  };

  if (!user) {
    return <InlineLoginForm title="Acceso administrador" />;
  }

  if (!isAdmin) {
    return (
      <div className="inline-login">
        <div className="inline-login-form">
          <h2>Sin acceso</h2>
          <p className="form-hint">
            Tu cuenta ({user.email}) no tiene permisos de administrador.
          </p>
          <Link to="/catalogo" className="checkout-submit">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Panel administrativo</h1>
          <span className="admin-user">{user.email}</span>
        </div>
        <div className="admin-header-actions">
          <Link to="/catalogo" className="link-button">
            Ver tienda
          </Link>
          <button className="nav-login-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={tab === "pedidos" ? "active" : ""}
          onClick={() => setTab("pedidos")}
        >
          Pedidos
        </button>
        <button
          className={tab === "productos" ? "active" : ""}
          onClick={() => setTab("productos")}
        >
          Productos
        </button>
      </div>

      <div className="admin-content">
        {tab === "pedidos" ? <OrdersTable /> : <ProductsAdminPanel />}
      </div>

      {pending && (
        <ConfirmModal
          title={pending.title}
          message={pending.message}
          confirmLabel={pending.confirmLabel}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminPage;
