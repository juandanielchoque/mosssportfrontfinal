// src/components/TablaPosiciones.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const TablaPosiciones = ({ posiciones }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, marginBottom: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: 2, paddingLeft: 2, color: '#1976d2' }}>
        Tabla de Posiciones
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de posiciones">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Equipo</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>PJ</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>G</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>E</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>P</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>GF</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>GC</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>DG</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Pts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posiciones.map((equipo, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                '&:hover': { backgroundColor: '#f1f1f1' },
              }}
            >
              <TableCell>{equipo.equipo}</TableCell>
              <TableCell align="center">{equipo.PJ}</TableCell>
              <TableCell align="center">{equipo.G}</TableCell>
              <TableCell align="center">{equipo.E}</TableCell>
              <TableCell align="center">{equipo.P}</TableCell>
              <TableCell align="center">{equipo.GF !== null ? equipo.GF : 0}</TableCell>
              <TableCell align="center">{equipo.GC !== null ? equipo.GC : 0}</TableCell>
              <TableCell align="center">{equipo.DG !== null ? equipo.DG : 0}</TableCell>
              <TableCell align="center">{equipo.Pts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaPosiciones;
