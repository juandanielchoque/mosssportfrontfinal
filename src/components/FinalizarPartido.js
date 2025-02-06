import React, { useState } from 'react';
import { Button, Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const FinalizarPartido = ({ open, onClose, partido, onUpdate }) => {
  const [actualizacionPartido, setActualizacionPartido] = useState({
    goles_local: partido ? partido.goles_local : '',
    goles_visitante: partido ? partido.goles_visitante : '',
    estado: 'finalizado', // Estado por defecto al finalizar
  });

  const handleUpdatePartido = () => {
    if (!partido || !partido.id) {
      console.error('No hay partido seleccionado o el ID es inválido');
      return;
    }

    axios
      .put(`http://localhost:5000/api/partidos/${partido.id}`, actualizacionPartido)
      .then((response) => {
        onUpdate(response.data); // Actualizar el partido en el estado del componente padre
        onClose(); // Cerrar el modal
      })
      .catch((error) => {
        console.error('Error al actualizar el partido', error);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Finalizar Partido
        </Typography>
        <TextField
          fullWidth
          label="Goles Local"
          type="number"
          value={actualizacionPartido.goles_local}
          onChange={(e) =>
            setActualizacionPartido((prev) => ({ ...prev, goles_local: e.target.value }))
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Goles Visitante"
          type="number"
          value={actualizacionPartido.goles_visitante}
          onChange={(e) =>
            setActualizacionPartido((prev) => ({ ...prev, goles_visitante: e.target.value }))
          }
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Estado</InputLabel>
          <Select
            value={actualizacionPartido.estado}
            onChange={(e) =>
              setActualizacionPartido((prev) => ({ ...prev, estado: e.target.value }))
            }
          >
            <MenuItem value="finalizado">Finalizado</MenuItem>
            <MenuItem value="en curso">En curso</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdatePartido}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Finalizar
        </Button>
      </Box>
    </Modal>
  );
};

export default FinalizarPartido;
