import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import partidoServices from '../services/partidoServices';
import CrearPartido from './CrearPartido';
import TablaPartidos from './TablaPartidos';
import EditarPartido from './EditarPartido';
import FinalizarPartido from './FinalizarPartido';
import GenerarPartidos from './Torneos/GenerarPartido';


const Partidos = () => {
  const [partidosProgramados, setPartidosProgramados] = useState([]);
  const [partidosFinalizados, setPartidosFinalizados] = useState([]);
  const [partidosGenerados, setPartidosGenerados] = useState([]); 
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalGenerarOpen, setModalGenerarOpen] = useState(false); 
  const [editPartido, setEditPartido] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalFinalizarOpen, setModalFinalizarOpen] = useState(false);
  const [generacionCompletada, setGeneracionCompletada] = useState(false);
  const [partidoActual, setPartidoActual] = useState(null);
  const [nuevoPartido, setNuevoPartido] = useState({
    torneo_id: '',
    disciplina_id: '',
    categoria_id: '',
    equipo1_id: '',
    equipo2_id: '',
    fecha_hora: '',
    lugar: '',
    estado: 'programado',
    goles_1: 0,
    goles_2: 0,
    arbitro: '',
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [partidosData, equiposData, torneosData] = await Promise.all([
          partidoServices.obtenerPartidos(),
          partidoServices.obtenerEquipos(),
          partidoServices.obtenerTorneos(),
        ]);
  
        setPartidosProgramados(partidosData.filter(partido => partido.estado === 'programado'));
        setPartidosFinalizados(partidosData.filter(partido => partido.estado === 'finalizado'));
        setEquipos(equiposData);
        setTorneos(torneosData);
  
        // Si ya hay partidos programados, deshabilitar el botón de generación
        if (partidosData.some(partido => partido.estado === 'programado')) {
          setGeneracionCompletada(true);
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
  
    cargarDatos();
  }, []);
  

  const handleTorneoChange = async (torneoId) => {
    setNuevoPartido((prev) => ({ ...prev, torneo_id: torneoId }));
    try {
      const disciplinasData = await partidoServices.obtenerDisciplinas(torneoId);
      setDisciplinas(disciplinasData);
      setCategorias([]);
    } catch (error) {
      console.error('Error al cargar las disciplinas:', error);
    }
  };

  const handleDisciplinaChange = async (disciplinaId) => {
    setNuevoPartido((prev) => ({ ...prev, disciplina_id: disciplinaId }));
    try {
      const categoriasData = await partidoServices.obtenerCategorias(disciplinaId);
      setCategorias(categoriasData);
      console.log(categoriasData);
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  };

  const handleActualizarPartido = async (id, partidoActualizado) => {
    try {
      await partidoServices.actualizarPartido(id, partidoActualizado);
      const nuevosPartidos = await partidoServices.obtenerPartidos();
      setPartidosProgramados(nuevosPartidos.filter(partido => partido.estado === 'programado'));
      setPartidosFinalizados(nuevosPartidos.filter(partido => partido.estado === 'finalizado'));
    } catch (error) {
      console.error('Error al actualizar el partido:', error);
    }
  };

  const handleCreatePartido = async (partido) => {
    try {
      await partidoServices.crearPartido(partido);
      const partidosActualizados = await partidoServices.obtenerPartidos();
      setPartidosProgramados(partidosActualizados.filter((p) => p.estado === 'programado'));
      setPartidosFinalizados(partidosActualizados.filter((p) => p.estado === 'finalizado'));
      setModalCrearOpen(false);
      setNuevoPartido({
        torneo_id: '',
        disciplina_id: '',
        categoria_id: '',
        equipo1_id: '',
        equipo2_id: '',
        fecha_hora: '',
        lugar: '',
        estado: 'programado',
        goles_1: 0,
        goles_2: 0,
        arbitro: '',
      });
    } catch (error) {
      console.error('Error al agregar el partido:', error);
    }
  };

  const handleDeletePartido = async (id) => {
    try {
      await partidoServices.eliminarPartido(id);
      const nuevosPartidos = await partidoServices.obtenerPartidos();
      setPartidosProgramados(nuevosPartidos.filter(partido => partido.estado === 'programado'));
      setPartidosFinalizados(nuevosPartidos.filter(partido => partido.estado === 'finalizado'));
    } catch (error) {
      console.error('Error al eliminar el partido:', error);
    }
  };

  const handleOpenEdit = async (partido) => {
    setEditPartido(partido);
    setOpen(true);
    try {
      const disciplinasData = await partidoServices.obtenerDisciplinas(partido.torneo_id);
      setDisciplinas(disciplinasData);
      const categoriasData = await partidoServices.obtenerCategorias(partido.disciplina_id);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar las disciplinas y categorías:', error);
    }
  };

  const handleCloseEdit = () => {
    setOpen(false);
    setEditPartido(null);
  };

  const handleSubmit = (partidoEditado) => {
    handleActualizarPartido(partidoEditado.id, partidoEditado);
    handleCloseEdit();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPartido((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalizarPartido = async (id, resultados) => {
    try {
      await partidoServices.finalizarPartido(id, resultados);
      const nuevosPartidos = await partidoServices.obtenerPartidos();
      setPartidosProgramados(nuevosPartidos.filter(partido => partido.estado === 'programado'));
      setPartidosFinalizados(nuevosPartidos.filter(partido => partido.estado === 'finalizado'));
    } catch (error) {
      console.error('Error al finalizar el partido:', error);
      throw error;
    }
  };

  const handleGenerarPartidos = async (partidos) => {
    try {
      console.log("🔄 Iniciando generación de partidos...");
  
      // 🔥 Evita duplicados usando un Set con claves únicas (equipo1_id + equipo2_id + fecha_hora)
      const partidosUnicos = new Map();
  
      partidos.forEach((partido) => {
        const claveUnica = `${partido.equipo1_id}-${partido.equipo2_id}-${partido.fecha_hora}`;
        if (!partidosUnicos.has(claveUnica)) {
          partidosUnicos.set(claveUnica, partido);
        }
      });
  
      const partidosValidos = [...partidosUnicos.values()].map(partido => ({
        ...partido,
        fecha_hora: partido.fecha_hora || new Date().toISOString(),
        lugar: partido.lugar && typeof partido.lugar === "string" && partido.lugar.trim() ? partido.lugar : "Por definir",
        jornada: partido.jornada || 1
      }));
  
      console.log("📤 Enviando los siguientes partidos:", JSON.stringify(partidosValidos, null, 2));
  
      await Promise.all(partidosValidos.map(async (partido) => {
        await partidoServices.crearPartido(partido);
      }));
  
      console.log("✅ Partidos generados correctamente");
  
      // 🔥 Actualizar la tabla de partidos
      const nuevosPartidos = await partidoServices.obtenerPartidos();
      setPartidosProgramados(nuevosPartidos.filter(partido => partido.estado === 'programado'));
      setPartidosFinalizados(nuevosPartidos.filter(partido => partido.estado === 'finalizado'));
  
      // ✅ Deshabilitar el botón de generación
      setGeneracionCompletada(true);
  
    } catch (error) {
      console.error("❌ Error al guardar los partidos:", error.response?.data || error.message);
    }
  };
  
  
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Partidos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalCrearOpen(true)}
        sx={{ marginBottom: 3 }}
      >
        Agregar Partido
      </Button>
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalGenerarOpen(true)}
        sx={{ marginBottom: 3 }}
        disabled={generacionCompletada}
      >
        Generar Partidos
      </Button>

      <CrearPartido
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onCreate={handleCreatePartido}
        torneos={torneos}
        disciplinas={disciplinas}
        categorias={categorias}
        equipos={equipos}
        nuevoPartido={nuevoPartido}
        setNuevoPartido={setNuevoPartido}
        onTorneoChange={handleTorneoChange}
        onDisciplinaChange={handleDisciplinaChange}
      />

      <GenerarPartidos
        open={modalGenerarOpen}
        onClose={() => setModalGenerarOpen(false)}
        onGenerar={handleGenerarPartidos}
        equipos={equipos}
        categorias={categorias}
        disciplinas={disciplinas}
      />

      <TablaPartidos
        partidos={partidosProgramados}
        equipos={equipos}
        categorias={categorias}
        disciplinas={disciplinas}
        onFinalizarPartido={handleFinalizarPartido}
        onEditarPartido={handleOpenEdit}
        onEliminarPartido={handleDeletePartido}
        key={partidosProgramados.length}
      />
      
      <EditarPartido
        open={open}
        partido={editPartido}
        equipos={equipos}
        disciplinas={disciplinas}
        categorias={categorias}
        torneos={torneos}
        onClose={handleCloseEdit}
        onSubmit={handleSubmit}
        handleChange={handleChange}
      />

      {partidoActual && (
        <FinalizarPartido
          open={modalFinalizarOpen}
          onClose={() => setModalFinalizarOpen(false)}
          partido={partidoActual}
          onUpdate={handleActualizarPartido}
        />
      )}
    </Box>
  );
};

export default Partidos;