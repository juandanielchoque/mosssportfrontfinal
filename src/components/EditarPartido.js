import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import useNotification from '../hooks/useNotification'; // Hook de notificaciones
import Notification from '../components/notification'; // Componente para mostrar notificaciones

const EditarPartido = ({
  open,
  onClose,
  onSubmit,
  partido,
  equipos,
  disciplinas,
  categorias,
  torneos,
  handleChange,
}) => {
  const { notification, showNotification, closeNotification } = useNotification(); // Manejo de notificaciones

  if (!partido) return null;

  // Validación del formulario
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !partido.torneo_id ||
      !partido.disciplina_id ||
      !partido.categoria_id ||
      !partido.equipo1_id ||
      !partido.equipo2_id ||
      !partido.fecha_hora ||
      !partido.lugar
    ) {
      showNotification('Todos los campos obligatorios deben completarse.', 'error');
      return;
    }

    if (partido.equipo1_id === partido.equipo2_id) {
      showNotification('Los equipos no pueden ser iguales.', 'error');
      return;
    }

    // Llamar a la función de envío con los datos del partido
    try {
      onSubmit(partido);
      showNotification('Partido editado exitosamente.', 'success');
      onClose();
    } catch (error) {
      showNotification('Error al editar el partido. Intente nuevamente.', 'error');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Editar Partido</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              select
              label="Torneo"
              name="torneo_id"
              value={partido.torneo_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {torneos.map((torneo) => (
                <MenuItem key={torneo.id} value={torneo.id}>
                  {torneo.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Disciplina"
              name="disciplina_id"
              value={partido.disciplina_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {disciplinas.map((disciplina) => (
                <MenuItem key={disciplina.id} value={disciplina.id}>
                  {disciplina.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Categoría"
              name="categoria_id"
              value={partido.categoria_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Equipo 1"
              name="equipo1_id"
              value={partido.equipo1_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {equipos
                .filter((equipo) => equipo.categoria_id === parseInt(partido.categoria_id))
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
              value={partido.equipo2_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {equipos
                .filter((equipo) => equipo.categoria_id === parseInt(partido.categoria_id))
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
              value={partido.fecha_hora ? partido.fecha_hora.substring(0, 16) : ''}
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
              value={partido.lugar}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Árbitro"
              name="arbitro"
              value={partido.arbitro}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Goles Equipo 1"
              name="goles_1"
              type="number"
              value={partido.goles_1}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Goles Equipo 2"
              name="goles_2"
              type="number"
              value={partido.goles_2}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Guardar
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

export default EditarPartido;
