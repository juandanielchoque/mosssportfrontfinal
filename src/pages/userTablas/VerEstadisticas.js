import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Grid, CircularProgress, styled } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TablaDeportes from './TablaDeportes';
import { obtenerDisciplinas } from '../../services/disciplinasServices';
import { obtenerCategoriasPorDisciplina } from '../../services/disciplinaCategoriaServices';
import { obtenerEquipos } from '../../services/estadisticaServices';

// Estilos de componentes
const StyledContainer = styled(Container)(({ theme }) => ({
    backgroundColor: '#111',
    color: '#eee',
    minHeight: '100vh',
    padding: theme.spacing(4),
}));

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0px 0px 10px rgba(0, 188, 212, 0.3)',
    },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: '#eee',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#00bcd4',
    color: '#111',
    '&:hover': {
        backgroundColor: '#00acc1',
    },
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#111',
}));

const ErrorContainer = styled(Container)(({ theme }) => ({
    textAlign: 'center',
    marginTop: theme.spacing(4),
}));

const ErrorTypography = styled(Typography)(({ theme }) => ({
    color: '#f44336',
}));

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

    return (
        <StyledContainer maxWidth="xl">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <StyledTypography variant="h4">
                    {selectedDisciplina
                        ? `${selectedCategoria.nombre} - ${selectedDisciplina.nombre}`
                        : selectedCategoria
                            ? selectedCategoria.nombre
                            : 'Estadísticas'}
                </StyledTypography>
                <StyledButton variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackClick}>
                    Retroceder
                </StyledButton>
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
                        <StyledGridItem item xs={12} sm={6} md={4} key={disciplina.id}>
                            <StyledBox onClick={() => handleDisciplinaClick(disciplina)}>
                                <StyledTypography variant="h6">{disciplina.nombre}</StyledTypography>
                            </StyledBox>
                        </StyledGridItem>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {categorias.map((categoria) => (
                        <StyledGridItem item xs={12} sm={6} md={4} key={categoria.id}>
                            <StyledBox onClick={() => handleCategoriaClick(categoria)}>
                                <StyledTypography variant="h6">{categoria.nombre}</StyledTypography>
                                <StyledTypography variant="body2">
                                    Disciplinas disponibles: {categoria.disciplinas.length}
                                </StyledTypography>
                            </StyledBox>
                        </StyledGridItem>
                    ))}
                </Grid>
            )}

            {loading && (
                <LoadingContainer>
                    <CircularProgress />
                </LoadingContainer>
            )}

            {error && (
                <ErrorContainer maxWidth="xl">
                    <ErrorTypography variant="h6" color="error">
                        Error: {error}
                    </ErrorTypography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Reintentar
                    </Button>
                </ErrorContainer>
            )}
        </StyledContainer>
    );
};

export default VerEstadisticas;