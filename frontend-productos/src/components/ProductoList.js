import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, getImage } from '../services/productoService';
import { useCart } from '../cart/context/CartContext';
import ProductQuickViewModal from './ProductQuickViewModal';
import './ProductoList.css';

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem, totalItems } = useCart();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const response = await getProductos();
    setProductos(response.data.productos || []);
  };

  const handleAddToCart = (e, producto) => {
    e.stopPropagation();
    addItem(producto);
    setAddedId(producto._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <Link to="/productos" className="back-link">
          &larr; Volver a la tienda
        </Link>
        <h2 className="product-title">Catálogo</h2>
        <Link to="/carrito" className="toggle-form-button cart-link-with-badge">
          Ver carrito
          {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
        </Link>
      </div>

      <ul className="product-grid">
        {productos.map((producto) => (
          <li key={producto._id} className="product-card" onClick={() => setSelectedProduct(producto)}>
            {producto.imagen && (
              <img src={getImage(producto.imagen)} alt={producto.nombre} className="product-image" />
            )}
            <div className="product-info">
              <span className="product-name">{producto.nombre}</span>
              <span className="product-description">{producto.descripcion}</span>
              <span className="product-price">${producto.precio}</span>
            </div>
            <button
              className="add-to-cart-button"
              onClick={(e) => handleAddToCart(e, producto)}
            >
              {addedId === producto._id ? "Agregado ✓" : "Agregar al carrito"}
            </button>
          </li>
        ))}
      </ul>

      {productos.length === 0 && (
        <p className="empty-state">No hay productos disponibles por ahora.</p>
      )}

      {selectedProduct && (
        <ProductQuickViewModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addItem}
        />
      )}
    </div>
  );
};

export default ProductoList;
