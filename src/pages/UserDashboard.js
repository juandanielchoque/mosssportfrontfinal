import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import { obtenerEquipoPorCapitán } from "../services/jugadorServices";
import JugadoresDialog from "../components/JugadoresDialog";
import AgregarJugadorDialog from "../components/AgregarJugadorDialog";
import useNotification from "../hooks/useNotification";
import Notification from "../components/notification";

const UserDashboard = () => {
  const [equipo, setEquipo] = useState(null);
  const [capitanNombre, setCapitanNombre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [openAgregarJugadorDialog, setOpenAgregarJugadorDialog] = useState(false);
  const [openVerJugadoresDialog, setOpenVerJugadoresDialog] = useState(false);
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    // Obtener nombre del capitán del token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setCapitanNombre(tokenData.nombre.charAt(0).toUpperCase() + tokenData.nombre.slice(1));
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }

    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const equipoData = await obtenerEquipoPorCapitán();
        if (equipoData) {
          setEquipo(equipoData);
        } else {
          showNotification(
            "No se encontró un equipo asociado a tu cuenta.",
            "info"
          );
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        showNotification(
          error.message || "Error al cargar los datos del equipo.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleOpenAgregarJugadorDialog = () => setOpenAgregarJugadorDialog(true);
  const handleCloseAgregarJugadorDialog = () => setOpenAgregarJugadorDialog(false);
  const handleOpenVerJugadoresDialog = () => setOpenVerJugadoresDialog(true);
  const handleCloseVerJugadoresDialog = () => setOpenVerJugadoresDialog(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("capitanId");
    window.location.href = "/login";
  };

  const getImageUrl = (logoData) => {
    if (!logoData || !logoData.data) return null;
    const uint8Array = new Uint8Array(logoData.data);
    const blob = new Blob([uint8Array], { type: 'image/png' });
    return URL.createObjectURL(blob);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, bgcolor: "primary.main", color: "white" }}
      >
        <Typography variant="h4" gutterBottom>
          ¡Bienvenido, Capitán {capitanNombre}!
        </Typography>
        <Typography variant="h6">
          "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es
          el valor para continuar." – Winston Churchill
        </Typography>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : equipo ? (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              {equipo.logo ? (
                <Box
                  component="img"
                  src={getImageUrl(equipo.logo)}
                  alt={`Logo de ${equipo.nombre}`}
                  sx={{
                    width: 150,
                    height: 150,
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    bgcolor: "primary.main" 
                  }}
                >
                  <GroupIcon sx={{ fontSize: 80 }} />
                </Avatar>
              )}
              <Box>
                <Typography variant="h4" gutterBottom>
                  {equipo.nombre}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {equipo.categoria_nombre} - {equipo.disciplina_nombre}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Capitán: {capitanNombre}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" color="error">
          No se encontró información del equipo.
        </Typography>
      )}

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Acciones Rápidas
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenAgregarJugadorDialog}
          sx={{ py: 2 }}
        >
          Agregar Jugador
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<GroupIcon />}
          onClick={handleOpenVerJugadoresDialog}
          sx={{ py: 2 }}
        >
          Ver Jugadores
        </Button>
      </Box>

      <AgregarJugadorDialog
        open={openAgregarJugadorDialog}
        onClose={handleCloseAgregarJugadorDialog}
        equipoId={equipo?.id}
      />

      <JugadoresDialog
        open={openVerJugadoresDialog}
        onClose={handleCloseVerJugadoresDialog}
        equipoId={equipo?.id}
      />

      <Notification notification={notification} onClose={closeNotification} />
    </Box>
  );
};

export default UserDashboard;