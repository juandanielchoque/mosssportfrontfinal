import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Avatar,
    CircularProgress,
    Button,
    styled
} from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { obtenerEquipos } from '../../services/equipoServices';
import JugadoresDialog from '../../components/VerJugadoresDialog';

// Estilos de componentes
const StyledContainer = styled(Container)({
    backgroundColor: '#111',
    color: '#eee',
    minHeight: '100vh',
    padding: '32px',
});

const StyledTypography = styled(Typography)({
    color: '#eee',
});

const StyledButton = styled(Button)({
    backgroundColor: '#00bcd4',
    color: '#111',
    '&:hover': {
        backgroundColor: '#00acc1',
    },
});

const StyledPaper = styled(Paper)({
    backgroundColor: '#1a1a1a',
    padding: '16px',
    minWidth: 200,
});

const StyledAvatar = styled(Avatar)({
    width: 50,
    height: 50,
    borderRadius: 0,
    backgroundColor: '#333',
});

const StyledCategoryAvatar = styled(Avatar)({
    width: 100,
    height: 100,
    borderRadius: 0,
    marginTop: '16px',
    backgroundColor: '#333',
});

const StyledTeamBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    border: '1px solid #333',
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    '&:hover': {
        backgroundColor: '#222',
        transform: 'translateY(-2px)',
    },
});

const LoadingContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#111',
});

const VerEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [openJugadoresDialog, setOpenJugadoresDialog] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const equiposRes = await obtenerEquipos();
                setEquipos(equiposRes.data || []);

                const categoriasUnicas = [...new Set(equiposRes.data.map(e => e.categoria_nombre))];
                setCategorias(categoriasUnicas);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEquipoClick = (equipo) => {
        setSelectedEquipo(equipo);
        setOpenJugadoresDialog(true);
    };

    const handleCloseJugadoresDialog = () => {
        setOpenJugadoresDialog(false);
        setSelectedEquipo(null);
    };

    const renderLogo = (logoBase64) => {
        if (!logoBase64) return <StyledAvatar>N/A</StyledAvatar>;
        return <StyledAvatar src={`data:image/jpeg;base64,${logoBase64}`} alt="Logo del equipo" onError={(e) => e.target.src = ''} />;
    };

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    return (
        <StyledContainer maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <StyledTypography variant="h4">Equipos</StyledTypography>
                <StyledButton variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
                    Retroceder
                </StyledButton>
            </Box>

            {categorias.map(categoria => (
                <Box key={categoria} display="flex" alignItems="center" gap={2} mb={3}>
                    <StyledPaper elevation={3}>
                        <StyledTypography variant="h6" align="center">{categoria}</StyledTypography>
                        <StyledCategoryAvatar src={`ruta_a_imagen_de_categoria/${categoria}`} alt={`Imagen de ${categoria}`} />
                    </StyledPaper>
                    <Grid container spacing={2}>
                        {equipos.filter(equipo => equipo.categoria_nombre === categoria).map(equipo => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={equipo.id}>
                                <StyledTeamBox onClick={() => handleEquipoClick(equipo)}>
                                    {renderLogo(equipo.logo)}
                                    <StyledTypography variant="body1">{equipo.nombre}</StyledTypography>
                                </StyledTeamBox>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}

            <JugadoresDialog open={openJugadoresDialog} onClose={handleCloseJugadoresDialog} equipoId={selectedEquipo?.id} />
        </StyledContainer>
    );
};

export default VerEquipos;
