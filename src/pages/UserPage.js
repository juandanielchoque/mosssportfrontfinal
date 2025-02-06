import React from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.webp';
const UserPage = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <Container sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '20%', backgroundColor: '#f0f0f0', padding: 2 }}>
        <Typography variant="h6" gutterBottom>MENU</Typography>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mb: 2, borderRadius: '20px' }}
          onClick={() => handleRedirect('/tablaGeneral')}
        >
          Resultado General
        </Button>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mb: 2, borderRadius: '20px' }}
          onClick={() => handleRedirect('/tablaEstadisticas')}
        >
          Estadisticas
        </Button>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mb: 2, borderRadius: '20px' }}
          onClick={() => handleRedirect('/tablaCalificacion')}
        >
          Calificación
        </Button>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mb: 2, borderRadius: '20px' }}
          onClick={() => handleRedirect('/tablaEquipos')}
        >
          Equipos
        </Button>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mb: 2, borderRadius: '20px' }}
          onClick={() => handleRedirect('/tablaPartidos')}
        >
          Partidos
        </Button>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mb: 2, borderRadius: '20px' }}
          onClick={() => handleRedirect('/login')}
        >
          Puntuaciones
        </Button>

      </Box>
      <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" gutterBottom>CAMPEONATO COLEGIO de ING</Typography>
        <img src={logo} alt="Logo" style={{ marginTop: '20px' , width: '35%'}} />
      </Box>
    </Container>
  );
};

export default UserPage;
