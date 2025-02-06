import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import puntajesService from '../../services/puntajeServices';

const PuntajesComponent = () => {
  const [puntajes, setPuntajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Cargar puntajes actuales al montar el componente
  useEffect(() => {
    const fetchPuntajes = async () => {
      try {
        // Primero intentamos obtener los puntajes
        const data = await puntajesService.obtenerPuntajes();
        
        // Si la lista de puntajes está vacía, inicializar
        if (data.length === 0) {
          await puntajesService.inicializarPuntajes();
          // Volver a cargar los puntajes después de inicializar
          const inicializadosData = await puntajesService.obtenerPuntajes();
          setPuntajes(inicializadosData);
        } else {
          setPuntajes(data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los puntajes:', error.message);
        setSnackbar({
          open: true,
          message: 'Error al cargar los puntajes.',
          severity: 'error',
        });
        setLoading(false);
      }
    };
  
    fetchPuntajes();
  }, []);

  const handlePuntajeChange = (index, value) => {
    const updatedPuntajes = [...puntajes];
    updatedPuntajes[index].puntaje_primer_puesto = value; 
    setPuntajes(updatedPuntajes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar que todos los puntajes sean números válidos
      for (const puntaje of puntajes) {
        if (
          puntaje.puntaje_primer_puesto === '' ||
          isNaN(Number(puntaje.puntaje_primer_puesto))
        ) {
          throw new Error(`Todos los puntajes deben ser números válidos.`);
        }
      }

      // Llamar al servicio para guardar los puntajes actualizados
      await puntajesService.guardarPuntajes(
        puntajes.map(({ disciplina, puntaje_primer_puesto }) => ({
          disciplina,
          puntaje: puntaje_primer_puesto,
        }))
      );

      setSnackbar({
        open: true,
        message: 'Puntajes actualizados correctamente.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al guardar los puntajes:', error.message);
      setSnackbar({
        open: true,
        message: 'Error al guardar los puntajes.',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Cargando puntajes...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Registro de Puntajes por Disciplina
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {puntajes.map((item, index) => (
            <Grid item xs={12} md={6} key={item.disciplina}>
              <Typography variant="h6">{item.disciplina}</Typography>
              <TextField
                type="number"
                label="Puntaje"
                value={item.puntaje_primer_puesto || ''}
                onChange={(e) => handlePuntajeChange(index, e.target.value)}
                fullWidth
                required
              />
            </Grid>
          ))}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Guardar Puntajes
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PuntajesComponent;
