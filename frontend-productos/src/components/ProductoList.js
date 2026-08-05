import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProductos, deleteProducto, getImage } from '../services/productoService';
import ProductoForm from './ProductoForm';
import './ProductoList.css';

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const response = await getProductos();
    setProductos(response.data.productos || []);
  };

  const handleDelete = async (id) => {
    await deleteProducto(id);
    fetchProductos();
  };

  const goToProduct = (id) => {
    navigate(`/producto/${id}`);
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <Link to="/productos" className="back-link">
          &larr; Volver a la tienda
        </Link>
        <h2 className="product-title">Catálogo</h2>
        <button className="toggle-form-button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Añadir producto"}
        </button>
      </div>

      {showForm && (
        <div className="product-form-wrapper">
          <ProductoForm
            fetchProductos={() => {
              fetchProductos();
              setShowForm(false);
            }}
          />
        </div>
      )}

      <ul className="product-grid">
        {productos.map((producto) => (
          <li key={producto._id} className="product-card" onClick={() => goToProduct(producto._id)}>
            {producto.imagen && (
              <img src={getImage(producto.imagen)} alt={producto.nombre} className="product-image" />
            )}
            <div className="product-info">
              <span className="product-name">{producto.nombre}</span>
              <span className="product-description">{producto.descripcion}</span>
              <span className="product-price">${producto.precio}</span>
            </div>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(producto._id);
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {productos.length === 0 && (
        <p className="empty-state">No hay productos todavía. ¡Añade el primero!</p>
      )}
    </div>
  );
};

export default ProductoList;
