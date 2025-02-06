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

const GenerarPartidos = ({ open, onClose, equipos, onGenerar}) => {
  const [partidosGenerados, setPartidosGenerados] = useState([]);
  const [error, setError] = useState('');
  const [equiposPorCategoria, setEquiposPorCategoria] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]); 
  const [categoriasDisciplinas, setCategoriasDisciplinas] = useState({});

  // Función para agrupar equipos por categoría
  const agruparEquiposPorCategoria = (equipos) => {
    return equipos.reduce((acc, equipo) => {
      const categoriaId = equipo.categoria_id;
      if (!acc[categoriaId]) {
        acc[categoriaId] = [];
      }
      acc[categoriaId].push(equipo);
      return acc;
    }, {});
  };

  useEffect(() => {
    const cargarCategoriasYDisciplinas = async () => {
      try {

        if (!equipos || equipos.length === 0) {
          console.warn("No hay equipos para procesar");
          return;
        }

        // Obtener las disciplinas del torneo
        const torneoDisciplinas = await partidoServices.obtenerTorneoDisciplinas(equipos[0]?.torneo_id);
        if (!torneoDisciplinas || torneoDisciplinas.length === 0) {
          console.warn("No se encontraron disciplinas para el torneo");
          return;
        }

        setDisciplinas(torneoDisciplinas);

        // Obtener las categorías para cada disciplina
        const categoriasPromises = torneoDisciplinas.map((disciplina) =>
          partidoServices
            .obtenerDisciplinaCategorias(disciplina.id)
            .then((categorias) =>
              categorias.map((cat) => ({
                ...cat,
                disciplina_id: disciplina.id,
              }))
            )
        );

        const todasLasCategorias = await Promise.all(categoriasPromises);
        const categoriasData = todasLasCategorias.flat();

        // Revisar si ya se cargaron las categorías previamente para evitar ciclos
        if (JSON.stringify(categoriasData) === JSON.stringify(categorias)) {
          return;
        }

        // Mapear categorías a disciplinas
        const mapeoCategoriaDisciplina = categoriasData.reduce((acc, cat) => {
          acc[cat.id] = cat.disciplina_id;
          return acc;
        }, {});

        setCategoriasDisciplinas(mapeoCategoriaDisciplina);
        setCategorias(categoriasData);

      } catch (error) {
        console.error("Error al cargar las categorías y disciplinas:", error);
      }
    };

    // Solo cargar datos si hay equipos disponibles
    if (equipos.length > 0 && categorias.length === 0) {
      cargarCategoriasYDisciplinas();
    }
  }, [equipos, categorias]);

  useEffect(() => {
    if (equipos.length > 0) {
      const equiposAgrupados = agruparEquiposPorCategoria(equipos);
      setEquiposPorCategoria(equiposAgrupados);

    }
  }, [equipos]);

  const generarCombinaciones = () => {

    const todosLosPartidos = [];

    Object.entries(equiposPorCategoria).forEach(([categoriaId, equiposCategoria]) => {

      const equiposIds = equiposCategoria.map(equipo => equipo.id);
      const numEquipos = equiposIds.length;
      const esImpar = numEquipos % 2 !== 0;

      // Añadir equipo "fantasma" si es impar
      if (esImpar) {
        equiposIds.push(null);
      }

      const totalJornadas = esImpar ? numEquipos : numEquipos - 1;

      for (let jornada = 0; jornada < totalJornadas; jornada++) {
        const enfrentamientosJornada = [];
        const equiposUsadosJornada = new Set();

        // Generar combinaciones sin repetir equipos
        for (let i = 0; i < equiposIds.length; i += 2) {
          const equipoA = equiposIds[i];
          const equipoB = equiposIds[i + 1];

          // Si un equipo es null, se marca en descanso
          const estado = equipoA === null || equipoB === null ? 'descanso' : 'programado';

          // Obtener disciplinas de la categoría
          const disciplinasCategoria = disciplinas.filter(disciplina => 
            categorias.some(cat => 
              cat.id === parseInt(categoriaId) && 
              cat.disciplina_id === disciplina.id
               && disciplina.tipo === 'colectiva' 
            )
          );

          // Generar partidos para cada disciplina
          disciplinasCategoria.forEach(disciplina => {
            const partidoData = {
              categoria_id: parseInt(categoriaId),
              equipo1_id: equipoA, 
              equipo2_id: equipoB, 
              equipo1_nombre: equipoA ? equiposCategoria.find(e => e.id === equipoA)?.nombre : "Descanso",
              equipo2_nombre: equipoB ? equiposCategoria.find(e => e.id === equipoB)?.nombre : "Descanso",
              torneo_id: equiposCategoria[0].torneo_id,
              jornada: jornada + 1,
              disciplina_id: disciplina.id,
              disciplina_nombre: disciplina.nombre,
              fecha: null,
              estado: equipoA === null || equipoB === null ? 'descanso' : 'programado',
              resultado: null
            };

            todosLosPartidos.push({
              ...partidoData,
              id: `${partidoData.equipo1_id || 'descanso'}-${partidoData.equipo2_id || 'descanso'}-${disciplina.id}-j${partidoData.jornada}`
            });
          });
        }

        // Rotar equipos para siguiente jornada
        equiposIds.splice(1, 0, equiposIds.pop());
      }
    });

    // Ordenar partidos por jornada
    const partidosOrdenados = todosLosPartidos.sort((a, b) => 
      a.jornada - b.jornada || a.disciplina_id - b.disciplina_id
    );

    setPartidosGenerados(partidosOrdenados);
  };
  
  const handleEnviar = async () => {
  if (partidosGenerados.length === 0) {
    setError('No hay partidos generados para enviar.');
    return;
  }
  try {
    const promesasPartidos = partidosGenerados.map(partido => {
      const partidoData = {
        torneo_id: partido.torneo_id,
        disciplina_id: partido.disciplina_id,
        categoria_id: partido.categoria_id,
        equipo1_id: partido.equipo1_id,
        equipo2_id: partido.equipo2_id,
        fecha_hora: partido.fecha || null, 
        lugar: '', 
        estado: partido.estado || 'programado',
        goles_1: 0,
        goles_2: 0, 
        arbitro: '', 
        jornada: partido.jornada
      };

      return partidoServices.crearPartido(partidoData);
    });

    await Promise.all(promesasPartidos);

    // 🔹 Llamar a la función del padre para actualizar la vista
    onGenerar(partidosGenerados);

    onClose();
  } catch (error) {
    setError('Error al guardar los partidos generados.');
    console.error('Error al guardar los partidos generados:', error);
  }
};

  // Modificar el cálculo del total de partidos para incluir disciplinas
  const calcularTotalPartidos = () => {
    return Object.entries(equiposPorCategoria).reduce((total, [categoriaId, equiposCategoria]) => {
      const n = equiposCategoria.length;
      
      // Obtener disciplinas de la categoría
      const disciplinasCategoria = disciplinas.filter(disciplina => 
        categorias.some(cat => 
          cat.id === parseInt(categoriaId) && 
          cat.disciplina_id === disciplina.id &&
          disciplina.tipo === 'colectiva'
        )
      );
  
      // Calcular total de partidos
      const totalPartidosCategoria = n * disciplinasCategoria.length;
      
      return total + totalPartidosCategoria;
    }, 0);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="modal-generacion-partidos"
    >
      <Box
        sx={{
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
        }}
      >
        <Typography variant="h6" gutterBottom id="modal-generacion-partidos">
          Generación Automática de Partidos
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Total de equipos: {equipos.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Partidos a generar: {calcularTotalPartidos()}
          </Typography>
        </Box>

        <Box mb={3} display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={generarCombinaciones}
          >
            Generar Partidos
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleEnviar}
            disabled={partidosGenerados.length === 0}
          >
            Confirmar y Enviar
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={onClose}
          >
            Cancelar
          </Button>
        </Box>

        {partidosGenerados.length > 0 && (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Jornada</TableCell>
          <TableCell>Disciplina</TableCell>
          <TableCell>Categoría</TableCell>
          <TableCell>Equipo 1</TableCell>
          <TableCell></TableCell>
          <TableCell>Equipo 2</TableCell>
          <TableCell>Estado</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {partidosGenerados.map((partido) => (
          <TableRow key={partido.id}>
            <TableCell>{partido.jornada}</TableCell>
            <TableCell>
              {disciplinas.find(disc => disc.id === partido.disciplina_id)?.nombre || "Desconocida"}
            </TableCell>
            <TableCell>
              {categorias.find(cat => cat.id === partido.categoria_id)?.nombre || "Desconocida"}
            </TableCell>
            <TableCell>{partido.equipo1_nombre}</TableCell>
            <TableCell>VS</TableCell>
            <TableCell>{partido.equipo2_nombre}</TableCell>
            <TableCell>{partido.estado}</TableCell>
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

export default GenerarPartidos;