import React, { useEffect, useState } from 'react';
import { obtenerTorneos } from '../../services/torneoServices';
import { obtenerCategorias } from '../../services/categoriaServices';
import { obtenerDisciplinas } from '../../services/disciplinasServices';
import { obtenerEquipos } from '../../services/equipoServices';
import { obtenerCompetenciasIndividuales, obtenerResultadosEquipos } from '../../services/competicionServices';
import { obtenerPuntuacion } from '../../services/estadisticaServices';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import puntajesService from '../../services/puntajeServices';

// Estilos
const StyledBox = styled(Box)({
    backgroundColor: '#1a1a1a',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
    color: '#eee',
    marginTop: '16px',
});

const StyledTableContainer = styled(TableContainer)({
    backgroundColor: '#222',
    borderRadius: '8px',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
    overflowX: 'auto',
});

const StyledTableHead = styled(TableHead)({
    '& .MuiTableCell-root': {
        backgroundColor: '#333',
        color: '#eee',
        fontWeight: 'bold',
    },
});

const TablaGeneral = () => {
    const [torneos, setTorneos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [competencias, setCompetencias] = useState([]);
    const [puntuaciones, setPuntuaciones] = useState([]);
    const [decrementosPorPosicion, setDecrementosPorPosicion] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    torneosData,
                    categoriasData,
                    disciplinasData,
                    equiposData,
                    resultadosData,
                    competenciasData,
                    puntuacionesData,
                    puntajesConfigData
                ] = await Promise.all([
                    obtenerTorneos(),
                    obtenerCategorias(),
                    obtenerDisciplinas(),
                    obtenerEquipos(),
                    obtenerResultadosEquipos(),
                    obtenerCompetenciasIndividuales(),
                    obtenerPuntuacion(),
                    puntajesService.obtenerPuntajes()
                ]);

                setTorneos(torneosData || []);
                setCategorias(categoriasData || []);
                setDisciplinas(disciplinasData || []);
                setEquipos(equiposData.data || []);
                setResultados(resultadosData.data[0] || []);
                setCompetencias(competenciasData.data || []);
                setPuntuaciones(puntuacionesData || []);

                setDecrementosPorPosicion({
                    [puntajesConfigData?.[0]?.puntaje_primer_puesto]: [0, 2, 4, 5, 6, 7, 8, 9],
                    [puntajesConfigData?.[1]?.puntaje_primer_puesto]: [0, 4, 8, 10, 12, 14, 16, 18],
                    [puntajesConfigData?.[2]?.puntaje_primer_puesto]: [0, 6, 12, 15, 18, 21, 24, 27],
                    [puntajesConfigData?.[3]?.puntaje_primer_puesto]: [0, 3, 6, 7, 9, 10, 11, 13],
                });
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    const renderTableData = () => {
        if (!categorias.length || !equipos.length || !disciplinas.length) {
            return (
                <TableRow>
                    <TableCell colSpan={disciplinas.length + 3} align="center">
                        No hay datos disponibles
                    </TableCell>
                </TableRow>
            );
        }

        return categorias.map((categoria) => (
            <TableRow key={categoria.id}>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#333', color: '#fff' }}>
                    {categoria.nombre}
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <StyledBox>
            <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
                sx={{ mb: 3 }}
            >
                Retroceder
            </Button>

            {torneos.length > 0 && (
                <Typography variant="h4" align="center" gutterBottom>
                    {torneos[0].nombre}
                </Typography>
            )}

            <StyledTableContainer component={Paper}>
                <Table>
                    <StyledTableHead>
                        <TableRow>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Equipo</TableCell>
                            {disciplinas.map(disciplina => (
                                <TableCell key={disciplina.id} align="center">
                                    {disciplina.nombre}
                                </TableCell>
                            ))}
                            <TableCell>Puntaje Total</TableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>{renderTableData()}</TableBody>
                </Table>
            </StyledTableContainer>
        </StyledBox>
    );
};

export default TablaGeneral;
