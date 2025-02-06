// jugadorServices.js
import axios from 'axios';

// Modifica la URL base para que no incluya la ruta de la API
const API_URL = 'http://localhost:5000';
const API_JUGADORES = `${API_URL}/api/jugadores`;

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Obtener todos los jugadores o filtrar por equipo_id
export const obtenerJugadores = async (equipoId) => {
  try {
    const response = await axios.get(`${API_JUGADORES}?equipo_id=${equipoId}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    throw error;
  }
};

// Agregar un jugador al equipo
export const agregarJugador = async (jugador) => {
  try {
    // Asegurar que tenga los campos necesarios
    const jugadorData = {
      ...jugador,
      fecha_ingreso: jugador.fecha_ingreso || new Date().toISOString().split('T')[0],
      estado: jugador.estado || 'activo'
    };
    
    const response = await axios.post(API_JUGADORES, jugadorData, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error al agregar jugador:', error);
    throw error;
  }
};

// Obtener un jugador por su ID
export const getJugadorById = async (id) => {
  try {
    const response = await axios.get(`${API_JUGADORES}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error al obtener el jugador por ID:', error);
    throw error;
  }
};

// Actualizar un jugador por su ID
export const actualizarJugador = async (id, jugadorData) => {
  try {
    const response = await axios.put(`${API_JUGADORES}/${id}`, jugadorData, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el jugador:', error);
    throw error;
  }
};

// Eliminar un jugador por su ID
export const eliminarJugador = async (id) => {
  try {
    const response = await axios.delete(`${API_JUGADORES}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el jugador:', error);
    throw error;
  }
};

// Obtener jugadores con información de su equipo
export const getJugadoresConEquipo = async () => {
  try {
    const response = await axios.get(`${API_JUGADORES}/detalles`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error al obtener jugadores con equipo:', error);
    throw error;
  }
};

export const obtenerEquipoPorCapitán = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    console.log('Token enviado:', token); // Para debugging

    const response = await axios.get(`${API_URL}/api/jugadores/miequipo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Respuesta del servidor:', response.data); // Para debugging
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;

  } catch (error) {
    console.error('Error completo:', error);
    if (error.response?.status === 401) {
      // Si el token es inválido, podríamos redirigir al login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(error.response?.data?.message || 'Error al obtener el equipo');
  }
};