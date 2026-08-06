import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductoList from "./components/ProductoList";
import ProductoDetail from "./components/ProductoDetail";
import AppleProducts from "./components/ProductosApple";
import CarritoPage from "./cart/pages/CarritoPage";
import MisPedidosPage from "./cart/pages/MisPedidosPage";
import TrackOrderPage from "./cart/pages/TrackOrderPage";
import AdminPage from "./admin/pages/AdminPage";
import "./index.css"

const App = () => {
  return (
    <Routes>
      <Route path="/productos" element={<AppleProducts/>} />
      <Route path="/" element={<Navigate to="/productos" />} />
      <Route path="/catalogo" element={<ProductoList />} />
      <Route path="/producto/:id" element={<ProductoDetail />} />
      <Route path="/carrito" element={<CarritoPage />} />
      <Route path="/mis-pedidos" element={<MisPedidosPage />} />
      <Route path="/rastrear-pedido" element={<TrackOrderPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default App;
