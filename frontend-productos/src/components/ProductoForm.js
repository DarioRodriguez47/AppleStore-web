// components/ProductoForm.js

import React, { useState } from 'react';
import { saveProducto, updateProducto, getImage } from '../services/productoService';
import './ProductoForm.css';

// Sin backend, la imagen se guarda como data URL en localStorage — un
// archivo grande (foto de celular sin comprimir) puede agotar la cuota de
// localStorage y tumbar la app. Se limita el tamaño aceptado.
const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024; // 1.5MB

const ProductoForm = ({ producto, isEdit, fetchProductos, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    edicion: producto?.edicion || '',
    anio: producto?.anio ?? '',
    precio: producto?.precio ?? '',
    imagen: producto?.imagen || null
  });
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('La imagen es muy pesada (máximo 1.5MB). Elige una más liviana.');
      e.target.value = '';
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, imagen: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    const payload = {
      ...formData,
      anio: formData.anio === '' ? '' : Number(formData.anio),
      precio: formData.precio === '' ? '' : Number(formData.precio),
    };
    try {
      if (isEdit) {
        await updateProducto(producto._id, payload);
      } else {
        await saveProducto(payload);
      }
      fetchProductos();
    } catch (err) {
      setSubmitError(err.message || 'No se pudo guardar el producto.');
    } finally {
      setSubmitting(false);
    }
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
        {imageError && <p className="image-error">{imageError}</p>}
      </div>

      {submitError && <p className="image-error">{submitError}</p>}

      <div className="form-actions">
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
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
