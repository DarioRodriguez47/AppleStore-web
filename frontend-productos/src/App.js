import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductoList from "./components/ProductoList";
import ProductoDetail from "./components/ProductoDetail";
import ProductoEdit from "./components/ProductoEdit";
import AppleProducts from "./components/ProductosApple";
import "./index.css"

const App = () => {
  return (
    <Routes>
      <Route path="/productos" element={<AppleProducts/>} />
      <Route path="/" element={<Navigate to="/productos" />} />
      <Route path="/catalogo" element={<ProductoList />} />
      <Route path="/producto/:id" element={<ProductoDetail />} />
      <Route path="/producto/editar/:id" element={<ProductoEdit />} />
    </Routes>
  );
};

export default App;
