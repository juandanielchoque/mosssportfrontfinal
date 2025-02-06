// hooks/useNotification.js
import { useState } from 'react';

/**
 * Hook personalizado para manejar notificaciones.
 * @returns {Object} Estado y funciones para manejar notificaciones.
 */
const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success', // Puede ser 'success', 'error', 'info', 'warning'
  });

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return { notification, showNotification, closeNotification };
};

export default useNotification;
