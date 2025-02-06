import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import partidoServices from '../services/partidoServices';
import useNotification from '../hooks/useNotification'; 
import Notification from '../components/notification'; 

const CrearPartido = ({
  open,
  onClose,
  onCreate,
  torneos,
  disciplinas,
  categorias,
  equipos,
  nuevoPartido,
  setNuevoPartido,
}) => {
  const [disciplinasFiltradas, setDisciplinasFiltradas] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

  const { notification, showNotification, closeNotification } = useNotification(); // Manejo de notificaciones

  // Cargar disciplinas según el torneo seleccionado
  useEffect(() => {
    const cargarDisciplinas = async () => {
      if (nuevoPartido.torneo_id) {
        try {
          const disciplinasData = await partidoServices.obtenerTorneoDisciplinas(nuevoPartido.torneo_id);
          setDisciplinasFiltradas(disciplinasData);
        } catch (error) {
          showNotification('Error al cargar las disciplinas.', 'error');
        }
      } else {
        setDisciplinasFiltradas([]);
      }
    };
  
    cargarDisciplinas();
  }, [nuevoPartido.torneo_id]); 

  // Cargar categorías según la disciplina seleccionada
  useEffect(() => {
    const cargarCategorias = async () => {
      if (nuevoPartido.disciplina_id) {
        try {
          const categoriasData = await partidoServices.obtenerDisciplinaCategorias(nuevoPartido.disciplina_id);
          setCategoriasFiltradas(categoriasData);
        } catch (error) {
          showNotification('Error al cargar las categorías.', 'error');
        }
      } else {
        setCategoriasFiltradas([]);
      }
    };

    cargarCategorias();
  }, [nuevoPartido.disciplina_id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoPartido((prev) => {
      const newState = { ...prev, [name]: value };
      switch (name) {
        case 'torneo_id':
          return { ...newState, disciplina_id: '', categoria_id: '', equipo1_id: '', equipo2_id: '' };
        case 'disciplina_id':
          return { ...newState, categoria_id: '', equipo1_id: '', equipo2_id: '' };
        case 'categoria_id':
          return { ...newState, equipo1_id: '', equipo2_id: '' };
        default:
          return newState;
      }
    });
  };

  // Manejar la creación del partido
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nuevoPartido.torneo_id || !nuevoPartido.disciplina_id || !nuevoPartido.categoria_id || !nuevoPartido.equipo1_id || !nuevoPartido.equipo2_id) {
      showNotification('Todos los campos son obligatorios.', 'error');
      return;
    }

    const partidoConValoresPredeterminados = {
      ...nuevoPartido,
      goles_1: nuevoPartido.goles_1 || 0,
      goles_2: nuevoPartido.goles_2 || 0,
      estado: nuevoPartido.estado || 'programado',
    };

    try {
      onCreate(partidoConValoresPredeterminados);
      showNotification('Partido creado exitosamente.', 'success');
      onClose(); // Cerrar el diálogo
    } catch (error) {
      showNotification('Error al crear el partido. Intente nuevamente.', 'error');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Crear Partido</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Torneo"
              name="torneo_id"
              value={nuevoPartido.torneo_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {torneos.length > 0 ? (
                torneos.map((torneo) => (
                  <MenuItem key={torneo.id} value={torneo.id}>
                    {torneo.nombre}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay torneos disponibles</MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Disciplina"
              name="disciplina_id"
              value={nuevoPartido.disciplina_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!nuevoPartido.torneo_id}
            >
              {disciplinasFiltradas.length > 0 ? (
                disciplinasFiltradas.map((disciplina) => (
                  <MenuItem key={disciplina.id} value={disciplina.id}>
                    {disciplina.nombre}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay disciplinas disponibles</MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Categoría"
              name="categoria_id"
              value={nuevoPartido.categoria_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!nuevoPartido.disciplina_id}
            >
              {categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay categorías disponibles</MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Equipo 1"
              name="equipo1_id"
              value={nuevoPartido.equipo1_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!nuevoPartido.categoria_id}
            >
              {equipos
                .filter((equipo) => equipo.categoria_id === parseInt(nuevoPartido.categoria_id))
                .map((equipo) => (
                  <MenuItem key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              label="Equipo 2"
              name="equipo2_id"
              value={nuevoPartido.equipo2_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!nuevoPartido.categoria_id}
            >
              {equipos
                .filter((equipo) => equipo.categoria_id === parseInt(nuevoPartido.categoria_id))
                .map((equipo) => (
                  <MenuItem key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              label="Fecha y Hora"
              name="fecha_hora"
              type="datetime-local"
              value={nuevoPartido.fecha_hora}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Lugar"
              name="lugar"
              value={nuevoPartido.lugar}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Árbitro"
              name="arbitro"
              value={nuevoPartido.arbitro}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Crear
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Componente para mostrar notificaciones */}
      <Notification notification={notification} onClose={closeNotification} />
    </>
  );
};

export default CrearPartido;
