import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button,
  TextField,
  MenuItem
} from '@mui/material';

const EditarCompetencia = ({ open, onClose, competencia, onSubmit }) => {
  const [formData, setFormData] = useState({
    disciplina_id: competencia?.disciplina_id || '',
    categoria_id: competencia?.categoria_id || '',
    fecha_hora: competencia?.fecha_hora || '',
    lugar: competencia?.lugar || '',
    arbitro: competencia?.arbitro || '',
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (competencia) {
      setFormData({
        disciplina_id: competencia.disciplina_id,
        categoria_id: competencia.categoria_id,
        fecha_hora: competencia.fecha_hora,
        lugar: competencia.lugar,
        arbitro: competencia.arbitro,
      });
    }
  }, [competencia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(competencia.id, formData);
    onClose();
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
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Editar Competencia
        </Typography>

        <TextField
          fullWidth
          label="Fecha y Hora"
          type="datetime-local"
          name="fecha_hora"
          value={formData.fecha_hora}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Lugar"
          name="lugar"
          value={formData.lugar}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Árbitro"
          name="arbitro"
          value={formData.arbitro}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarCompetencia;