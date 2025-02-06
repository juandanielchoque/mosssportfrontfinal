import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, MenuItem, Checkbox, FormControlLabel, FormGroup, Grid, Typography, Divider, Box } from '@mui/material';
import axios from 'axios';

const CrearTorneoModal = ({ open, onClose }) => {
  const [newTorneo, setNewTorneo] = useState({
    nombre: '',
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    lugar: '',
    estado: '',
    reglas: '',
    categorias: [],
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [allCategorias, setAllCategorias] = useState([]);
  const [noCategorias, setNoCategorias] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categorias/categorias')
      .then((response) => {
        setAllCategorias(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar las categorías:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTorneo({ ...newTorneo, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setNewTorneo((prev) => {
      const updatedCategorias = checked
        ? [...prev.categorias, value]
        : prev.categorias.filter((cat) => cat !== value);
      return { ...prev, categorias: updatedCategorias };
    });
  };

  const handleCreateTorneo = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, categorias } = newTorneo;

    if (!nombre || !tipo || !fecha_inicio || !fecha_fin || !lugar || !estado || !reglas) {
      setLoading(false);
      setError('Por favor, complete todos los campos excepto las categorías.');
      return;
    }

    if (fecha_inicio > fecha_fin) {
      setLoading(false);
      setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    if (categorias.length === 0 && !noCategorias) {
      setLoading(false);
      setError('Por favor, seleccione al menos una categoría o marque la opción "No añadir ninguna categoría".');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('No estás autenticado.');
        return;
      }

      await axios.post(
        'http://localhost:5000/api/torneos',
        {
          ...newTorneo,
          categorias: noCategorias ? [] : categorias,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Torneo creado con éxito.');
      onClose();
    } catch (error) {
      setError('Hubo un error al crear el torneo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Crear Nuevo Torneo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Nombre" name="nombre" value={newTorneo.nombre} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Tipo" name="tipo" value={newTorneo.tipo} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Inicio"
              type="date"
              name="fecha_inicio"
              value={newTorneo.fecha_inicio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Fin"
              type="date"
              name="fecha_fin"
              value={newTorneo.fecha_fin}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Lugar" name="lugar" value={newTorneo.lugar} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Estado"
              name="estado"
              value={newTorneo.estado}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="en curso">En curso</MenuItem>
              <MenuItem value="finalizado">Finalizado</MenuItem>
            </TextField>
          </Grid>

          {/* Sección de Categorías Mejorada */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Categorías</Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Selecciona las categorías para este torneo. Si no deseas agregar ninguna categoría, marca la opción "No añadir ninguna categoría".
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={noCategorias} onChange={() => setNoCategorias(!noCategorias)} />}
                label="No añadir ninguna categoría"
              />
              {!noCategorias && (
                <Grid container spacing={2}>
                  {allCategorias.map((categoria) => (
                    <Grid item xs={12} sm={6} md={4} key={categoria.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={categoria.nombre}
                            checked={newTorneo.categorias.includes(categoria.nombre)}
                            onChange={handleCategoryChange}
                          />
                        }
                        label={categoria.nombre}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Reglas"
              name="reglas"
              value={newTorneo.reglas}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={handleCreateTorneo} color="primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
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

export default CrearTorneoModal;