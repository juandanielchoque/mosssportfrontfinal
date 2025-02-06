import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FiltrosTorneoEquipo = ({ torneos, equiposFiltrados, onTorneoChange }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Torneo</InputLabel>
      <Select onChange={(e) => onTorneoChange(e.target.value)}>
        {torneos.map((torneo) => (
          <MenuItem key={torneo.id} value={torneo.id}>
            {torneo.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FiltrosTorneoEquipo;
