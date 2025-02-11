import axios from 'axios';

const BASE_URL = 'https://mosssportfinal-production.up.railway.app/api/competicion';

export const obtenerCompetenciasIndividuales = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        console.log('Respuesta completa competencias:', response.data);
        return {
            success: true,
            data: response.data.data || response.data
        };
    } catch (error) {
        console.error("Error al obtener competencias individuales:", error);
        return {
            success: false,
            data: [],
            error: error.message
        };
    }
};

export const obtenerEquiposDeCompetencia = async (competenciaId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${competenciaId}/equipos`);
        return {
            success: true,
            data: response.data.data || response.data
        };
    } catch (error) {
        console.error("Error al obtener equipos de competencia:", error);
        return {
            success: false,
            data: [],
            error: error.message
        };
    }
};

export const obtenerCategoriasPorDisciplina = async (disciplinaId) => {
    try {
        const response = await axios.get(`https://mosssportfinal-production.up.railway.app/api/disciplina-categorias/${disciplinaId}`);
        return {
            success: true,
            data: response.data.data || response.data
        };
    } catch (error) {
        console.error('Error al obtener categorías de la disciplina:', error);
        return {
            success: false,
            data: [],
            error: error.message
        };
    }
};

export const finalizarCompetenciaIndividual = async (competenciaId, resultados) => {
    try {
        const response = await axios.put(`${BASE_URL}/${competenciaId}/finalizar`, { resultados });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error al finalizar competencia individual:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const eliminarCompetenciaIndividual = async (competenciaId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${competenciaId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error al eliminar competencia individual:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const obtenerEquipos = async () => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('https://mosssportfinal-production.up.railway.app/api/equipos', config);
        const data = Array.isArray(response.data) ? response.data : 
                    Array.isArray(response.data.data) ? response.data.data : [];
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error en el servicio:', error);
        return {
            success: false,
            data: [],
            error: error.message
        };
    }
};

export const obtenerEquiposPorCategoria = async (categoriaId) => {
    try {
        const response = await axios.get(`https://mosssportfinal-production.up.railway.app/api/equipos/categoria_id=${categoriaId}`);
        return {
            success: true,
            data: response.data.data || response.data
        };
    } catch (error) {
        console.error('Error al obtener equipos por categoría:', error);
        return {
            success: false,
            data: [],
            error: error.message
        };
    }
};

export const actualizarResultadoEquipo = async (competenciaId, equipoId, resultado) => {
    try {
        const response = await axios.put(`${BASE_URL}/actualizar-resultado`, { 
            competencia_id: competenciaId, 
            equipo_id: equipoId, 
            resultado 
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error actualizando resultado:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const obtenerResultadosEquipos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/resultados`);
        console.log('Respuesta completa resultados:', response.data);
        return {
            success: true,
            data: response.data.data || response.data
        };
    } catch (error) {
        console.error('Error al obtener resultados de equipos:', error);
        return {
            success: false,
            data: [],
            error: error.message
        };
    }
};

// Exportación por defecto con todos los métodos
export default {
    obtenerCompetenciasIndividuales,
    finalizarCompetenciaIndividual,
    eliminarCompetenciaIndividual,
    actualizarResultadoEquipo,
    obtenerResultadosEquipos,
    obtenerEquipos,
    obtenerEquiposPorCategoria,
    obtenerCategoriasPorDisciplina,
    obtenerEquiposDeCompetencia
};