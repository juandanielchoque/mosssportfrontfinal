import { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import TablaPosiciones from './TablaPosiciones'; // Asumiendo que ya tienes este componente

const TorneosEnCurso = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

  // Cargar los torneos disponibles desde la API
  useEffect(() => {
    fetch('/api/torneos')
      .then(response => response.json())
      .then(data => setTorneos(data));
  }, []);

  const manejarSeleccionTorneo = (torneoId) => {
    setTorneoSeleccionado(torneoId);
  };

  return (
    <div>
      <h2>Torneos en curso</h2>
      <List>
  {torneos
    .filter(torneo => torneo.estado === 'pendiente')
    .map(torneo => (
      <ListItem
        button // Esta es una propiedad interna de Material-UI que no debería generar problemas
        key={torneo.id}
        onClick={() => manejarSeleccionTorneo(torneo.id)}
      >
        <ListItemText primary={torneo.nombre} />
        <Button variant="contained" color="primary">
          Ver Tabla de Posiciones
        </Button>
      </ListItem>
    ))}
</List>


      {torneoSeleccionado && <TablaPosiciones torneoId={torneoSeleccionado} />}
    </div>
  );
};

export default TorneosEnCurso;
