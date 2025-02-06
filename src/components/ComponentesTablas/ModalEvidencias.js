import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalEvidencias = ({ open, handleClose, evidencias }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Evidencias del Partido</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {evidencias && evidencias.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {evidencias.map((evidencia) => (
              <Box key={evidencia.id} sx={{ mb: 2 }}>
                <img 
                  src={`data:image/jpeg;base64,${evidencia.url_imagen}`}
                  alt="Evidencia del partido"
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                />
                {evidencia.descripcion && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {evidencia.descripcion}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Subido el: {new Date(evidencia.fecha_subida).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography sx={{ textAlign: 'center', py: 3 }} color="text.secondary">
            No hay evidencias disponibles para este partido
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalEvidencias;