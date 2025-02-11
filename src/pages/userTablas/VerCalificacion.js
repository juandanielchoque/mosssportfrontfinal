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
    Button,
    styled,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import puntajesService from '../../services/puntajeServices';

// Estilos de componentes
const StyledContainer = styled(Container)({
    backgroundColor: '#111',
    color: '#eee',
    minHeight: '100vh',
    padding: '32px',
});

const StyledTypography = styled(Typography)({
    color: '#eee',
    marginBottom: '16px',
});

const StyledButton = styled(Button)({
    backgroundColor: '#00bcd4',
    color: '#111',
    marginBottom: '16px',
    '&:hover': {
        backgroundColor: '#00acc1',
    },
});

const StyledTableContainer = styled(TableContainer)({
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    overflowX: 'auto',
});

const StyledTableHead = styled(TableHead)({
    '& .MuiTableCell-root': {
        fontWeight: 'bold',
        backgroundColor: '#222',
        color: '#eee',
    },
});

const StyledTableCell = styled(TableCell)({
    color: '#eee',
    borderBottom: '1px solid #333',
});

const LoadingContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#111',
});

const ErrorContainer = styled(Container)({
    textAlign: 'center',
    marginTop: '32px',
});

const ErrorTypography = styled(Typography)({
    color: '#f44336',
});

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
                
                const puntajesBase = data.map(item => ({
                    disciplina: item.disciplina,
                    puntajes: posiciones.map((_, index) => {
                        const basePuntaje = parseInt(item.puntaje_primer_puesto);
                        const decremento = decrementosPorPosicion[item.disciplina]?.[index] || 0;
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
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <ErrorTypography variant="h6">
                    {error}
                </ErrorTypography>
            </ErrorContainer>
        );
    }

    return (
        <StyledContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <StyledTypography variant="h4">
                    Detalle del puntaje por disciplina
                </StyledTypography>
                <StyledButton variant="contained" onClick={() => navigate(-1)}>
                    ← Volver Atrás
                </StyledButton>
            </Box>

            <StyledTableContainer component={Paper}>
                <Table>
                    <StyledTableHead>
                        <TableRow>
                            <StyledTableCell>UBICACIÓN</StyledTableCell>
                            {puntajes.map((item, idx) => (
                                <StyledTableCell key={idx} align="center">
                                    {item.disciplina}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {posiciones.map((posicion, rowIndex) => (
                            <TableRow key={rowIndex}>
                                <StyledTableCell>{posicion}</StyledTableCell>
                                {puntajes.map((item, colIndex) => (
                                    <StyledTableCell key={colIndex} align="center">
                                        {item.puntajes[rowIndex]}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </StyledContainer>
    );
};

export default PuntajesTabla;
