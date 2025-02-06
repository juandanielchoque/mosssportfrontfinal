import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import puntajesService from '../../services/puntajeServices';

const PuntajesTabla = () => {
  const navigate = useNavigate();
  
  const posiciones = [
    '1er puesto', '2do puesto', '3er puesto', '4to puesto',
    '5to puesto', '6to puesto', '7mo puesto', '8vo puesto'
  ];

  const decrementosPorPosicion = {
    'INDIVIDUALES': [0, 2, 4, 5, 6, 7, 8, 9], 
    'COLECTIVOS': [0, 4, 8, 10, 12, 14, 16, 18], 
    'FULBITO Y BALONCESTO': [0, 6, 12, 15, 18, 21, 24, 27], 
    'TENIS DE MESA Y AJEDREZ': [0, 3, 6, 7, 9, 10, 11, 13] 
  };

  const [puntajes, setPuntajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPuntajes = async () => {
      try {
        
        const data = await puntajesService.obtenerPuntajes();

        if (!Array.isArray(data)) {
          throw new Error("❌ La API no devolvió un array de datos válido");
        }

        // Procesar los puntajes con decrementos variables
        const puntajesBase = data.map(item => ({
          disciplina: item.disciplina,
          puntajes: posiciones.map((_, index) => {
            const basePuntaje = parseInt(item.puntaje_primer_puesto);
            const decremento = decrementosPorPosicion[item.disciplina][index] || 0;
            return Math.max(basePuntaje - decremento, 0);
          })
        }));

        setPuntajes(puntajesBase);
      } catch (err) {
        console.error("❌ Error al obtener los puntajes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPuntajes();
  }, []);

  if (loading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" className="text-center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <Typography variant="h4" gutterBottom>
          Detalle del puntaje por disciplina
        </Typography>

        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          ← Volver Atrás
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">UBICACIÓN</TableCell>
              {puntajes.map((item, idx) => (
                <TableCell key={idx} align="center" className="font-bold">
                  {item.disciplina}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {posiciones.map((posicion, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{posicion}</TableCell>
                {puntajes.map((item, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    {item.puntajes[rowIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PuntajesTabla;