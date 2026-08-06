// components/ProductoForm.js

import React, { useState } from 'react';
import { saveProducto, updateProducto, getImage } from '../services/productoService';
import './ProductoForm.css';

const ProductoForm = ({ producto, isEdit, fetchProductos, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    edicion: producto?.edicion || '',
    anio: producto?.anio || '',
    precio: producto?.precio || '',
    imagen: producto?.imagen || null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // No hay backend: la imagen se guarda como data URL para que el CRUD
  // se vea completo sin necesitar un servidor de archivos.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, imagen: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateProducto(producto._id, formData);
    } else {
      await saveProducto(formData);
    }
    fetchProductos();
  };

  const previewSrc = formData.imagen?.startsWith("data:")
    ? formData.imagen
    : formData.imagen
      ? getImage(formData.imagen)
      : null;

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-field">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="iPhone 15 Pro"
          className="form-input"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="descripcion">Descripción</label>
        <input
          id="descripcion"
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Chasis de titanio, chip A17 Pro..."
          className="form-input"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="edicion">Edición</label>
          <input
            id="edicion"
            type="text"
            name="edicion"
            value={formData.edicion}
            onChange={handleChange}
            placeholder="Pro"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="anio">Año</label>
          <input
            id="anio"
            type="number"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            placeholder="2024"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="precio">Precio (USD)</label>
          <input
            id="precio"
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="999"
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="imagen">Imagen</label>
        <div className="image-field">
          {previewSrc && <img src={previewSrc} alt="Vista previa" className="image-preview" />}
          <input
            id="imagen"
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        {onCancel && (
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductoForm;
