import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import partidoServices from '../services/partidoServices';

const SubirEvidencia = ({ open, onClose, partidoId }) => {
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [evidenciaExistente, setEvidenciaExistente] = useState(false);

  // Verificar evidencia existente al abrir el diálogo
  useEffect(() => {
    if (open && partidoId) {
      const verificarEvidencia = async () => {
        try {
          const evidencia = await partidoServices.verificarEvidenciaExistente(partidoId);
          if (evidencia) {
            setEvidenciaExistente(true); // Hay una evidencia existente
          } else {
            setEvidenciaExistente(false); // No hay evidencia existente
          }
        } catch (error) {
          console.error('Error al verificar evidencia existente:', error);
        }
      };

      verificarEvidencia();
    }
  }, [open, partidoId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validaciones
        if (file.size > 5 * 1024 * 1024) {
          onClose('El archivo es demasiado grande. El tamaño máximo es 5MB.', 'error');
          return;
        }

        if (!file.type.startsWith('image/')) {
          onClose('Por favor seleccione un archivo de imagen válido.', 'error');
          return;
        }

        // Convertir a Base64
        const reader = new FileReader();
        reader.onload = (event) => {
          // Obtener solo la parte Base64 sin el prefijo data:image
          const base64String = event.target.result.split(',')[1];
          setImagen(base64String);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        onClose('Error al procesar el archivo', 'error');
      }
    }
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };

  const handleSubmit = async () => {
    if (!imagen) {
      onClose('Por favor, selecciona una imagen.', 'error');
      return;
    }

    try {
      const evidenciaData = {
        partido_id: partidoId,
        url_imagen: imagen,
        descripcion: descripcion,
      };

      await partidoServices.subirEvidencia(evidenciaData);
      // Limpiar el formulario
      setImagen('');
      setDescripcion('');
      onClose('Evidencia subida exitosamente', 'success'); // Notificación de éxito
    } catch (error) {
      console.error('Error al subir la evidencia:', error);
      const errorMessage = error.response?.data?.message || 'Error al subir la evidencia';
      onClose(errorMessage, 'error'); // Notificación de error con mensaje específico
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setImagen(''); // Limpiar imagen
        setDescripcion(''); // Limpiar descripción
        onClose(); // Cerrar el diálogo
      }}
    >
      <DialogTitle>Subir Evidencia</DialogTitle>
      <DialogContent>
        {/* Mostrar mensaje si ya existe una evidencia */}
        {evidenciaExistente && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Ya se ha cargado una evidencia para este partido.
          </Alert>
        )}

        {/* Input para seleccionar archivo */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ margin: '20px 0' }}
        />
        {/* Vista previa de la imagen */}
        {imagen && (
          <img
            src={`data:image/jpeg;base64,${imagen}`}
            alt="Vista previa"
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              marginBottom: '20px',
            }}
          />
        )}
        {/* Campo de descripción */}
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={handleDescripcionChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setImagen(''); // Limpiar imagen
            setDescripcion(''); // Limpiar descripción
            onClose(); // Cerrar el diálogo
          }}
          color="primary"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!imagen || evidenciaExistente} 
        >
          Subir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubirEvidencia;