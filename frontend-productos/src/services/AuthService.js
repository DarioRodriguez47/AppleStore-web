// services/AuthService.js

import axios from 'axios';

const API_URL = 'http://localhost:3600'; // Cambia la URL según tu configuración

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const register = async (email, password, extra = {}) => {
  try {
    const payload = { email, password, ...extra };
    const response = await axios.post(`${API_URL}/register`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrarse');
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al solicitar recuperación de contraseña');
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al restablecer la contraseña');
  }
};
