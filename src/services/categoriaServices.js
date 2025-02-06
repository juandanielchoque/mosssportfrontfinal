import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categorias';

export const obtenerCategorias = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(API_URL, config);
    return Array.isArray(response.data) ? response.data : 
           Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

export const crearCategoria = async (categoriaData) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, categoriaData, config);
    return response.data;
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    throw error;
  }
};

export const eliminarCategoria = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    throw error;
  }
};