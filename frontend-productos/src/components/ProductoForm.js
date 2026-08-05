// components/ProductoForm.js

import React, { useState } from 'react';
import { saveProducto, updateProducto } from '../services/productoService';
import './ProductoForm.css';

const ProductoForm = ({ producto, isEdit, fetchProductos }) => {
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

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <input 
        type="text" 
        name="nombre" 
        value={formData.nombre} 
        onChange={handleChange} 
        placeholder="Nombre" 
        className="form-input" 
      />
      <input 
        type="text" 
        name="descripcion" 
        value={formData.descripcion} 
        onChange={handleChange} 
        placeholder="Descripción" 
        className="form-input" 
      />
      <input 
        type="text" 
        name="edicion" 
        value={formData.edicion} 
        onChange={handleChange} 
        placeholder="Edición" 
        className="form-input" 
      />
      <input 
        type="number" 
        name="anio" 
        value={formData.anio} 
        onChange={handleChange} 
        placeholder="Año" 
        className="form-input" 
      />
      <input 
        type="number" 
        name="precio" 
        value={formData.precio} 
        onChange={handleChange} 
        placeholder="Precio" 
        className="form-input" 
      />
      <input 
        type="file" 
        name="imagen" 
        onChange={handleImageChange} 
        className="form-input" 
      />
      <button 
        type="submit" 
        className="submit-button"
      >
        Guardar
      </button>
    </form>
  );
};

export default ProductoForm;
