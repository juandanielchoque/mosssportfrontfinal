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
  Snackbar
} from '@mui/material';
import { agregarJugador } from '../services/jugadorServices';

const AgregarJugadorDialog = ({ open, onClose, equipoId }) => {
  const [notification, setNotification] = useState({ message: '', type: '', open: false });
  const [jugadorNuevo, setJugadorNuevo] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    equipo_id: equipoId,
    sexo: 'M',
    dni: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    estado: 'activo'
  });

  useEffect(() => {
    setJugadorNuevo(prev => ({ ...prev, equipo_id: equipoId }));
  }, [equipoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJugadorNuevo(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleAgregarJugador = async () => {
    // Validar campos obligatorios
    if (!jugadorNuevo.nombre || !jugadorNuevo.apellido || !jugadorNuevo.dni) {
      setNotification({
        message: 'Por favor complete todos los campos obligatorios.',
        type: 'error',
        open: true
      });
      return;
    }

    try {
      await agregarJugador(jugadorNuevo);
      setNotification({
        message: 'Jugador agregado exitosamente.',
        type: 'success',
        open: true
      });
      setJugadorNuevo({
        nombre: '',
        apellido: '',
        edad: '',
        equipo_id: equipoId,
        sexo: 'M',
        dni: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        estado: 'activo'
      });
      onClose();
    } catch (error) {
      setNotification({
        message: 'Error al agregar el jugador. Intente nuevamente.',
        type: 'error',
        open: true
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Jugador</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={jugadorNuevo.nombre}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={jugadorNuevo.apellido}
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
                  value={jugadorNuevo.edad}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="DNI"
                  name="dni"
                  value={jugadorNuevo.dni}
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
                    value={jugadorNuevo.sexo}
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
                    value={jugadorNuevo.estado}
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
                  value={jugadorNuevo.fecha_ingreso}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAgregarJugador} variant="contained" color="primary">
            Agregar Jugador
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

export default AgregarJugadorDialog;