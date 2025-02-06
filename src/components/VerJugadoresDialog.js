import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Card, CardContent, Button } from '@mui/material';
import { obtenerJugadores } from '../services/jugadorServices';

const VerJugadoresDialog = ({ open, onClose, equipoId }) => {
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    if (equipoId) {
      fetchJugadores();
    }
  }, [equipoId]);

  const fetchJugadores = async () => {
    try {
      const response = await obtenerJugadores(equipoId);
      setJugadores(response.data);
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
    }
  };

  const formatFechaIngreso = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric'};
    return new Intl.DateTimeFormat('es-ES', opciones).format(new Date(fecha));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Jugadores del Equipo</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {jugadores.map((jugador) => (
            <Card key={jugador.id} sx={{ width: '30%' }}>
              <CardContent>
                <Typography variant="h6">{jugador.nombre} {jugador.apellido}</Typography>
                <Typography>Edad: {jugador.edad}</Typography>
                <Typography>Sexo: {jugador.sexo}</Typography>
                <Typography>DNI: {jugador.dni}</Typography>
                <Typography>Fecha de Ingreso: {formatFechaIngreso(jugador.fecha_ingreso)}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" sx={{ fontWeight: 'bold' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerJugadoresDialog;
