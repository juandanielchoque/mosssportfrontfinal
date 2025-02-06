import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const Estadisticas = () => {
  const [stats, setStats] = useState({
    totalTorneos: 0,
    torneosPorEstado: [],
    torneosPorTipo: [],
    torneosFuturos: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/torneos/estadisticas');
        setStats(response.data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Estadísticas Generales
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total de Torneos</Typography>
              <Typography variant="h4">{stats.totalTorneos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Torneos Futuros</Typography>
              <Typography variant="h4">{stats.torneosFuturos}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Detalle por estado y tipo */}
      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h5">Torneos por Estado</Typography>
        <Grid container spacing={2}>
          {stats.torneosPorEstado.map((estado) => (
            <Grid item xs={12} md={3} key={estado.estado}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{estado.estado}</Typography>
                  <Typography variant="h4">{estado.cantidad}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h5">Torneos por Tipo</Typography>
        <Grid container spacing={2}>
          {stats.torneosPorTipo.map((tipo) => (
            <Grid item xs={12} md={3} key={tipo.tipo}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{tipo.tipo}</Typography>
                  <Typography variant="h4">{tipo.cantidad}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Estadisticas;
