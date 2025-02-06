import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Grid, CircularProgress } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TablaDeportes from './TablaDeportes';
import { obtenerDisciplinas } from '../../services/disciplinasServices';
import { obtenerCategoriasPorDisciplina } from '../../services/disciplinaCategoriaServices';
import { obtenerEquipos } from '../../services/estadisticaServices';

const VerEstadisticas = () => {
    const [categorias, setCategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [selectedDisciplina, setSelectedDisciplina] = useState(null);
    const [todosLosEquipos, setTodosLosEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriasMap = new Map();

                const [disciplinasData, equiposResponse] = await Promise.all([
                    obtenerDisciplinas(),
                    obtenerEquipos()
                ]);

                const equiposArray = Array.isArray(equiposResponse) ? equiposResponse : [];

                // Asociar disciplinas con categorías
                for (const disciplina of disciplinasData) {
                    try {
                        const categoriasAsociadas = await obtenerCategoriasPorDisciplina(disciplina.id);
                        categoriasAsociadas.forEach(categoria => {
                            if (!categoriasMap.has(categoria.id)) {
                                categoriasMap.set(categoria.id, { 
                                    ...categoria, 
                                    disciplinas: [], 
                                });
                            }
                            categoriasMap.get(categoria.id).disciplinas.push(disciplina);
                        });
                    } catch (categoriaError) {
                        console.error(`Error al obtener categorías para disciplina ${disciplina.id}:`, categoriaError);
                    }
                }

                setCategorias(Array.from(categoriasMap.values()));
                setTodosLosEquipos(equiposArray);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCategoriaClick = (categoria) => {
        setSelectedCategoria(categoria);
        setSelectedDisciplina(null);
    };

    const handleDisciplinaClick = (disciplina) => {
        setSelectedDisciplina(disciplina);
    };

    const handleBackClick = () => {
        if (selectedDisciplina) {
            setSelectedDisciplina(null);
        } else if (selectedCategoria) {
            setSelectedCategoria(null);
        } else {
            window.history.back();
        }
    };

    const equiposFiltrados = todosLosEquipos.filter(equipo => 
        selectedCategoria && equipo.categoria_id === selectedCategoria.id
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        Error: {error}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Reintentar
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">
                    {selectedDisciplina 
                        ? `${selectedCategoria.nombre} - ${selectedDisciplina.nombre}`
                        : selectedCategoria
                            ? selectedCategoria.nombre
                            : 'Estadísticas'
                    }
                </Typography>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackClick}>
                    Retroceder
                </Button>
            </Box>

            {selectedDisciplina ? (
                    <TablaDeportes 
                    categoria={selectedCategoria} 
                    disciplina={selectedDisciplina}
                    equipos={equiposFiltrados}
                />
            ) : selectedCategoria ? (
                <Grid container spacing={2}>
                    {selectedCategoria.disciplinas.map((disciplina) => (
                        <Grid item xs={12} sm={6} md={4} key={disciplina.id}>
                            <Box onClick={() => handleDisciplinaClick(disciplina)} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, cursor: 'pointer' }}>
                                <Typography variant="h6">{disciplina.nombre}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {categorias.map((categoria) => (
                        <Grid item xs={12} sm={6} md={4} key={categoria.id}>
                            <Box onClick={() => handleCategoriaClick(categoria)} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, cursor: 'pointer' }}>
                                <Typography variant="h6">{categoria.nombre}</Typography>
                                <Typography variant="body2">
                                    Disciplinas disponibles: {categoria.disciplinas.length}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default VerEstadisticas;
