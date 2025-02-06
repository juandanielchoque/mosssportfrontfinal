import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox, FormControlLabel, Button, Snackbar, TextField, Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

const SeleccionarTorneosYCategorias = () => {
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedTorneos, setSelectedTorneos] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [newCategoria, setNewCategoria] = useState('');
  const [editCategoria, setEditCategoria] = useState(null);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/torneos');
        setTorneos(response.data);
      } catch (error) {
        setError('Hubo un error al obtener los torneos.');
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categorias/categorias');
        setCategorias(response.data);
      } catch (error) {
        setError('Hubo un error al obtener las categorías.');
      }
    };

    fetchTorneos();
    fetchCategorias();
  }, []);

  const handleTorneoCheckboxChange = (event, torneo) => {
    if (event.target.checked) {
      setSelectedTorneos((prevSelected) => [...prevSelected, torneo]);
    } else {
      setSelectedTorneos((prevSelected) =>
        prevSelected.filter((item) => item !== torneo)
      );
    }
  };

  const handleCategoriaCheckboxChange = (event, categoria) => {
    if (event.target.checked) {
      setSelectedCategorias((prevSelected) => [...prevSelected, categoria]);
    } else {
      setSelectedCategorias((prevSelected) =>
        prevSelected.filter((item) => item !== categoria)
      );
    }
  };

  const handleSelectAllTorneos = () => {
    if (selectedTorneos.length === torneos.length) {
      setSelectedTorneos([]);
    } else {
      setSelectedTorneos(torneos.map((torneo) => torneo.id));
    }
  };

  const handleSelectAllCategorias = () => {
    if (selectedCategorias.length === categorias.length) {
      setSelectedCategorias([]);
    } else {
      setSelectedCategorias(categorias.map((categoria) => categoria.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedTorneos.length === 0) {
      setError('Por favor, seleccione al menos un torneo.');
      return;
    }

    if (selectedCategorias.length === 0) {
      setError('Por favor, seleccione al menos una categoría.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('No estás autenticado.');
        return;
      }

      const payload = selectedTorneos.map((torneoId) => ({
        torneoId,
        categorias: selectedCategorias.map((categoriaId) => {
          const categoria = categorias.find((cat) => cat.id === categoriaId);
          return categoria ? categoria.nombre : '';
        }),
      }));

      for (const { torneoId, categorias } of payload) {
        await axios.post(
          `http://localhost:5000/api/torneos/${torneoId}/categorias`,
          { torneoId, categorias },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setSuccess('Torneos y categorías agregados correctamente.');
    } catch (error) {
      setError('Hubo un error al agregar los torneos y las categorías.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategoria = async () => {
    if (!newCategoria) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/categorias/categorias', {
        nombre: newCategoria,
      });
      setCategorias((prevCategorias) => [...prevCategorias, response.data]);
      setNewCategoria('');
      setSuccess('Categoría creada correctamente.');
    } catch (error) {
      setError('Hubo un error al crear la categoría.');
    }
  };

  const handleEditCategoria = async () => {
    if (!editCategoria || !editCategoria.nombre) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/categorias/categorias/${editCategoria.id}`, {
        nombre: editCategoria.nombre,
      });
      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          categoria.id === editCategoria.id ? { ...categoria, nombre: editCategoria.nombre } : categoria
        )
      );
      setEditCategoria(null);
      setSuccess('Categoría actualizada correctamente.');
    } catch (error) {
      setError('Hubo un error al actualizar la categoría.');
    }
  };

  const handleDeleteCategoria = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categorias/categorias/${id}`);
      setCategorias((prevCategorias) => prevCategorias.filter((categoria) => categoria.id !== id));
      setSuccess('Categoría eliminada correctamente.');
    } catch (error) {
      setError('Hubo un error al eliminar la categoría.');
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Seleccionar Disciplinas y Categorías
      </Typography>

      {/* Botones de Seleccionar Todo */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button onClick={handleSelectAllTorneos} variant="contained" color="primary" fullWidth>
            {selectedTorneos.length === torneos.length ? 'Desmarcar Todos los Torneos' : 'Seleccionar Todos los Torneos'}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button onClick={handleSelectAllCategorias} variant="contained" color="secondary" fullWidth>
            {selectedCategorias.length === categorias.length ? 'Desmarcar Todas las Categorías' : 'Seleccionar Todas las Categorías'}
          </Button>
        </Grid>
      </Grid>

      {/* Torneos */}
      <Box sx={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
        <Typography variant="h6">Torneos</Typography>
        <Grid container spacing={2}>
          {torneos.map((torneo) => (
            <Grid item xs={12} sm={4} key={torneo.id}>
              <Card variant="outlined">
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedTorneos.includes(torneo.id)}
                        onChange={(e) => handleTorneoCheckboxChange(e, torneo.id)}
                      />
                    }
                    label={<Typography variant="h6">{torneo.nombre}</Typography>}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Categorías */}
      <Box sx={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
        <Typography variant="h6">Categorías</Typography>
        <Grid container spacing={2}>
          {categorias.map((categoria) => (
            <Grid item xs={12} sm={4} key={categoria.id}>
              <Card variant="outlined">
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategorias.includes(categoria.id)}
                        onChange={(e) => handleCategoriaCheckboxChange(e, categoria.id)}
                      />
                    }
                    label={<Typography variant="h6">{categoria.nombre}</Typography>}
                  />
                  <Button onClick={() => handleDeleteCategoria(categoria.id)} color="error" fullWidth>
                    Eliminar
                  </Button>
                  <Button onClick={() => setEditCategoria(categoria)} color="primary" fullWidth>
                    Editar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Crear Nueva Categoría */}
      <TextField
        label="Nueva Categoría"
        variant="outlined"
        value={newCategoria}
        onChange={(e) => setNewCategoria(e.target.value)}
        fullWidth
        sx={{ marginTop: '20px' }}
      />
      <Button onClick={handleCreateCategoria} variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
        Crear Categoría
      </Button>

      {/* Editar Categoría */}
      {editCategoria && (
        <Box sx={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <TextField
            label="Editar Categoría"
            variant="outlined"
            value={editCategoria.nombre}
            onChange={(e) => setEditCategoria({ ...editCategoria, nombre: e.target.value })}
            fullWidth
          />
          <Button onClick={handleEditCategoria} variant="contained" color="secondary" fullWidth sx={{ marginTop: '10px' }}>
            Actualizar Categoría
          </Button>
        </Box>
      )}

      {/* Botón para enviar la selección */}
      <Button
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ marginTop: '20px' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Agregar Categorías a torneos'}
      </Button>

      {/* Mensajes de error o éxito */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || success}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default SeleccionarTorneosYCategorias;
