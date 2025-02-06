import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button,
  TextField
} from '@mui/material';

const FinalizarCompetencia = ({ open, onClose, competencia, onFinalizar }) => {
  const [resultados, setResultados] = useState({});

  // Inicializar resultados
  useState(() => {
    if (competencia) {
      const resultadosIniciales = {};
      competencia.equipos.forEach(equipo => {
        resultadosIniciales[equipo.id] = 0; // Inicializar en 0
      });
      setResultados(resultadosIniciales);
    }
  }, [competencia]);

  const handleChangeResultado = (equipoId, value) => {
    setResultados((prev) => ({ ...prev, [equipoId]: value }));
  };

  const handleSubmit = () => {
    onFinalizar(competencia.id, resultados);
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
          Finalizar Competencia
        </Typography>

        {competencia?.equipos.map((equipo) => (
          <TextField
            key={equipo.id}
            fullWidth
            label={`Puntaje de ${equipo.nombre}`}
            type="number"
            value={resultados[equipo.id] || 0}
            onChange={(e) => handleChangeResultado(equipo.id, e.target.value)}
            sx={{ mb: 2 }}
          />
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Finalizar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FinalizarCompetencia;