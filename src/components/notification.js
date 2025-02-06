// components/Notification.js
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Componente para mostrar notificaciones.
 * @param {Object} props
 * @param {Object} props.notification - Estado de la notificación.
 * @param {Function} props.onClose - Función para cerrar la notificación.
 */
const Notification = ({ notification, onClose }) => {
  const { open, message, severity } = notification;

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000} // Desaparece automáticamente después de 2 segundos
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
