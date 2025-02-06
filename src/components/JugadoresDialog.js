import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Typography,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { obtenerJugadores, actualizarJugador, eliminarJugador } from '../services/jugadorServices';

const JugadoresDialog = ({ open, onClose, equipoId }) => {
  const [notification, setNotification] = useState({ message: '', type: '', open: false });
  const [jugadores, setJugadores] = useState([]);
  const [jugadorEditando, setJugadorEditando] = useState(null);

  useEffect(() => {
    if (equipoId && open) {
      fetchJugadores();
    }
  }, [equipoId, open]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const fetchJugadores = async () => {
    try {
      const response = await obtenerJugadores(equipoId);
      setJugadores(response.data);
    } catch (error) {
      setNotification({
        message: 'Error al obtener los jugadores.',
        type: 'error',
        open: true
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJugadorEditando(prev => ({ ...prev, [name]: value }));
  };

  const handleEditarJugador = (jugador) => {
    setJugadorEditando({
      ...jugador,
      fecha_ingreso: jugador.fecha_ingreso.split('T')[0]
    });
  };

  const handleActualizarJugador = async () => {
    try {
      await actualizarJugador(jugadorEditando.id, jugadorEditando);
      await fetchJugadores();
      setJugadorEditando(null);
      setNotification({
        message: 'Jugador actualizado exitosamente.',
        type: 'success',
        open: true
      });
    } catch (error) {
      setNotification({
        message: 'Error al actualizar el jugador.',
        type: 'error',
        open: true
      });
    }
  };

  const handleEliminarJugador = async (jugadorId) => {
    if (window.confirm('¿Está seguro de eliminar este jugador?')) {
      try {
        await eliminarJugador(jugadorId);
        await fetchJugadores();
        setNotification({
          message: 'Jugador eliminado exitosamente.',
          type: 'success',
          open: true
        });
      } catch (error) {
        setNotification({
          message: 'Error al eliminar el jugador.',
          type: 'error',
          open: true
        });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Jugadores del Equipo</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {jugadores.map((jugador) => (
              <Card key={jugador.id} sx={{ width: 300, mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    {jugador.nombre} {jugador.apellido}
                  </Typography>
                  <Typography>DNI: {jugador.dni}</Typography>
                  <Typography>Edad: {jugador.edad}</Typography>
                  <Typography>Sexo: {jugador.sexo === 'M' ? 'Masculino' : 'Femenino'}</Typography>
                  <Typography>Estado: {jugador.estado}</Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton onClick={() => handleEditarJugador(jugador)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEliminarJugador(jugador.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {jugadorEditando && (
            <Box component="form" sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Editar Jugador
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={jugadorEditando.nombre}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Apellido"
                    name="apellido"
                    value={jugadorEditando.apellido}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Edad"
                    name="edad"
                    type="number"
                    value={jugadorEditando.edad}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="DNI"
                    name="dni"
                    value={jugadorEditando.dni}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sexo</InputLabel>
                    <Select
                      name="sexo"
                      value={jugadorEditando.sexo}
                      onChange={handleChange}
                      label="Sexo"
                    >
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Femenino</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="estado"
                      value={jugadorEditando.estado}
                      onChange={handleChange}
                      label="Estado"
                    >
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Fecha de Ingreso"
                    name="fecha_ingreso"
                    type="date"
                    value={jugadorEditando.fecha_ingreso}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setJugadorEditando(null)} color="inherit">
                  Cancelar
                </Button>
                <Button onClick={handleActualizarJugador} variant="contained" color="primary">
                  Guardar Cambios
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JugadoresDialog;