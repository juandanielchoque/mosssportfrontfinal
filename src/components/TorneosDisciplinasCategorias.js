import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import {
  obtenerTorneos,
  crearTorneo,
  actualizarTorneo,
  eliminarTorneo,
} from "../services/torneoServices";
import {
  obtenerDisciplinas,
  crearDisciplina,
  eliminarDisciplina,
} from "../services/disciplinasServices";
import {
  obtenerCategorias,
  crearCategoria,
  eliminarCategoria,
} from "../services/categoriaServices";
import {
  asignarDisciplinaATorneo,
  obtenerDisciplinasPorTorneo,
} from "../services/torneoDisciplinaServices";
import {
  asignarCategoriaADisciplina,
  obtenerCategoriasPorDisciplina,
} from "../services/disciplinaCategoriaServices";

const TorneosDisciplinasCategorias = () => {
  const [torneos, setTorneos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [disciplinasPorTorneo, setDisciplinasPorTorneo] = useState({});
  const [categoriasPorDisciplina, setCategoriasPorDisciplina] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchData = async () => {
    try {
      const torneosData = await obtenerTorneos();
      setTorneos(torneosData);
      const disciplinasData = await obtenerDisciplinas();
      setDisciplinas(disciplinasData);
      const categoriasData = await obtenerCategorias();
      setCategorias(categoriasData);

      const disciplinasPorTorneoData = {};
      for (const torneo of torneosData) {
        disciplinasPorTorneoData[torneo.id] = await obtenerDisciplinasPorTorneo(
          torneo.id
        );
      }
      setDisciplinasPorTorneo(disciplinasPorTorneoData);

      const categoriasPorDisciplinaData = {};
      for (const disciplina of disciplinasData) {
        categoriasPorDisciplinaData[disciplina.id] =
          await obtenerCategoriasPorDisciplina(disciplina.id);
      }
      setCategoriasPorDisciplina(categoriasPorDisciplinaData);
    } catch (error) {
      showSnackbar("Error al obtener datos.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 2000);
  };

  const handleOpenDialog = (type, data = {}) => {
    setFormType(type);
    setFormData(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("No hay sesión activa. Por favor inicie sesión.", "error");
      return;
    }

    try {
      if (formType === "torneo") {
        if (
          !formData.nombre ||
          !formData.tipo ||
          !formData.fecha_inicio ||
          !formData.fecha_fin ||
          !formData.lugar ||
          !formData.estado
        ) {
          showSnackbar("Por favor complete todos los campos.", "error");
          return;
        }
        if (formData.id) {
          await actualizarTorneo(formData.id, formData);
        } else {
          await crearTorneo(formData);
        }
      } else if (formType === "disciplina") {
        if (!formData.nombre || !formData.tipo || !formData.valor_puntos) {
          showSnackbar("Por favor complete todos los campos.", "error");
          return;
        }
        await crearDisciplina(formData);
      } else if (formType === "categoria") {
        if (!formData.nombre) {
          showSnackbar("Por favor complete todos los campos.", "error");
          return;
        }
        await crearCategoria(formData);
      }

      // Actualizar datos después de guardar
      await fetchData();
      handleCloseDialog();
      showSnackbar("Guardado exitosamente.", "success");
    } catch (error) {
      console.error("Error completo:", error.response?.data || error);
      showSnackbar(
        error.response?.data?.message || "Error al guardar los datos.",
        "error"
      );
    }
  };

  const handleDeleteTorneo = async (id) => {
    try {
      await eliminarTorneo(id);
      await fetchData();
      showSnackbar("Torneo eliminado exitosamente.", "success");
    } catch (error) {
      showSnackbar("Error al eliminar el torneo.", "error");
    }
  };

  const handleDeleteDisciplina = async (id) => {
    try {
      await eliminarDisciplina(id);
      await fetchData();
      showSnackbar("Disciplina eliminada exitosamente.", "success");
    } catch (error) {
      showSnackbar("Error al eliminar la disciplina.", "error");
    }
  };

  const handleDeleteCategoria = async (id) => {
    try {
      await eliminarCategoria(id);
      await fetchData();
      showSnackbar("Categoría eliminada exitosamente.", "success");
    } catch (error) {
      showSnackbar("Error al eliminar la categoría.", "error");
    }
  };

  const handleSelectTorneo = (id) => {
    setSelectedTorneo(id);
  };

  const handleSelectDisciplina = (id) => {
    setSelectedDisciplinas((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((disciplinaId) => disciplinaId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectCategoria = (id) => {
    setSelectedCategorias((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((categoriaId) => categoriaId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAsignarDisciplinasATorneo = async () => {
    try {
      // Validar que haya un torneo seleccionado
      if (!selectedTorneo) {
        showSnackbar("Por favor seleccione un torneo", "warning");
        return;
      }

      // Validar que haya disciplinas seleccionadas
      if (selectedDisciplinas.length === 0) {
        showSnackbar("Por favor seleccione al menos una disciplina", "warning");
        return;
      }

      // Verificar si las disciplinas ya están asignadas al torneo
      const disciplinasActuales = disciplinasPorTorneo[selectedTorneo] || [];
      const disciplinasNuevas = selectedDisciplinas.filter(
        (disciplinaId) =>
          !disciplinasActuales.some((d) => d.id === disciplinaId)
      );

      if (disciplinasNuevas.length === 0) {
        showSnackbar(
          "Las disciplinas seleccionadas ya están asignadas a este torneo",
          "info"
        );
        return;
      }

      // Asignar solo las disciplinas nuevas
      for (const disciplinaId of disciplinasNuevas) {
        await asignarDisciplinaATorneo(selectedTorneo, disciplinaId);
      }

      setSelectedDisciplinas([]);
      showSnackbar(
        `Se asignaron ${disciplinasNuevas.length} disciplinas al torneo exitosamente`,
        "success"
      );
      await fetchData();
    } catch (error) {
      showSnackbar("Error al asignar disciplinas al torneo", "error");
    }
  };

  const handleAsignarCategoriasADisciplina = async () => {
    try {
      // Validar que haya disciplinas seleccionadas
      if (selectedDisciplinas.length === 0) {
        showSnackbar("Por favor seleccione al menos una disciplina", "warning");
        return;
      }

      // Validar que haya categorías seleccionadas
      if (selectedCategorias.length === 0) {
        showSnackbar("Por favor seleccione al menos una categoría", "warning");
        return;
      }

      let asignacionesExitosas = 0;
      let asignacionesExistentes = 0;

      for (const disciplinaId of selectedDisciplinas) {
        const categoriasActuales = categoriasPorDisciplina[disciplinaId] || [];

        // Filtrar categorías que ya están asignadas
        const categoriasNuevas = selectedCategorias.filter(
          (categoriaId) => !categoriasActuales.some((c) => c.id === categoriaId)
        );

        // Asignar solo las categorías nuevas
        for (const categoriaId of categoriasNuevas) {
          await asignarCategoriaADisciplina(disciplinaId, categoriaId);
          asignacionesExitosas++;
        }

        asignacionesExistentes +=
          selectedCategorias.length - categoriasNuevas.length;
      }

      setSelectedCategorias([]);

      if (asignacionesExitosas > 0) {
        showSnackbar(
          `Se realizaron ${asignacionesExitosas} asignaciones nuevas exitosamente`,
          "success"
        );
      } else if (asignacionesExistentes > 0) {
        showSnackbar(
          "Todas las categorías seleccionadas ya estaban asignadas",
          "info"
        );
      }

      await fetchData();
    } catch (error) {
      showSnackbar("Error al asignar categorías a las disciplinas", "error");
    }
  };

  const renderFormFields = () => {
    switch (formType) {
      case "torneo":
        return (
          <>
            <TextField
              label="Nombre"
              fullWidth
              margin="normal"
              value={formData.nombre || ""}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                value={formData.tipo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
              >
                <MenuItem value="liga">Liga</MenuItem>
                <MenuItem value="eliminacion directa">
                  Eliminación Directa
                </MenuItem>
                <MenuItem value="mixto">Mixto</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Fecha de Inicio"
              type="date"
              fullWidth
              margin="normal"
              value={formData.fecha_inicio || ""}
              onChange={(e) =>
                setFormData({ ...formData, fecha_inicio: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha de Fin"
              type="date"
              fullWidth
              margin="normal"
              value={formData.fecha_fin || ""}
              onChange={(e) =>
                setFormData({ ...formData, fecha_fin: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Lugar"
              fullWidth
              margin="normal"
              value={formData.lugar || ""}
              onChange={(e) =>
                setFormData({ ...formData, lugar: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                value={formData.estado || ""}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="en curso">En Curso</MenuItem>
                <MenuItem value="finalizado">Finalizado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Reglas"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={formData.reglas || ""}
              onChange={(e) =>
                setFormData({ ...formData, reglas: e.target.value })
              }
            />
          </>
        );
      case "disciplina":
        return (
          <>
            <TextField
              label="Nombre"
              fullWidth
              margin="normal"
              value={formData.nombre || ""}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="tipo-discipina-label">Tipo</InputLabel>
              <Select
                labelId="tipo-discipina-label"
                value={formData.tipo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
              >
                <MenuItem value="colectiva">Colectiva</MenuItem>
                <MenuItem value="individual">Individual</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Valor Puntos"
              fullWidth
              margin="normal"
              type="number"
              value={formData.valor_puntos || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  valor_puntos: Number(e.target.value),
                })
              }
            />
            <TextField
              label="Descripción"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={formData.descripcion || ""}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </>
        );
      case "categoria":
        return (
          <>
            <TextField
              label="Nombre"
              fullWidth
              margin="normal"
              value={formData.nombre || ""}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Torneos, Disciplinas y Categorías
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog("torneo")}
      >
        Agregar Torneo
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog("disciplina")}
      >
        Agregar Disciplina
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog("categoria")}
      >
        Agregar Categoría
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {formType === "torneo"
            ? "Torneo"
            : formType === "disciplina"
            ? "Disciplina"
            : "Categoría"}
        </DialogTitle>
        <DialogContent>{renderFormFields()}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Torneos
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seleccionar</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha de Inicio</TableCell>
                <TableCell>Fecha de Fin</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {torneos.map((torneo) => (
                <TableRow key={torneo.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTorneo === torneo.id}
                      onChange={() => handleSelectTorneo(torneo.id)}
                    />
                  </TableCell>
                  <TableCell>{torneo.nombre}</TableCell>
                  <TableCell>{torneo.tipo}</TableCell>
                  <TableCell>{torneo.fecha_inicio}</TableCell>
                  <TableCell>{torneo.fecha_fin}</TableCell>
                  <TableCell>{torneo.lugar}</TableCell>
                  <TableCell>{torneo.estado}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteTorneo(torneo.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" gutterBottom>
          Disciplinas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seleccionar</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Valor Puntos</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disciplinas.map((disciplina) => (
                <TableRow key={disciplina.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDisciplinas.includes(disciplina.id)}
                      onChange={() => handleSelectDisciplina(disciplina.id)}
                    />
                  </TableCell>
                  <TableCell>{disciplina.nombre}</TableCell>
                  <TableCell>{disciplina.tipo}</TableCell>
                  <TableCell>{disciplina.valor_puntos}</TableCell>
                  <TableCell>{disciplina.descripcion}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteDisciplina(disciplina.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" gutterBottom>
          Categorías
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seleccionar</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCategorias.includes(categoria.id)}
                      onChange={() => handleSelectCategoria(categoria.id)}
                    />
                  </TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteCategoria(categoria.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAsignarDisciplinasATorneo}
          >
            Asignar Disciplinas a Torneo
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAsignarCategoriasADisciplina}
            sx={{ ml: 2 }}
          >
            Asignar Categorías a Disciplinas
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Relaciones
          </Typography>
          {torneos.map((torneo) => (
            <Box key={torneo.id} mt={2}>
              <Typography variant="h6">{torneo.nombre}</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Disciplina</TableCell>
                      <TableCell>Categorías</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {disciplinasPorTorneo[torneo.id]?.length > 0 ? (
                      disciplinasPorTorneo[torneo.id].map((disciplina) => (
                        <TableRow key={disciplina.id}>
                          <TableCell>{disciplina.nombre}</TableCell>
                          <TableCell>
                            {categoriasPorDisciplina[disciplina.id]?.map(
                              (categoria) => (
                                <Typography key={categoria.id}>
                                  {categoria.nombre}
                                </Typography>
                              )
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          No hay disciplinas asignadas a este torneo.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TorneosDisciplinasCategorias;
