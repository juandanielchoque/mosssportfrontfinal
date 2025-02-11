import axios from 'axios';

const API_URL = 'https://mosssportfinal-production.up.railway.app';

export const obtenerTorneos = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(API_URL, config);
    return Array.isArray(response.data) ? response.data : 
           Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error al obtener torneos:', error);
    throw error;
  }
};

export const crearTorneo = async (torneoData) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, torneoData, config);
    return response.data;
  } catch (error) {
    console.error('Error al crear el torneo:', error);
    throw error;
  }
};

export const actualizarTorneo = async (id, torneoData) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_URL}/${id}`, torneoData, config);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el torneo:', error);
    throw error;
  }
};

export const eliminarTorneo = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el torneo:', error);
    throw error;
  }
};

export const obtenerTorneosConDisciplinasYCategorias = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/con-disciplinas-categorias`, config);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener torneos con disciplinas y categorías:', error);
    throw error;
  }
};