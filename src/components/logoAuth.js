import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import useNotification from '../hooks/useNotification'; // Hook para manejar notificaciones
import Notification from '../components/notification'; // Componente para mostrar notificaciones

const LogoAuth = ({ onLogout }) => {
  const navigate = useNavigate();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { notification, showNotification, closeNotification } = useNotification(); // Manejo de notificaciones

  // Manejar apertura/cierre del diálogo de confirmación
  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  // Cerrar sesión y redirigir
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];

    if (onLogout) {
      onLogout();
    }

    showNotification('Sesión cerrada exitosamente.', 'success'); // Notificación de éxito
    navigate('/login'); // Redirigir al login
  };

  return (
    <>
      <div
        onClick={handleOpenConfirmDialog}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          background: 'red',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <span>Cerrar Sesión</span>
      </div>

      {/* Diálogo de confirmación */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-logout-title"
        aria-describedby="confirm-logout-description"
      >
        <DialogTitle id="confirm-logout-title">Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-logout-description">
            ¿Estás seguro de que deseas cerrar sesión? Perderás acceso a tus datos actuales.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificación */}
      <Notification notification={notification} onClose={closeNotification} />
    </>
  );
};

const MyComponent = () => {
  const navigate = useNavigate();

  const handleSectionChange = (section) => {
    if (section === 'Cerrar Sesión') {
      console.log('Ejecutando lógica antes del cierre de sesión...');
    } else {
      console.log('Cambiando a la sección:', section);
      navigate(`/${section.toLowerCase().replace(' ', '-')}`); // Navegación dinámica
    }
  };

  const handleLogout = () => {
    console.log('Logout completado!');
    navigate('/login');
  };

  return (
    <div>
      <LogoAuth onLogout={handleLogout} />
    </div>
  );
};

export default MyComponent;
