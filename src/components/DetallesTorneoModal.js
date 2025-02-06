import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

const DetallesTorneoModal = ({ open, onClose, torneoId }) => {
  const [torneo, setTorneo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener los detalles del torneo
  const fetchTorneoDetails = async () => {
    if (!torneoId) return;

    try {
      // Obtener el token de localStorage o de donde esté guardado
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado.');
        setLoading(false);
        return;
      }

      // Configurar los encabezados para la solicitud con el token de autenticación
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Usamos el token en el encabezado Authorization
        },
      };

      // Realizar la solicitud GET para obtener los detalles del torneo
      const response = await axios.get(`http://localhost:5000/api/torneos/${torneoId}`, config);
      setTorneo(response.data);  // Guardamos los detalles del torneo
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los detalles del torneo:', error);
      setError('Error al obtener los detalles.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTorneoDetails();  // Solo obtener los detalles cuando el modal esté abierto
    }
  }, [open, torneoId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalles del Torneo</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          torneo && (
            <div>
              <p><strong>Nombre:</strong> {torneo.nombre}</p>
              <p><strong>Tipo:</strong> {torneo.tipo}</p>
              <p><strong>Fecha de Inicio:</strong> {new Date(torneo.fecha_inicio).toLocaleDateString()}</p>
              <p><strong>Fecha de Fin:</strong> {new Date(torneo.fecha_fin).toLocaleDateString()}</p>
              <p><strong>Lugar:</strong> {torneo.lugar}</p>
              <p><strong>Equipos Inscritos:</strong> {torneo.equiposInscritos}</p> {/* Ajusta según la estructura del objeto torneo */}
              <p><strong>Estado:</strong> {torneo.estado}</p>
              <p><strong>Reglas:</strong> {torneo.reglas}</p>
            </div>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetallesTorneoModal;
