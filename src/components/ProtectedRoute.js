import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
  // Simulación: reemplaza esto con tu lógica de autenticación
  const user = JSON.parse(localStorage.getItem('user')); // Asume que tienes un usuario guardado en el localStorage

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
