import axios from 'axios';

const API_URL = 'http://localhost:5000/api/disciplina-categorias';

export const asignarCategoriaADisciplina = async (disciplinaId, categoriaId) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, { disciplina_id: disciplinaId, categoria_id: categoriaId }, config);
    return response.data;
  } catch (error) {
    console.error('Error al asignar categoría a la disciplina:', error);
    throw error;
  }
};

export const obtenerCategoriasPorDisciplina = async (disciplinaId) => {
  try {
    const response = await axios.get(`${API_URL}/${disciplinaId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener categorías de la disciplina:', error);
    throw error;
  }
};