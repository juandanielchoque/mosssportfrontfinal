import React from 'react';
import { Box, Typography, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const TablaPartidos = ({ titulo, partidos, equipos, torneos, onIniciarPartido, onFinalizarPartido, onEditarPartido, onEliminarPartido }) => {

  const getEquipoNombre = (id) => {
    const equipo = equipos.find((equipo) => equipo.equipo_id === id);
    return equipo ? equipo.nombre_equipo : 'Desconocido'; 
  };

  const getTorneoNombre = (id) => {
    if (!torneos || torneos.length === 0) {
      console.log('No hay torneos disponibles');
      return 'Desconocido'; // Retornar "Desconocido" si la lista de torneos está vacía o no está definida
    }
    const torneo = torneos.find((torneo) => torneo.id === id);
    return torneo ? torneo.nombre : 'Desconocido'; // Usamos "nombre" para acceder al nombre del torneo
  };

  return (
    <Box sx={{ marginBottom: 3, padding: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        {titulo}
      </Typography>
      {partidos.length === 0 ? (
        <Typography>No hay partidos en esta categoría.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Equipo Local</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Equipo Visitante</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha y Hora</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Lugar</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Árbitro</TableCell>
                {titulo === 'Partidos Finalizados' && (
                  <>
                    <TableCell sx={{ fontWeight: 'bold' }}>Goles Local</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Goles Visitante</TableCell>
                  </>
                )}
                {titulo === 'Partidos En Curso' && (
                  <>
                    <TableCell sx={{ fontWeight: 'bold' }}>Goles Local</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Goles Visitante</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {partidos.map((partido, index) => (
                <TableRow
                  key={partido.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                  }}
                >
                  <TableCell>{getEquipoNombre(partido.equipo_local_id)}</TableCell>
                  <TableCell>{getEquipoNombre(partido.equipo_visitante_id)}</TableCell>
                  <TableCell>{new Date(partido.fecha_hora).toLocaleString()}</TableCell>
                  <TableCell>{partido.lugar}</TableCell>
                  <TableCell>{partido.arbitro}</TableCell>
                  {titulo === 'Partidos Finalizados' && (
                    <>
                      <TableCell>{partido.goles_local}</TableCell>
                      <TableCell>{partido.goles_visitante}</TableCell>
                    </>
                  )}
                  {titulo === 'Partidos En Curso' && (
                    <>
                      <TableCell>{partido.goles_local}</TableCell>
                      <TableCell>{partido.goles_visitante}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TablaPartidos;
