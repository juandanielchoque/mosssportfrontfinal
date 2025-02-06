import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const EditarTorneoModal = ({ open, onClose, torneoId, onUpdate }) => {
  const [torneo, setTorneo] = useState({
    nombre: '',
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    lugar: '',
    estado: '',
    reglas: '',
    categorias: [], // Array para categorías seleccionadas, nunca null
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [allCategorias, setAllCategorias] = useState([]); // Todas las categorías
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false); // Estado de carga de categorías

  useEffect(() => {
    if (open && torneoId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/torneos/${torneoId}`)
        .then(response => {
          const torneoData = response.data;

          // Asegurarse de que las categorías no sean null ni undefined
          const categoriasSeleccionadas = Array.isArray(torneoData.categorias)
            ? torneoData.categorias
            : torneoData.categorias ? torneoData.categorias.split(',').map(categoria => categoria.trim()) : [];

          setTorneo({
            ...torneoData,
            categorias: categoriasSeleccionadas,
          });

          setLoading(false);
        })
        .catch((error) => {
          setError('Hubo un error al cargar los datos del torneo.');
          console.error(error);
          setLoading(false);
        });
    }
  }, [open, torneoId]);

  useEffect(() => {
    setIsLoadingCategorias(true);
    axios.get('http://localhost:5000/api/categorias/categorias')
      .then(response => {
        setAllCategorias(response.data);
        setIsLoadingCategorias(false);
      })
      .catch((error) => {
        setError('Hubo un error al cargar las categorías.');
        setIsLoadingCategorias(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTorneo({ ...torneo, [name]: value });
  };

  const handleCategoriaClick = (categoria) => {
    setTorneo(prevTorneo => {
      const categorias = [...prevTorneo.categorias];
      const categoriaIndex = categorias.indexOf(categoria);
      
      if (categoriaIndex === -1) {
        categorias.push(categoria); // Agregar si no está seleccionada
      } else {
        categorias.splice(categoriaIndex, 1); // Eliminar si ya está seleccionada
      }
      
      return { ...prevTorneo, categorias };
    });
  };

  const handleSelectAllCategories = () => {
    setTorneo(prevTorneo => ({
      ...prevTorneo,
      categorias: allCategorias.map(categoria => categoria.nombre),
    }));
  };

  const handleClearAllCategories = () => {
    setTorneo(prevTorneo => ({ ...prevTorneo, categorias: [] }));
  };

  const handleUpdateTorneo = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const {
      nombre,
      tipo,
      fecha_inicio,
      fecha_fin,
      lugar,
      estado,
      reglas,
      categorias,
    } = torneo;

    // Validación ajustada
    if (!nombre || !tipo || !fecha_inicio || !fecha_fin || !lugar || !estado || !reglas) {
      setLoading(false);
      setError('Por favor, complete todos los campos.');
      return;
    }

    if (fecha_inicio > fecha_fin) {
      setLoading(false);
      setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    const formattedFechaInicio = fecha_inicio.split('T')[0];
    const formattedFechaFin = fecha_fin.split('T')[0];

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('No estás autenticado.');
        return;
      }

      // Asegúrate de que las categorías no sean null, siempre se envía como un array (puede estar vacío)
      await axios.put(
        `http://localhost:5000/api/torneos/${torneoId}`,
        {
          ...torneo,
          categorias: categorias || [],  // Asegura que categorias sea un array vacío si es null
          fecha_inicio: formattedFechaInicio,
          fecha_fin: formattedFechaFin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Torneo actualizado con éxito.');
      onUpdate(torneoId);
      onClose();
    } catch (error) {
      setError('Hubo un error al actualizar el torneo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Torneo</DialogTitle>
      <DialogContent>
        <TextField label="Nombre" name="nombre" value={torneo.nombre} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Tipo" name="tipo" value={torneo.tipo} onChange={handleChange} fullWidth margin="normal" />
        <TextField
          label="Fecha de Inicio"
          type="date"
          name="fecha_inicio"
          value={torneo.fecha_inicio}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de Fin"
          type="date"
          name="fecha_fin"
          value={torneo.fecha_fin}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField label="Lugar" name="lugar" value={torneo.lugar} onChange={handleChange} fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={torneo.estado}
            onChange={handleChange}
          >
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="en curso">En curso</MenuItem>
            <MenuItem value="finalizado">Finalizado</MenuItem>
          </Select>
        </FormControl>

        {/* Botones para categorías */}
        <div>
          {isLoadingCategorias ? (
            <p>Cargando categorías...</p>
          ) : (
            <>
              <Button onClick={handleSelectAllCategories} variant="contained" color="primary" fullWidth>
                Seleccionar todas las categorías
              </Button>
              <Button onClick={handleClearAllCategories} variant="outlined" color="secondary" fullWidth>
                No asignar ninguna categoría
              </Button>
              <div>
                {allCategorias.map(categoria => (
                  <Button
                    key={categoria.id}
                    onClick={() => handleCategoriaClick(categoria.nombre)}
                    variant={torneo.categorias.includes(categoria.nombre) ? "contained" : "outlined"}
                    color={torneo.categorias.includes(categoria.nombre) ? "primary" : "default"}
                    style={{ margin: '5px' }}
                  >
                    {categoria.nombre}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>

        <TextField
          label="Reglas"
          name="reglas"
          value={torneo.reglas}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleUpdateTorneo} color="primary" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </DialogActions>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || success}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Dialog>
  );
};

export default EditarTorneoModal;
