import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  obtenerEquipos,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
} from "../services/equipoServices";
import { obtenerTorneos } from "../services/torneoServices";
import { obtenerCategorias } from "../services/categoriaServices";
import usuarioServices from "../services/usuarioServices";
import AgregarJugadorDialog from "./AgregarJugadorDialog";
import JugadoresDialog from "./JugadoresDialog";
import EditarEquipo from "./FuncionalidadEquipos/EditarEquipo";

const EquipoTable = () => {
  // Estados para los datos principales
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para los diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openAgregarJugadorDialog, setOpenAgregarJugadorDialog] =
    useState(false);
  const [openJugadoresDialog, setOpenJugadoresDialog] = useState(false);
  const [OpenEditarDialog, setOpenEditarDialog] = useState(false);

  // Estados para la gestión de datos
  const [equipoAEliminar, setEquipoAEliminar] = useState(null);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    capitan_nombre: "",
    capitan_correo: "",
    capitan_password: "",
    logo: null,
    torneo_id: "",
    categoria_id: "",
  });

  // Función para convertir archivo a Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Estados para filtros
  const [filtro, setFiltro] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Funciones para obtener datos
  const fetchEquipos = async () => {
    try {
      const response = await obtenerEquipos();
      if (response && response.data) {
        setEquipos(response.data);
      } else {
        console.error("Respuesta inesperada:", response);
        setEquipos([]);
      }
    } catch (error) {
      console.error("Error al obtener los equipos:", error);
      setEquipos([]);
    }
  };

  const fetchTorneos = async () => {
    try {
      const response = await obtenerTorneos();
      setTorneos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error al obtener los torneos:", error);
      setTorneos([]);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await obtenerCategorias();
      setCategorias(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setCategorias([]);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchEquipos(), fetchTorneos(), fetchCategorias()]);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Manejadores para el diálogo de confirmación de eliminación
  const handleOpenDialog = (equipoId) => {
    setEquipoAEliminar(equipoId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEquipoAEliminar(null);
  };

  const handleConfirmarEliminacion = async () => {
    try {
      await eliminarEquipo(equipoAEliminar);
      await fetchEquipos();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al eliminar el equipo:", error);
    }
  };

  const handleOpenEditarDialog = (equipo) => {
    setEquipoSeleccionado(equipo);
    setOpenEditarDialog(true);
  };

  const handleEquipoActualizado = async () => {
    await fetchEquipos();
  };

  // Manejadores para el formulario
  const handleOpenFormDialog = () => {
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setFormData({
      nombre: "",
      capitan_nombre: "",
      capitan_correo: "",
      capitan_password: "",
      logo: null,
      torneo_id: "",
      categoria_id: "",
    });
  };

  // Función modificada para enviar el equipo y registrar al capitán
  const handleSubmitForm = async () => {
    try {
      // Validar campos del equipo
      if (!formData.nombre || !formData.torneo_id || !formData.categoria_id) {
        alert("Por favor complete los campos requeridos del equipo.");
        return;
      }

      // Validar campos del capitán
      if (
        !formData.capitan_nombre ||
        !formData.capitan_correo ||
        !formData.capitan_password
      ) {
        alert("Por favor complete los campos requeridos del capitán.");
        return;
      }

      // Registrar al capitán
      const usuarioResponse = await usuarioServices.registrarUsuario({
        nombre: formData.capitan_nombre,
        email: formData.capitan_correo,
        password: formData.capitan_password,
        rol: "capitan", // Rol predeterminado
      });

      // Verificar que el ID del capitán esté disponible
      if (!usuarioResponse.id) {
        throw new Error("No se pudo obtener el ID del capitán.");
      }

      // Actualizar el estado local (formData) con el capitan_id
      setFormData((prevFormData) => ({
        ...prevFormData,
        capitan_id: usuarioResponse.id, // Asignar el ID del capitán
      }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Crear el equipo con el capitan_id actualizado
      const equipoData = {
        nombre: formData.nombre,
        capitan_id: usuarioResponse.id, // Usar el ID del capitán
        logo: formData.logo,
        torneo_id: formData.torneo_id,
        categoria_id: formData.categoria_id,
      };

      await new Promise((resolve) => setTimeout(resolve, 50));

      const equipoResponse = await crearEquipo(equipoData);

      // Actualizar la lista de equipos
      await fetchEquipos();
      handleCloseFormDialog();
    } catch (error) {
      console.error(
        "Error al guardar el equipo o registrar al capitán:",
        error
      );
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      } else {
        console.error("Error al guardar el equipo o registrar al capitán.");
      }
    }
  };

  // Manejador para la subida de archivos
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          alert("El archivo es demasiado grande. El tamaño máximo es 5MB.");
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert("Por favor seleccione un archivo de imagen válido.");
          return;
        }

        const base64String = await fileToBase64(file);
        setFormData((prevFormData) => ({
          ...prevFormData,
          logo: base64String,
        }));
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
        alert("Error al procesar el archivo");
      }
    }
  };

  // Renderizado de la imagen en la tabla
  const renderLogoCell = (logoBase64) => {
    if (!logoBase64) {
      return <Avatar>N/A</Avatar>;
    }

    try {
      return (
        <Avatar
          src={`data:image/jpeg;base64,${logoBase64}`}
          alt="Logo del equipo"
          sx={{ width: 50, height: 50 }}
          onError={(e) => {
            console.error("Error al cargar la imagen");
            e.target.src = "";
            e.target.onerror = null;
          }}
        >
          E
        </Avatar>
      );
    } catch (error) {
      console.error("Error al renderizar logo:", error);
      return <Avatar>E</Avatar>;
    }
  };

  const handleCloseAgregarJugadorDialog = () => {
    setOpenAgregarJugadorDialog(false);
    setEquipoSeleccionado(null);
  };

  const handleOpenJugadoresDialog = (equipo) => {
    setEquipoSeleccionado(equipo);
    setOpenJugadoresDialog(true);
  };

  const handleCloseJugadoresDialog = () => {
    setOpenJugadoresDialog(false);
    setEquipoSeleccionado(null);
  };
  const handleOpenAgregarJugadorDialog = (equipo) => {
    setEquipoSeleccionado(equipo);
    setOpenAgregarJugadorDialog(true);
  };

  // Filtrar equipos
  const equiposFiltrados = equipos.filter((equipo) => {
    const textoFiltro = filtro.toLowerCase();
    const categoriaFiltro = categoriaSeleccionada
      ? equipo.categoria_nombre.toLowerCase() ===
        categoriaSeleccionada.toLowerCase()
      : true;

    return (
      (equipo.nombre.toLowerCase().includes(textoFiltro) ||
        equipo.torneo_nombre?.toLowerCase().includes(textoFiltro) ||
        equipo.categoria_nombre?.toLowerCase().includes(textoFiltro)) &&
      categoriaFiltro
    );
  });

  // Renderizado del formulario
  const renderFormulario = () => (
    <Dialog
      open={openFormDialog}
      onClose={handleCloseFormDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {formData.id ? "Editar Equipo" : "Registrar Equipo"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          {/* Campos del equipo */}
          <TextField
            label="Nombre del Equipo"
            variant="outlined"
            fullWidth
            required
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />

          {/* Campos del capitán */}
          <TextField
            label="Nombre del Capitán"
            variant="outlined"
            fullWidth
            required
            value={formData.capitan_nombre}
            onChange={(e) =>
              setFormData({ ...formData, capitan_nombre: e.target.value })
            }
          />
          <TextField
            label="Correo del Capitán"
            variant="outlined"
            fullWidth
            required
            value={formData.capitan_correo}
            onChange={(e) =>
              setFormData({ ...formData, capitan_correo: e.target.value })
            }
          />
          <TextField
            label="Contraseña del Capitán"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={formData.capitan_password}
            onChange={(e) =>
              setFormData({ ...formData, capitan_password: e.target.value })
            }
          />

          {/* Logo del equipo */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {formData.logo && (
              <Avatar
                src={`data:image/jpeg;base64,${formData.logo}`}
                alt="Vista previa del logo"
                sx={{ width: 100, height: 100 }}
              />
            )}
            <Button variant="contained" component="label">
              {formData.logo ? "Cambiar Logo" : "Subir Logo"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          {/* Torneo */}
          <FormControl fullWidth required>
            <InputLabel id="torneo-label">Torneo</InputLabel>
            <Select
              labelId="torneo-label"
              value={formData.torneo_id}
              label="Torneo"
              onChange={(e) =>
                setFormData({ ...formData, torneo_id: e.target.value })
              }
            >
              {torneos.map((torneo) => (
                <MenuItem key={torneo.id} value={torneo.id}>
                  {torneo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Categoría */}
          <FormControl fullWidth required>
            <InputLabel id="categoria-label">Categoría</InputLabel>
            <Select
              labelId="categoria-label"
              value={formData.categoria_id}
              label="Categoría"
              onChange={(e) =>
                setFormData({ ...formData, categoria_id: e.target.value })
              }
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFormDialog}>Cancelar</Button>
        <Button onClick={handleSubmitForm} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Renderizado de la tabla
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="contained" onClick={handleOpenFormDialog}>
        Registrar Equipo
      </Button>
      {renderFormulario()}

      {/* Filtros */}
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Buscar por equipo, torneo o categoría"
          variant="outlined"
          fullWidth
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button
            variant={categoriaSeleccionada === "" ? "contained" : "outlined"}
            onClick={() => setCategoriaSeleccionada("")}
          >
            Todos
          </Button>
          {categorias.map((categoria) => (
            <Button
              key={categoria.id}
              variant={
                categoriaSeleccionada === categoria.nombre
                  ? "contained"
                  : "outlined"
              }
              onClick={() => setCategoriaSeleccionada(categoria.nombre)}
            >
              {categoria.nombre}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Tabla de equipos */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Logo</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Nombre del Equipo</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Capitán</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Correo del Capitán</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Torneo</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Categoría</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equiposFiltrados.map((equipo) => (
                <TableRow key={equipo.id}>
                  <TableCell align="center">
                    {renderLogoCell(equipo.logo)}
                  </TableCell>
                  <TableCell align="center">{equipo.nombre}</TableCell>
                  <TableCell align="center">
                    {equipo.capitan_nombre || "No asignado"}
                  </TableCell>
                  <TableCell align="center">
                    {equipo.capitan_correo || "No asignado"}
                  </TableCell>
                  <TableCell align="center">{equipo.torneo_nombre}</TableCell>
                  <TableCell align="center">
                    {equipo.categoria_nombre}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenJugadoresDialog(equipo)}
                      >
                        Ver Jugadores
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenDialog(equipo.id)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleOpenEditarDialog(equipo)}
                      >
                        Actualizar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogos */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar este equipo? Esta acción no se
          puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmarEliminacion} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <AgregarJugadorDialog
        open={openAgregarJugadorDialog}
        onClose={handleCloseAgregarJugadorDialog}
        equipoId={equipoSeleccionado?.id}
      />

      <JugadoresDialog
        open={openJugadoresDialog}
        onClose={handleCloseJugadoresDialog}
        equipoId={equipoSeleccionado?.id}
      />

      <EditarEquipo
        open={OpenEditarDialog}
        onClose={() => setOpenEditarDialog(false)}
        equipo={equipoSeleccionado}
        onUpdate={handleEquipoActualizado}
      />
    </Box>
  );
};

export default EquipoTable;
