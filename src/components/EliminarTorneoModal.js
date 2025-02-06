import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

const EliminarTorneoModal = ({ open, onClose, torneoToDelete, onDelete }) => {
  const [loading, setLoading] = useState(false);  // Estado de carga
  const [error, setError] = useState(null);        // Estado para el manejo de errores

  const handleDelete = async () => {
    if (torneoToDelete) {
      try {
        setLoading(true);  // Comienza el estado de carga

        // Obtener el token de localStorage o de donde esté guardado
        const token = localStorage.getItem('token');
console.log("Token obtenido:", token); // Verifica el token
if (!token) {
  setError("No estás autenticado.");
  return;
}
// Ajusta según donde guardes el token

        // Configurar los encabezados para la solicitud con el token de autenticación
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Usamos el token en el encabezado Authorization
          },
        };

        // Realizar la solicitud DELETE con el token de autenticación
        await axios.delete(`http://localhost:5000/api/torneos/${torneoToDelete}`, config);
        
        setLoading(false); // Termina el estado de carga
        onDelete();  // Llamar a la función de actualización en el parent
        onClose();   // Cerrar el modal
      } catch (error) {
        setLoading(false);  // Termina el estado de carga
        if (error.response) {
          setError(error.response.data.message || 'Error al eliminar el torneo');
        } else {
          setError('Error desconocido');
        }
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Torneo</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress /> {/* Muestra el spinner de carga */}
            <Typography variant="body2" color="textSecondary">
              Eliminando torneo...
            </Typography>
          </div>
        ) : (
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar este torneo?
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error" style={{ marginTop: 10 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleDelete} color="secondary" disabled={loading}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminarTorneoModal;
