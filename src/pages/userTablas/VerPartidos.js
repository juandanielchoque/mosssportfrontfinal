import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TablaColectivos from '../../components/TablasDisciplina/TablaColectivos';
import TablaIndividuales from '../../components/TablasDisciplina/TablaIndividuales';
import { obtenerEquipos } from '../../services/equipoServices';

const VerPartidos = () => {
  // Estados principales
  const [partidos, setPartidos] = useState([]);
  const [competenciasIndividuales, setCompetenciasIndividuales] = useState([]);
  const [competenciaEquipos, setCompetenciaEquipos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [filtroTorneo, setFiltroTorneo] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log('🔄 Iniciando carga de datos...');
      try {
        const [
          equiposRes,
          partidosRes,
          competenciasRes,
          competenciaEquiposRes,
          torneosRes,
          disciplinasRes,
          categoriasRes,
        ] = await Promise.all([
          obtenerEquipos(),
          fetch("https://mosssportfinal-production.up.railway.app/partidos").then((res) => res.json()),
          fetch("https://mosssportfinal-production.up.railway.app/competicion").then((res) => res.json()),
          fetch("https://mosssportfinal-production.up.railway.app/competicion/resultados").then((res) => res.json()),
          fetch("https://mosssportfinal-production.up.railway.app/torneos").then((res) => res.json()),
          fetch("https://mosssportfinal-production.up.railway.app/disciplinas").then((res) => res.json()),
          fetch("https://mosssportfinal-production.up.railway.app/categorias").then((res) => res.json()),
        ]);

        console.log('✅ Datos cargados exitosamente:', {
          equipos: equiposRes?.data?.length,
          partidos: partidosRes?.data?.length,
          competencias: competenciasRes?.data?.length,
          competenciaEquipos: competenciaEquiposRes?.data?.length,
          torneos: torneosRes?.data?.length,
          disciplinas: disciplinasRes?.data?.length,
          categorias: categoriasRes?.data?.length,
        });

        setEquipos(equiposRes?.data || []);
        setPartidos(partidosRes?.data || []);
        setCompetenciasIndividuales(competenciasRes?.data || []);
        setCompetenciaEquipos(competenciaEquiposRes?.data || []);
        setTorneos(torneosRes?.data || []);
        setDisciplinas(disciplinasRes?.data || []);
        setCategorias(categoriasRes?.data || []);
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isDisciplinaIndividual = (disciplinaId) => {
    const disciplina = disciplinas.find(d => d.id === parseInt(disciplinaId));
    return disciplina?.tipo === 'individual';
  };

  const handleTorneoChange = (event) => {
    const value = event.target.value;
    setFiltroTorneo(value);
  };

  const handleDisciplinaChange = (event) => {
    const value = event.target.value;
    setFiltroDisciplina(value);

    // Si la disciplina es individual, resetear el filtro de categoría
    if (isDisciplinaIndividual(value)) {
      setFiltroCategoria(""); // Resetear categoría si es individual
    } else {
      // Si la disciplina es colectiva, verificar si el valor actual de categoría es válido
      const categoriasFiltradas = getCategoriasFiltradas();
      if (!categoriasFiltradas.some(c => c.id === filtroCategoria)) {
        setFiltroCategoria(""); // Resetear si la categoría actual no es válida
      }
    }
  };

  const handleCategoriaChange = (event) => {
    const value = event.target.value;
    setFiltroCategoria(value);
  };

  const getDisciplinasFiltradas = () => {
    if (!filtroTorneo) return disciplinas;

    const disciplinasEnPartidos = partidos
      .filter(p => p.torneo_id === parseInt(filtroTorneo))
      .map(p => p.disciplina_id);

    const disciplinasEnCompetencias = competenciasIndividuales
      .filter(c => c.torneo_id === parseInt(filtroTorneo))
      .map(c => c.disciplina_id);

    const disciplinasUsadas = [...new Set([...disciplinasEnPartidos, ...disciplinasEnCompetencias])];

    return disciplinas.filter(d => disciplinasUsadas.includes(d.id));
  };

  const getCategoriasFiltradas = () => {
    return categorias.filter(categoria => {
      const torneoMatch = !filtroTorneo || partidos.some(partido => partido.torneo_id === parseInt(filtroTorneo) && partido.categoria_id === categoria.id);
      const disciplinaMatch = !filtroDisciplina || partidos.some(partido => partido.disciplina_id === parseInt(filtroDisciplina) && partido.categoria_id === categoria.id);
      return torneoMatch && disciplinaMatch;
    });
  };

  const renderContenido = () => {
    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    if (!filtroDisciplina) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Seleccione una disciplina para ver los resultados
          </Typography>
        </Box>
      );
    }

    if (isDisciplinaIndividual(filtroDisciplina)) {
      return (
        <TablaIndividuales
          competencias={competenciasIndividuales}
          competenciaEquipos={competenciaEquipos}
          equipos={equipos}
          disciplinas={disciplinas}
          filtroTorneo={filtroTorneo}
          filtroDisciplina={filtroDisciplina}
        />
      );
    }

    return (
      <TablaColectivos
        partidos={partidos}
        equipos={equipos}
        disciplinas={disciplinas}
        categorias={categorias}
        filtroTorneo={filtroTorneo}
        filtroDisciplina={filtroDisciplina}
        filtroCategoria={filtroCategoria}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Partidos y Competencias</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
        >
          Retroceder
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros de búsqueda
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Torneos</InputLabel>
              <Select
                value={filtroTorneo}
                label="Torneos"
                onChange={handleTorneoChange}
              >
                <MenuItem value="">Todos los torneos</MenuItem>
                {torneos.map((torneo) => (
                  <MenuItem key={torneo.id} value={torneo.id}>
                    {torneo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Disciplinas</InputLabel>
              <Select
                value={filtroDisciplina}
                label="Disciplinas"
                onChange={handleDisciplinaChange}
              >
                <MenuItem value="">Todas las disciplinas</MenuItem>
                {getDisciplinasFiltradas().map((disciplina) => (
                  <MenuItem key={disciplina.id} value={disciplina.id}>
                    {disciplina.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Categorías</InputLabel>
              <Select
                value={filtroCategoria}
                label="Categorías"
                onChange={handleCategoriaChange}
                disabled={isDisciplinaIndividual(filtroDisciplina)} // Deshabilitar si es individual
              >
                <MenuItem value="">Todas las categorías</MenuItem>
                {getCategoriasFiltradas().map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {renderContenido()}
    </Container>
  );
};

export default VerPartidos;
