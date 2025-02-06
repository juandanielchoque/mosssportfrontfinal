import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
} from '@mui/material';
import { actualizarEquipo } from '../../services/equipoServices';

const EditarEquipo = ({ open, onClose, equipo, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    capitan_nombre: '',
    capitan_correo: '',
    logo: null,
  });

  // Cargar datos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre: equipo.nombre || '',
        capitan_nombre: equipo.capitan_nombre || '',
        capitan_correo: equipo.capitan_correo || '',
        logo: equipo.logo || null,
      });
    }
  }, [equipo]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
          return;
        }

        if (!file.type.startsWith('image/')) {
          alert('Por favor seleccione un archivo de imagen válido.');
          return;
        }

        const base64String = await fileToBase64(file);
        setFormData(prev => ({ ...prev, logo: base64String }));
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al procesar el archivo');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.nombre || !formData.capitan_nombre || !formData.capitan_correo) {
        alert('Por favor complete todos los campos requeridos.');
        return;
      }

      await actualizarEquipo(equipo.id, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error al actualizar el equipo:', error);
      alert('Error al actualizar el equipo');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Equipo</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nombre del Equipo"
            variant="outlined"
            fullWidth
            required
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          />

          <TextField
            label="Nombre del Capitán"
            variant="outlined"
            fullWidth
            required
            value={formData.capitan_nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, capitan_nombre: e.target.value }))}
          />

          <TextField
            label="Correo del Capitán"
            variant="outlined"
            fullWidth
            required
            value={formData.capitan_correo}
            onChange={(e) => setFormData(prev => ({ ...prev, capitan_correo: e.target.value }))}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {formData.logo && (
              <Avatar
                src={`data:image/jpeg;base64,${formData.logo}`}
                alt="Logo del equipo"
                sx={{ width: 100, height: 100 }}
              />
            )}
            <Button variant="contained" component="label">
              {formData.logo ? 'Cambiar Logo' : 'Subir Logo'}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarEquipo;