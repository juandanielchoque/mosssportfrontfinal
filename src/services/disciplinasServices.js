import axios from 'axios';

const API_URL = 'https://mosssportfinal-production.up.railway.app/api/disciplinas';

export const obtenerDisciplinas = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(API_URL, config);
    return Array.isArray(response.data) ? response.data : 
           Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error al obtener disciplinas:', error);
    throw error;
  }
};

export const crearDisciplina = async (disciplinaData) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, disciplinaData, config);
    return response.data;
  } catch (error) {
    console.error('Error al crear la disciplina:', error);
    throw error;
  }
};

export const eliminarDisciplina = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la disciplina:', error);
    throw error;
  }
};