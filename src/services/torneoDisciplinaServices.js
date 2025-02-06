import axios from 'axios';

const API_URL = 'http://localhost:5000/api/torneo-disciplinas';

export const asignarDisciplinaATorneo = async (torneoId, disciplinaId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, { torneo_id: torneoId, disciplina_id: disciplinaId }, config);
    return response.data;
  } catch (error) {
    console.error('Error al asignar disciplina al torneo:', error);
    throw error;
  }
};

export const obtenerDisciplinasPorTorneo = async (torneoId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/${torneoId}`, config);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener disciplinas del torneo:', error);
    throw error;
  }
};