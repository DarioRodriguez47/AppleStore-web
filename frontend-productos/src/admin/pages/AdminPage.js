import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLoginForm from "../organisms/AdminLoginForm";
import OrdersTable from "../organisms/OrdersTable";
import ProductsAdminPanel from "../organisms/ProductsAdminPanel";
import "./AdminPage.css";

const AdminPage = () => {
  const { isAdmin, user, logout } = useAuth();
  const [tab, setTab] = useState("pedidos");

  if (!isAdmin) {
    return <AdminLoginForm />;
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
          <button className="nav-login-button" onClick={logout}>
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
    </div>
  );
};

export default AdminPage;
