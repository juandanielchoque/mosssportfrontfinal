import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ModalEvidencias from '../ComponentesTablas/ModalEvidencias';

const TablaColectivos = ({ 
  partidos = [], 
  equipos = [], 
  disciplinas = [], 
  categorias = [],
  filtroTorneo,
  filtroDisciplina,
  filtroCategoria 
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [evidenciasActuales, setEvidenciasActuales] = useState(null);
  const [loadingEvidencias, setLoadingEvidencias] = useState(false);

  const handleVerEvidencias = async (partidoId) => {
    setLoadingEvidencias(true);
    try {
      const response = await fetch(`http://localhost:5000/api/evidencias/partido/${partidoId}`);
      const data = await response.json();
      setEvidenciasActuales(data.data || []);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al cargar evidencias:', error);
    } finally {
      setLoadingEvidencias(false);
    }
  };

  // Función para formatear el resultado
  const formatearResultado = (goles1, goles2) => {
    if (goles1 === 9999 && goles2 === 9999) {
      return "NP - NP";
    } else if (goles1 === 9999) {
      return `NP - ${goles2}`;
    } else if (goles2 === 9999) {
      return `${goles1} - NP`;
    }
    return `${goles1} - ${goles2}`;
  };

  // Función para determinar el estado del partido
  const determinarEstado = (partido) => {
    if (partido.goles_1 === 9999 || partido.goles_2 === 9999) {
      return {
        label: 'No Presentado',
        color: 'error'
      };
    }
    if (partido.goles_1 > 0 || partido.goles_2 > 0) {
      return {
        label: 'Finalizado',
        color: 'success'
      };
    }
    return {
      label: partido.estado || 'Pendiente',
      color: 'warning'
    };
  };

  if (!partidos || !equipos || !disciplinas || !categorias) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  const partidosFiltrados = partidos.filter((partido) => {
    const torneoMatch = !filtroTorneo || partido.torneo_id === parseInt(filtroTorneo);
    const disciplinaMatch = partido.disciplina_id === parseInt(filtroDisciplina);
    const categoriaMatch = !filtroCategoria || partido.categoria_id === parseInt(filtroCategoria);
    
    return torneoMatch && disciplinaMatch && categoriaMatch;
  });

  const nombreDisciplina = disciplinas.find(d => d.id === parseInt(filtroDisciplina))?.nombre || '';
  const nombreCategoria = categorias.find(c => c.id === parseInt(filtroCategoria))?.nombre || '';

  return (
    <>
      <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            {nombreDisciplina} {nombreCategoria ? `- ${nombreCategoria}` : ''}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo 1</TableCell>
                <TableCell align="center">Resultado</TableCell>
                <TableCell>Equipo 2</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Evidencias</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partidosFiltrados.map((partido) => {
                const equipo1 = equipos.find(e => e.id === partido.equipo1_id);
                const equipo2 = equipos.find(e => e.id === partido.equipo2_id);
                const estado = determinarEstado(partido);

                return (
                  <TableRow key={partido.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={equipo1?.logo ? `data:image/jpeg;base64,${equipo1.logo}` : ''}
                          alt={equipo1?.nombre}
                        >
                          {equipo1?.nombre?.charAt(0) || 'E'}
                        </Avatar>
                        <Typography>
                          {equipo1?.nombre || "No asignado"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        color={partido.goles_1 === 9999 || partido.goles_2 === 9999 ? 'error.main' : 'text.primary'}
                      >
                        {formatearResultado(partido.goles_1, partido.goles_2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={equipo2?.logo ? `data:image/jpeg;base64,${equipo2.logo}` : ''}
                          alt={equipo2?.nombre}
                        >
                          {equipo2?.nombre?.charAt(0) || 'E'}
                        </Avatar>
                        <Typography>
                          {equipo2?.nombre || "No asignado"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estado.label}
                        color={estado.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        startIcon={<ImageIcon />}
                        onClick={() => handleVerEvidencias(partido.id)}
                        disabled={loadingEvidencias}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {partidosFiltrados.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No hay partidos disponibles para los filtros seleccionados
              </Typography>
            </Box>
          )}
        </TableContainer>
      </Paper>

      <ModalEvidencias
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        evidencias={evidenciasActuales}
      />
    </>
  );
};

export default TablaColectivos;