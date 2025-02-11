import axios from "axios";

const API_URL = "https://mosssportfinal-production.up.railway.app/api/equipos";
const API_URL_ESTADISTICA = "https://mosssportfinal-production.up.railway.app/api";

export const obtenerEquipos = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Respuesta completa de la API:", response.data);
    return response.data.data ?? [];
  } catch (error) {
    console.error("Error en el servicio:", error);
    throw error;
  }
};


export const obtenerPuntuacion = async () => {
  try {
    const response = await axios.get(`${API_URL_ESTADISTICA}/estadisticas`);
    console.log("Respuesta completa de la API:", response.data);

    // Asegurar que siempre se devuelve un array
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error("Formato inesperado en la respuesta de la API", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error en el servicio obtenerPuntuacion:", error);
    return [];
  }
};

export const obtenerEstadisticasEquipo = async (
  equipoId,
  disciplinaId,
  categoriaId,
  torneoId
) => {
  try {
    const response = await axios.get(
      `${API_URL_ESTADISTICA}/estadisticas/equipo/${equipoId}`,
      {
        params: {
          disciplina: disciplinaId,
          categoria: categoriaId,
          torneo: torneoId
        }
      }
    );
    
    if (response.status !== 200) {
      throw new Error('Error al obtener estadísticas');
    }
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

