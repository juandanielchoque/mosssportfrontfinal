import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Button, Snackbar } from "@mui/material";
import competicionServices from "../../services/competicionServices";
import { obtenerDisciplinas } from "../../services/disciplinasServices";
import TablaCompeticiones from "../TablasDisciplina/TablaCompeticiones";
import GenerarPIndividuales from "../Torneos/GenerarPIndividuales"; // Ajusta la ruta
import partidoServices from "../../services/partidoServices"; // Ajusta la ruta

const PartidosIndividuales = () => {
  const [competencias, setCompetencias] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal
  const [equipos, setEquipos] = useState([]); // Estado para los equipos

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [competenciasData, disciplinasData] = await Promise.all([
          competicionServices.obtenerCompetenciasIndividuales(),
          obtenerDisciplinas(),
        ]);

        setCompetencias(competenciasData);
        setDisciplinas(disciplinasData);
      } catch (error) {
        setError("Error al cargar los datos.");
        console.error(error);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        const equiposData = await partidoServices.obtenerEquipos(); // Ajusta la función según tu servicio
        setEquipos(equiposData);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      }
    };

    cargarEquipos();
  }, []);

  const handleActualizarResultado = async (
    competenciaId,
    equipoId,
    resultado
  ) => {
    try {
      await competicionServices.actualizarResultadoEquipo(
        competenciaId,
        equipoId,
        resultado
      );

      // Recargar competencias
      const competenciasActualizadas =
        await competicionServices.obtenerCompetenciasIndividuales();
      setCompetencias(competenciasActualizadas);

      // Mostrar mensaje de éxito
      setSuccessMessage("Resultado actualizado correctamente");
    } catch (error) {
      setError("Error al actualizar el resultado.");
      console.error(error);
    }
  };

  const handleGenerar = async (nuevasCompetencias) => {
    try {
      const competenciasActualizadas = await competicionServices.obtenerCompetenciasIndividuales();
      
      setCompetencias(competenciasActualizadas);
      
      setModalOpen(false);
    } catch (error) {
      console.error('Error al recargar competencias:', error);
      setError('No se pudieron actualizar las competencias');
    }
  };

  const handleCloseAlert = (setStateFunction) => {
    setStateFunction("");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Competencias Individuales
      </Typography>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={2000}
          onClose={() => handleCloseAlert(setError)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => handleCloseAlert(setError)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={2000}
          onClose={() => handleCloseAlert(setSuccessMessage)}
          anchorOrigin={{ vertical: "buttom", horizontal: "right" }}
        >
          <Alert
            onClose={() => handleCloseAlert(setSuccessMessage)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: 3 }}
        onClick={() => setModalOpen(true)} // Abrir el modal
      >
        Generar Competencias
      </Button>

      <GenerarPIndividuales
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        equipos={equipos}
        onGenerar={handleGenerar}
      />

      <TablaCompeticiones
        competencias={competencias}
        disciplinas={disciplinas}
        onActualizarResultado={handleActualizarResultado}
      />
    </Box>
  );
};

export default PartidosIndividuales;
