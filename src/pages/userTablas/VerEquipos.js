import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  Button
} from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { obtenerEquipos } from '../../services/equipoServices';
import JugadoresDialog from '../../components/VerJugadoresDialog';

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
        
        const categoriasUnicas = [
          ...new Set(equiposRes.data.map(equipo => equipo.categoria_nombre))
        ];
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
    if (!logoBase64) {
      return <Avatar sx={{ width: 50, height: 50, borderRadius: 0 }}>N/A</Avatar>;
    }

    try {
      return (
        <Avatar
          src={`data:image/jpeg;base64,${logoBase64}`}
          alt="Logo del equipo"
          sx={{ width: 50, height: 50, borderRadius: 0 }}
          onError={(e) => {
            console.error('Error al cargar la imagen');
            e.target.src = '';
            e.target.onerror = null;
          }}
        />
      );
    } catch (error) {
      console.error('Error al renderizar logo:', error);
      return <Avatar sx={{ width: 50, height: 50, borderRadius: 0 }}>E</Avatar>;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Equipos</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
        >
          Retroceder
        </Button>
      </Box>

      {categorias.map(categoria => (
        <Box key={categoria} display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <Paper elevation={3} sx={{ p: 2, minWidth: 200, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" align="center">{categoria}</Typography>
            <Avatar 
              src={`ruta_a_imagen_de_categoria/${categoria}`} 
              alt={`Imagen de ${categoria}`}
              sx={{ width: 100, height: 100, mt: 2, borderRadius: 0 }}
            />
          </Paper>
          <Grid container spacing={2}>
            {equipos
              .filter(equipo => equipo.categoria_nombre === categoria)
              .map(equipo => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={equipo.id}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid #ddd', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                    onClick={() => handleEquipoClick(equipo)}
                  >
                    {renderLogo(equipo.logo)}
                    <Typography variant="body1">{equipo.nombre}</Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}

      {/* Dialog para ver jugadores */}
      <JugadoresDialog
        open={openJugadoresDialog}
        onClose={handleCloseJugadoresDialog}
        equipoId={selectedEquipo?.id}
      />
    </Container>
  );
};

export default VerEquipos;