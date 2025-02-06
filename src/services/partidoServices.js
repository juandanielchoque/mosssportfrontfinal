import axios from 'axios';

const API_URL = 'http://localhost:5000/api/partidos';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const obtenerPartidos = async () => {
  try {
    const response = await axios.get(`${API_URL}`, getAuthConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los partidos:', error);
    throw error;
  }
};

const obtenerEquipos = async () => {
  try {
    const response = await axios.get(`${API_URL}/equipos`, getAuthConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los equipos:', error);
    throw error;
  }
};

const obtenerTorneos = async () => {
  try {
    const response = await axios.get(`${API_URL}/torneos`, getAuthConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los torneos:', error);
    throw error;
  }
};

const obtenerDisciplinas = async () => {
  try {
    const response = await axios.get(`${API_URL}/disciplinas`, getAuthConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las disciplinas:', error);
    throw error;
  }
};

const obtenerCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias`, getAuthConfig());
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    throw error;
  }
};

const obtenerTorneoDisciplinas = async (torneoId) => {
  try {
    const response = await axios.get(`${API_URL}/torneo_disciplinas`, {
      ...getAuthConfig(),
      params: { torneo_id: torneoId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las disciplinas del torneo:', error);
    throw error;
  }
};

const obtenerDisciplinaCategorias = async (disciplinaId) => {
  try {
    const response = await axios.get(`${API_URL}/disciplina_categorias`, {
      ...getAuthConfig(),
      params: { disciplina_id: disciplinaId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las categorías de la disciplina:', error);
    throw error;
  }
};

const crearPartido = async (partido) => {
  try {
    console.log("📤 Intentando enviar partido al backend:", JSON.stringify(partido, null, 2));

    // ✅ Evita que el mismo partido se envíe dos veces
    const claveUnica = `${partido.equipo1_id}-${partido.equipo2_id}-${partido.disciplina_id}-${partido.jornada}`;
    if (window.partidosEnviados && window.partidosEnviados.has(claveUnica)) {
      console.warn("⚠️ Este partido ya fue enviado recientemente. Ignorando duplicado.");
      return;
    }

    // 🛠 Guardamos la clave en un Set global para evitar envíos duplicados
    if (!window.partidosEnviados) window.partidosEnviados = new Set();
    window.partidosEnviados.add(claveUnica);

    const response = await axios.post("http://localhost:5000/api/partidos", partido, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Partido creado con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el partido:", error.response?.data || error.message);
    throw error;
  }
};


const actualizarPartido = async (id, partidoActualizado) => {
  try {
    if (partidoActualizado.fecha_hora) {
      const fecha = new Date(partidoActualizado.fecha_hora);
      partidoActualizado.fecha_hora = fecha.toISOString().slice(0, 19).replace('T', ' ');
    }
    
    const response = await axios.put(`${API_URL}/${id}`, partidoActualizado);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el partido:', error);
    throw error;
  }
};

const actualizarPuntuacion = async (partidoId, data) => {
  try {
    console.log("Enviando a actualizarPuntuacion:", partidoId, data);

    if (!data.equipo_id || !data.disciplina_id || !data.categoria_id || !data.torneo_id) {
      console.error("❌ Error: Datos faltantes en actualizarPuntuacion", data);
      return;
    }

    const response = await axios.put(`http://localhost:5000/api/partidos/${partidoId}/puntuacion`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la puntuación:", error);
    throw error;
  }
};

const eliminarPartido = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el partido:', error);
    throw error;
  }
};

const subirEvidencia = async (evidenciaData) => {
  try {
    console.log("📤 Intentando subir evidencia:", JSON.stringify(evidenciaData, null, 2));

    // ✅ Evitar que la misma evidencia se envíe dos veces
    const claveUnica = `evidencia-${evidenciaData.partido_id}`;
    if (window.evidenciasEnviadas && window.evidenciasEnviadas.has(claveUnica)) {
      console.warn("⚠️ Esta evidencia ya fue enviada recientemente. Ignorando duplicado.");
      return;
    }

    // 🛠 Guardamos la clave en un Set global para evitar envíos duplicados
    if (!window.evidenciasEnviadas) window.evidenciasEnviadas = new Set();
    window.evidenciasEnviadas.add(claveUnica);

    const response = await axios.post('http://localhost:5000/api/evidencias', evidenciaData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Evidencia subida con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al subir evidencia:", error.response?.data || error.message);
    throw error;
  }
};

const finalizarPartido = async (id, resultados) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/finalizar`,
      {
        goles_1: resultados.equipo1_goles,
        goles_2: resultados.equipo2_goles,
        estado: 'finalizado'
      },
      getAuthConfig()
    );
    
    return response.data;
  } catch (error) {
    console.error('Error en finalizarPartido:', error);
    throw error;
  }
};

const crearCompetenciaIndividual = async (competenciaData) => {
  try {
    const response = await axios.post(
      `${API_URL}/competencias_individuales`, 
      competenciaData, 
      getAuthConfig() 
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear la competencia individual:', error);
    throw error; 
  }
};

const verificarEvidenciaExistente = async (partidoId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/evidencias/verificar/${partidoId}`);
    return response.data.existe; 
  } catch (error) {
    console.error('Error al verificar evidencia existente:', error);
    throw error;
  }
};

export default {
  obtenerPartidos,
  obtenerEquipos,
  obtenerTorneos,
  obtenerDisciplinas,
  obtenerCategorias,
  obtenerTorneoDisciplinas,
  obtenerDisciplinaCategorias,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  subirEvidencia,
  finalizarPartido,
  crearCompetenciaIndividual,
  verificarEvidenciaExistente,
  actualizarPuntuacion
};