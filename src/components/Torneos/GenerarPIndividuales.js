import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import partidoServices from '../../services/partidoServices'; 

const GenerarPIndividuales = ({ open, onClose, equipos, onGenerar }) => {
  const [competenciasGeneradas, setCompetenciasGeneradas] = useState([]);
  const [error, setError] = useState('');
  const [disciplinasIndividuales, setDisciplinasIndividuales] = useState([]);
  const [categoriasPorDisciplina, setCategoriasPorDisciplina] = useState({});

  // Cargar disciplinas y categorías al abrir el modal
  useEffect(() => {
    const cargarDisciplinasYCategorias = async () => {
      try {
        // Obtener todas las disciplinas
        const disciplinas = await partidoServices.obtenerDisciplinas();
        // Filtrar solo las disciplinas individuales
        const individuales = disciplinas.filter(disc => disc.tipo === 'individual');
        setDisciplinasIndividuales(individuales);

        // Obtener categorías por disciplina
        const categoriasPromises = individuales.map(disciplina => 
          partidoServices.obtenerDisciplinaCategorias(disciplina.id)
        );
        const categoriasData = await Promise.all(categoriasPromises);

        // Mapear categorías por disciplina
        const mapeoCategorias = {};
        individuales.forEach((disciplina, index) => {
          mapeoCategorias[disciplina.id] = categoriasData[index];
        });
        setCategoriasPorDisciplina(mapeoCategorias);
      } catch (error) {
        console.error('Error al cargar disciplinas y categorías:', error);
        setError('Error al cargar datos.');
      }
    };

    if (open) {
      cargarDisciplinasYCategorias();
    }
  }, [open]);

  // Calcular el total de categorías únicas
  const totalCategorias = new Set(Object.values(categoriasPorDisciplina).flat().map(cat => cat.id)).size;

  // Generar competencias individuales
  const generarCompetencias = () => {
    setError('');
    try {
      const nuevasCompetencias = [];

      disciplinasIndividuales.forEach(disciplina => {
        // Obtener todos los equipos asociados a la disciplina (de todas las categorías)
        const equiposDisciplina = equipos.filter(equipo =>
          categoriasPorDisciplina[disciplina.id]?.some(
            categoria => categoria.id === equipo.categoria_id
          )
        );

        if (equiposDisciplina.length > 0) {
          // Crear la competencia
          const competencia = {
            torneo_id: equiposDisciplina[0].torneo_id, // Tomar el torneo_id del primer equipo
            disciplina_id: disciplina.id,
            fecha_hora: new Date().toISOString(), // Fecha y hora actual
            lugar: 'Estadio Principal', // Lugar predeterminado
            estado: 'programado', // Estado inicial
            arbitro: null, // Árbitro inicialmente null
            equipos: equiposDisciplina, // Todos los equipos de la disciplina
          };

          nuevasCompetencias.push(competencia);
        }
      });

      setCompetenciasGeneradas(nuevasCompetencias);
    } catch (err) {
      setError('Error al generar competencias.');
      console.error('Error al generar competencias:', err);
    }
  };

  // Enviar competencias al backend
  const handleEnviar = async () => {
    if (competenciasGeneradas.length === 0) {
      setError('No hay competencias generadas para enviar.');
      return;
    }
    try {
      // Guardar las competencias en la base de datos
      const promesasCompetencias = competenciasGeneradas.map(competencia => {
        const competenciaData = {
          torneo_id: competencia.torneo_id,
          disciplina_id: competencia.disciplina_id,
          fecha_hora: competencia.fecha_hora,
          lugar: competencia.lugar,
          estado: competencia.estado,
          arbitro: competencia.arbitro,
          equipos: competencia.equipos.map(equipo => equipo.id),
        };
  
        return partidoServices.crearCompetenciaIndividual(competenciaData);
      });
  
      await Promise.all(promesasCompetencias);
      onGenerar(competenciasGeneradas); 
      onClose(); 
    } catch (error) {
      setError('Error al guardar las competencias.');
      console.error('Error al guardar las competencias:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '80%', 
        maxHeight: '90vh', 
        bgcolor: 'background.paper', 
        boxShadow: 24, 
        p: 4, 
        borderRadius: 2, 
        overflow: 'auto' 
      }}>
        <Typography variant="h6" gutterBottom>
          Generación Automática de Competencias Individuales
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Total de disciplinas: {disciplinasIndividuales.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total de categorías únicas: {totalCategorias}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Competencias a generar: {disciplinasIndividuales.length}
          </Typography>
        </Box>

        <Box mb={3} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={generarCompetencias}>
            Generar Competencias
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleEnviar}
            disabled={competenciasGeneradas.length === 0}
          >
            Confirmar y Enviar
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancelar
          </Button>
        </Box>

        {competenciasGeneradas.length > 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Disciplina</TableCell>
                  <TableCell>Equipos</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {competenciasGeneradas.map((competencia, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {disciplinasIndividuales.find(d => d.id === competencia.disciplina_id)?.nombre}
                    </TableCell>
                    <TableCell>
                      {competencia.equipos.map(equipo => equipo.nombre).join(', ')}
                    </TableCell>
                    <TableCell>
                      {new Date(competencia.fecha_hora).toLocaleString()}
                    </TableCell>
                    <TableCell>{competencia.estado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Modal>
  );
};

export default GenerarPIndividuales;