import axios from 'axios';

const API_URL = 'http://localhost:5000/api/puntajes'; 

export const puntajesService = {
  obtenerPuntajes: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      throw new Error('Error al obtener puntajes: ' + error.message);
    }
  },

  inicializarPuntajes: async () => {
    try {
      const response = await axios.post(`${API_URL}/inicializar`);
      return response.data;
    } catch (error) {
      console.error('Error al inicializar puntajes:', error);
      throw error;
    }
  },

  guardarPuntajes: async (puntajes) => {
    try {
      const response = await axios.post(`${API_URL}/multiple`, puntajes);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al guardar puntajes: ' + error.message
      );
    }
  },
};

export default puntajesService;
