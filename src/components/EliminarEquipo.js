import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Select, MenuItem, Typography, Box, InputLabel, FormControl } from '@mui/material';

const EliminarEquipo = () => {
  const [equipos, setEquipos] = useState([]); // Guardar los equipos obtenidos
  const [equipoId, setEquipoId] = useState(''); // ID del equipo seleccionado
  const [mensaje, setMensaje] = useState(''); // Mensaje de éxito o error

  // Obtener la lista de equipos desde la API
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/equipos');
        setEquipos(response.data); // Guardar los equipos en el estado
      } catch (error) {
        console.error('Error al obtener los equipos:', error);
      }
    };

    fetchEquipos();
  }, []);

  // Función para eliminar un equipo
  const eliminarEquipo = async () => {
    if (!equipoId) {
      setMensaje('Por favor, selecciona un equipo.');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/equipos/${equipoId}`);
      if (response.status === 200) {
        setMensaje('Equipo eliminado con éxito.');
        // Filtrar el equipo eliminado y actualizar la lista
        setEquipos(equipos.filter((equipo) => equipo.equipo_id !== equipoId));
      }
    } catch (error) {
      setMensaje('Error al eliminar el equipo.');
      console.error('Error al eliminar el equipo:', error);
    }
  };

  return (
    <Box sx={{ width: '50%', margin: 'auto', textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Eliminar Equipo
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel id="select-equipo-label">Selecciona un Equipo</InputLabel>
        <Select
          labelId="select-equipo-label"
          value={equipoId}
          label="Selecciona un Equipo"
          onChange={(e) => setEquipoId(e.target.value)}
        >
          {equipos.map((equipo) => (
            <MenuItem key={equipo.equipo_id} value={equipo.equipo_id}>
              {equipo.nombre_equipo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="error" onClick={eliminarEquipo} sx={{ width: '100%' }}>
        Eliminar Equipo
      </Button>
      {mensaje && (
        <Typography variant="body1" sx={{ marginTop: '20px', color: mensaje.includes('Éxito') ? 'green' : 'red' }}>
          {mensaje}
        </Typography>
      )}
    </Box>
  );
};

export default EliminarEquipo;
