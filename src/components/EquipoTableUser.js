import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const EquipoTable = ({ equipos, onAgregarJugador, onVerJugadores, onEliminarEquipo }) => {
  // Estado para manejar el diálogo de confirmación
  const [openDialog, setOpenDialog] = useState(false);
  const [equipoAEliminar, setEquipoAEliminar] = useState(null);
  

  // Función para abrir el diálogo de confirmación
  const handleOpenDialog = (equipoId) => {
    setEquipoAEliminar(equipoId);
    setOpenDialog(true);
  };

  // Función para cerrar el diálogo sin hacer nada
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEquipoAEliminar(null);
  };

  // Función para confirmar la eliminación
  const handleConfirmarEliminacion = () => {
    if (equipoAEliminar !== null) {
      onEliminarEquipo(equipoAEliminar);  // Llama a la función de eliminación
    }
    handleCloseDialog();
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: '80%' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center"><strong>Nombre del Equipo</strong></TableCell>
              <TableCell align="center"><strong>Nombre del Capitán</strong></TableCell>
              <TableCell align="center"><strong>Nombre del Torneo</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipos.map((equipo) => (
              <TableRow key={equipo.equipo_id}>
                <TableCell align="center">{equipo.nombre_equipo}</TableCell>
                <TableCell align="center">{equipo.nombre_capitan ? equipo.nombre_capitan : 'No asignado'}</TableCell>
                <TableCell align="center">{equipo.nombre_torneo}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" color="primary" onClick={() => onAgregarJugador(equipo)} sx={{ marginRight: 1 }}>
                    Agregar Jugador
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => onVerJugadores(equipo.equipo_id)} sx={{ marginRight: 1 }}>
                    Ver Jugadores
                  </Button>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que quieres eliminar este equipo? Esta acción no se puede deshacer.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmarEliminacion} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EquipoTable;
