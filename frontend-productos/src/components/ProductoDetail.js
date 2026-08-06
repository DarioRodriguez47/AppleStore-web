// components/ProductoDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducto, getImage } from '../services/productoService';
import { useCart } from '../cart/context/CartContext';
import './ProductoDetail.css'; // Importar el archivo de estilos

const ProductoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [producto, setProducto] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    getProducto(id).then((response) => {
      if (!cancelled) {
        setProducto(response.data.producto);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBackClick = () => {
    navigate('/catalogo');
  };

  const handleAddToCart = () => {
    addItem(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (!loaded) return <div className="loading">Cargando...</div>;

  if (!producto) {
    return (
      <div className="detail-container">
        <p className="detail-description">Producto no encontrado.</p>
        <button className="detail-button" onClick={handleBackClick}>Volver al Catálogo</button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <h2 className="detail-title">{producto.nombre}</h2>
      <p className="detail-description">{producto.descripcion}</p>
      <p className="detail-info">Edición: {producto.edicion}</p>
      <p className="detail-info">Año: {producto.anio}</p>
      <p className="detail-info">Precio: ${producto.precio}</p>
      {producto.imagen && <img src={getImage(producto.imagen)} alt={producto.nombre} className="detail-image" />}
      <div className="detail-buttons">
        <button className="detail-button" onClick={handleBackClick}>Volver al Catálogo</button>
        <button className="detail-button detail-button-primary" onClick={handleAddToCart}>
          {added ? "Agregado ✓" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
};

export default ProductoDetail;
