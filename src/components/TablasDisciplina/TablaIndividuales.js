import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar
} from '@mui/material';

const TablaIndividuales = ({ 
  competencias = [], 
  competenciaEquipos = [],
  equipos = [],
  disciplinas = [],
  filtroTorneo,
  filtroDisciplina
}) => {
  const flatCompetenciaEquipos = Array.isArray(competenciaEquipos[0]) 
    ? competenciaEquipos[0] 
    : competenciaEquipos;

  if (!competencias?.length || !flatCompetenciaEquipos?.length || !equipos?.length || !disciplinas?.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  const competenciasFiltradas = competencias.filter(comp => 
    (!filtroTorneo || comp.torneo_id === (filtroTorneo ? parseInt(filtroTorneo) : comp.torneo_id)) &&
    comp.disciplina_id === parseInt(filtroDisciplina)
  );

  const resultadosFiltrados = flatCompetenciaEquipos.filter(ce => 
    competenciasFiltradas.some(comp => comp.id === ce.competencia_id)
  );

  const disciplinaEncontrada = disciplinas.find(d => d.id === parseInt(filtroDisciplina));
  const nombreDisciplina = disciplinaEncontrada?.nombre || "Disciplina";

  // Función para determinar el estado basado en el puntaje
  const determinarEstado = (competencia, resultado) => {
    if (resultado.resultado_equipo === 9999) {
      return { texto: 'No Presentado', color: 'error.main' };
    }
    if (resultado.resultado_equipo > 0) {
      return { texto: 'Finalizado', color: 'success.main' };
    }
    return { texto: competencia.estado || 'Por determinar', color: 'warning.main' };
  };

  // Función para formatear el puntaje
  const formatearPuntaje = (puntaje) => {
    if (puntaje === 9999) return 'NP';
    return `${puntaje || '0'} puntos`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {`Competición - ${nombreDisciplina}`}
      </Typography>

      {competenciasFiltradas.map((competencia) => {
        const resultadosCompetencia = resultadosFiltrados.filter(
          resultado => resultado.competencia_id === competencia.id
        );
        
        return (
          <Box key={competencia.id} sx={{ mb: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {new Date(competencia.fecha_hora).toLocaleDateString()} - {competencia.lugar}
              </Typography>
            </Box>

            {resultadosCompetencia.map((resultado) => {
              const equipo = equipos.find(e => e.id === resultado.equipo_id);
              const estado = determinarEstado(competencia, resultado);
              
              return (
                <Box 
                  key={resultado.id} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    gap: 3,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      border: '2px solid #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Avatar
                      src={equipo?.logo ? `data:image/jpeg;base64,${equipo.logo}` : ''}
                      alt={equipo?.nombre}
                    >
                      {equipo?.nombre?.charAt(0) || 'E'}
                    </Avatar>
                  </Box>

                  <Typography sx={{ 
                    flex: 1, 
                    fontWeight: 'medium',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {equipo?.nombre || 'Equipo no encontrado'}
                  </Typography>

                  <Typography sx={{ 
                    minWidth: 100,
                    fontWeight: 'bold',
                    color: resultado.resultado_equipo === 9999 ? 'error.main' : 'primary.main',
                    textAlign: 'right'
                  }}>
                    {formatearPuntaje(resultado.resultado_equipo)}
                  </Typography>

                  <Typography 
                    sx={{ 
                      minWidth: 120,
                      color: estado.color,
                      fontWeight: 'medium',
                      textAlign: 'right'
                    }}
                  >
                    {estado.texto}
                  </Typography>
                </Box>
              );
            })}

            {resultadosCompetencia.length === 0 && (
              <Typography sx={{ textAlign: 'center', color: 'text.secondary', my: 2 }}>
                No hay equipos registrados en esta competencia
              </Typography>
            )}
          </Box>
        );
      })}

      {competenciasFiltradas.length === 0 && (
        <Box p={3} textAlign="center">
          <Typography color="text.secondary">
            No hay competencias disponibles para los filtros seleccionados
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TablaIndividuales;