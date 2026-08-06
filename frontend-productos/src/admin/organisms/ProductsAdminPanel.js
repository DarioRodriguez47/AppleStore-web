import React, { useEffect, useState } from "react";
import { getProductos, deleteProducto, getImage } from "../../services/productoService";
import ProductFormModal from "./ProductFormModal";
import "./ProductsAdminPanel.css";

const ProductsAdminPanel = () => {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchProductos = async () => {
    const response = await getProductos();
    setProductos(response.data.productos || []);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    await deleteProducto(id);
    fetchProductos();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const startEdit = (producto) => {
    setEditing(producto);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="products-admin">
      <div className="products-admin-header">
        <div>
          <h3>Productos</h3>
          <span className="products-admin-count">{productos.length} en el catálogo</span>
        </div>
        <button className="toggle-form-button" onClick={startCreate}>
          + Añadir producto
        </button>
      </div>

      {showForm && (
        <ProductFormModal
          producto={editing}
          isEdit={!!editing}
          onClose={closeForm}
          fetchProductos={() => {
            fetchProductos();
            closeForm();
          }}
        />
      )}

      {productos.length === 0 ? (
        <p className="products-admin-empty">No hay productos todavía.</p>
      ) : (
        <ul className="products-admin-grid">
          {productos.map((producto) => (
            <li key={producto._id} className="products-admin-card">
              <div className="products-admin-thumb-wrapper">
                {producto.imagen && (
                  <img
                    src={getImage(producto.imagen)}
                    alt={producto.nombre}
                    className="products-admin-thumb"
                  />
                )}
              </div>
              <div className="products-admin-card-body">
                <span className="products-admin-name">{producto.nombre}</span>
                <span className="products-admin-meta">
                  {producto.edicion} · {producto.anio}
                </span>
                <span className="products-admin-price">${producto.precio}</span>
              </div>
              <div className="products-admin-actions">
                <button className="admin-edit-button" onClick={() => startEdit(producto)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDelete(producto._id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsAdminPanel;
