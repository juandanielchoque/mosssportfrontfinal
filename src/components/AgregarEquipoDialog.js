import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import axios from 'axios';
import useNotification from '../hooks/useNotification'; 
import Notification from '../components/notification'; 

const AgregarEquipoDialog = ({ open, onClose, setNuevoEquipo, onAgregarEquipo }) => {
  const [categorias, setCategorias] = useState([]);
  const [torneosFiltrados, setTorneosFiltrados] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [torneosSeleccionados, setTorneosSeleccionados] = useState([]);
  const [formData, setFormData] = useState({
    nombreEquipo: '',
    email: '',
  });

  const { notification, showNotification, closeNotification } = useNotification();

  // Cargar categorías y torneos desde la API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categorias');
        const categoriasConTorneos = response.data.reduce((acc, item) => {
          const categoriaExistente = acc.find((cat) => cat.categoria_id === item.categoria_id);
          if (categoriaExistente) {
            categoriaExistente.torneos.push({
              torneo_id: item.torneo_id,
              torneo_nombre: item.torneo_nombre,
              categoria_nombre: item.categoria_nombre,
            });
          } else {
            acc.push({
              categoria_id: item.categoria_id,
              categoria_nombre: item.categoria_nombre,
              torneos: [
                {
                  torneo_id: item.torneo_id,
                  torneo_nombre: item.torneo_nombre,
                  categoria_nombre: item.categoria_nombre,
                },
              ],
            });
          }
          return acc;
        }, []);
        setCategorias(categoriasConTorneos);
      } catch (error) {
        
      }
    };

    fetchCategorias();
  }, [showNotification]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar selección de categorías
  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoriaId) ? prev.filter((item) => item !== categoriaId) : [...prev, categoriaId]
    );
  };

  // Actualizar torneos filtrados según las categorías seleccionadas
  useEffect(() => {
    const torneosDeCategoriasSeleccionadas = categorias
      .filter((cat) => categoriasSeleccionadas.includes(cat.categoria_id.toString()))
      .flatMap((cat) => cat.torneos);
    setTorneosFiltrados(torneosDeCategoriasSeleccionadas);
  }, [categoriasSeleccionadas, categorias]);

  // Manejar selección de torneos
  const handleTorneoChange = (e) => {
    const torneoId = e.target.value;
    setTorneosSeleccionados((prev) =>
      prev.includes(torneoId) ? prev.filter((item) => item !== torneoId) : [...prev, torneoId]
    );
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos del formulario
    if (!formData.nombreEquipo || !formData.email) {
      showNotification('Por favor complete todos los campos obligatorios.', 'warning');
      return;
    }

    if (torneosSeleccionados.length === 0) {
      showNotification('Debe seleccionar al menos un torneo.', 'warning');
      return;
    }

    // Preparar datos para enviar
    const equiposData = {
      nombre: formData.nombreEquipo,
      email_capitan: formData.email,
      torneos: torneosSeleccionados.map((torneoId) => {
        return categorias
          .filter((cat) => categoriasSeleccionadas.includes(cat.categoria_id.toString()))
          .flatMap((cat) => {
            return cat.torneos
              .filter((torneo) => torneo.torneo_id.toString() === torneoId)
              .map((torneo) => ({
                torneo_id: torneo.torneo_id,
                categoria_id: cat.categoria_id,
              }));
          });
      }).flat(),
    };

    try {
      const response = await axios.post('https://mosssportfinal-production.up.railway.app/api/equipos', equiposData);
      onClose(); // Cerrar el diálogo
      setFormData({ nombreEquipo: '', email: '' }); // Limpiar el formulario
      setCategoriasSeleccionadas([]);
      setTorneosSeleccionados([]);
      showNotification('Equipo agregado exitosamente.', 'success');
      if (onAgregarEquipo) onAgregarEquipo(response.data);
    } catch (error) {
      showNotification('Error al agregar el equipo. Intente de nuevo.', 'error');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Agregar Equipo</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre del Equipo"
              name="nombreEquipo"
              value={formData.nombreEquipo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email del Capitán"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              fullWidth
              margin="normal"
              required
            />
            <div>
              <h4>Categorías</h4>
              {categorias.map((cat) => (
                <FormControlLabel
                  key={cat.categoria_id}
                  control={
                    <Checkbox
                      value={cat.categoria_id}
                      onChange={handleCategoriaChange}
                      checked={categoriasSeleccionadas.includes(cat.categoria_id.toString())}
                    />
                  }
                  label={cat.categoria_nombre}
                />
              ))}
            </div>
            <div>
              <h4>Torneos</h4>
              {torneosFiltrados.map((torneo) => (
                <FormControlLabel
                  key={torneo.torneo_id}
                  control={
                    <Checkbox
                      value={torneo.torneo_id}
                      onChange={handleTorneoChange}
                      checked={torneosSeleccionados.includes(torneo.torneo_id.toString())}
                    />
                  }
                  label={`${torneo.torneo_nombre} - ${torneo.categoria_nombre}`}
                />
              ))}
            </div>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Agregar Equipo
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Componente para mostrar notificaciones */}
      <Notification notification={notification} onClose={closeNotification} />
    </>
  );
};

export default AgregarEquipoDialog;
