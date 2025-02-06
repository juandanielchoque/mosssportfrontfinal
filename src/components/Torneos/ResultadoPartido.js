import React from "react";
import { Box, Typography, Card, Grid, Avatar, Chip } from "@mui/material";

const ResultadosPartido = ({ partidos, equipos = [], torneos = [] }) => {
  // Validar si los equipos o torneos están definidos
  const getEquipo = (id) => equipos?.find((equipo) => equipo.id === id) || {};
  const getTorneo = (id) => torneos?.find((torneo) => torneo.id === id) || {};

  const renderNoDataMessage = () => (
    <Typography variant="body1" color="textSecondary" align="center" sx={{ marginTop: 3 }}>
      No hay datos para este filtro.
    </Typography>
  );

  return (
    <Box sx={{ marginBottom: 3, padding: 3, backgroundColor: "#F5F5F5", color: "#333", borderRadius: 2 }}>
      {partidos.length === 0 ? (
        renderNoDataMessage()
      ) : (
        partidos.map((partido) => {
          const equipo1 = getEquipo(partido.equipo1_id);
          const equipo2 = getEquipo(partido.equipo2_id);
          const torneo = getTorneo(partido.torneo_id);

          return (
            <Card key={partido.id} sx={{ padding: 3, backgroundColor: "#FFFFFF", borderRadius: 2, marginBottom: 2 }}>
              <Typography variant="subtitle1" color="textSecondary" align="left" sx={{ fontWeight: 'bold', color: '#666' }}>
                Jornada {partido.jornada || 1} - Partido {partido.id}
              </Typography>
              {/* Torneo y Fecha */}
              <Typography variant="subtitle1" color="textSecondary" align="center" sx={{ fontWeight: 'medium', color: '#555' }}>
                {torneo?.nombre || "Torneo Desconocido"} - {new Date(partido.fecha_hora).toLocaleDateString("es-ES")}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ fontWeight: 'light', color: '#777' }}>
                Lugar: {partido.lugar || "Por definir"} · Árbitro: {partido.arbitro || "Sin asignar"}
              </Typography>

              {/* Estado del partido */}
              <Box textAlign="center" sx={{ marginTop: 2 }}>
                <Chip
                  label={partido.estado.charAt(0).toUpperCase() + partido.estado.slice(1)}
                  color={partido.estado === "finalizado" ? "success" : partido.estado === "en curso" ? "warning" : "default"}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              {/* Equipos y Marcador */}
              <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ marginY: 2 }}>
                {/* Equipo 1 */}
                <Grid item xs={4} textAlign="center">
                  <Avatar
                    src={equipo1?.logo}
                    alt={equipo1?.nombre || "Equipo Local"}
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                  />
                  <Typography variant="h6" sx={{ marginTop: 1, fontWeight: 'bold', color: '#333' }}>
                    {equipo1?.nombre || "Equipo Local"}
                  </Typography>
                </Grid>

                {/* Marcador */}
                <Grid item xs={4} textAlign="center">
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#333' }}>
                    {partido.goles_1} - {partido.goles_2}
                  </Typography>
                </Grid>

                {/* Equipo 2 */}
                <Grid item xs={4} textAlign="center">
                  <Avatar
                    src={equipo2?.logo}
                    alt={equipo2?.nombre || "Equipo Visitante"}
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                  />
                  <Typography variant="h6" sx={{ marginTop: 1, fontWeight: 'bold', color: '#333' }}>
                    {equipo2?.nombre || "Equipo Visitante"}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default ResultadosPartido;
