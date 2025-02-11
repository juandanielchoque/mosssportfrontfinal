import axios from 'axios';

const API_URL = 'https://mosssportfinal-production.up.railway.app/api/equipos';


export const obtenerEquipos = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error en el servicio:', error);
    throw error;
  }
};

export const crearEquipo = async (equipo) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, equipo, config);
    return response.data;
  } catch (error) {
    console.error('Error al crear el equipo:', error);
    throw error;
  }
};

export const actualizarEquipo = async (equipoId, equipo) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_URL}/${equipoId}`, equipo, config);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el equipo:', error);
    throw error;
  }
};

export const eliminarEquipo = async (equipoId) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.delete(`${API_URL}/${equipoId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el equipo:', error);
    throw error;
  }
};

export const obtenerEquiposPorCategoria = async (categoriaId) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}?categoria_id=${categoriaId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener equipos por categoría:', error);
    throw error;
  }
};

export const obtenerEquipoPorCapitán = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/miequipo`, config); 
    return response.data;
  } catch (error) {
    console.error('Error al obtener el equipo del capitán:', error);
    throw error;
  }
};

