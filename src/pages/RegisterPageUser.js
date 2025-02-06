import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usuarioServices from '../services/usuarioServices';
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('capitan');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password) {
      setError('Todos los campos son obligatorios.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El correo electrónico no es válido.');
      return false;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const usuarioData = {
        nombre: name,
        email,
        password,
        rol: role,
      };

      const response = await usuarioServices.registrarUsuario(usuarioData);
      setSuccess(response.message || 'Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Registro
        </Typography>

        {/* Campo de nombre */}
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Campo de correo electrónico */}
        <TextField
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Campo de contraseña */}
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Selector de rol */}
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          variant="outlined"
          margin="dense"
          sx={{ mt: 2, mb: 2 }}
        >
          <MenuItem value="capitan">Capitán</MenuItem>
          <MenuItem value="administrador">Administrador</MenuItem>
        </Select>

        {/* Botón de registro */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          disabled={isLoading}
          sx={{ mt: 2, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
        </Button>

        {/* Mensajes de error y éxito */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default RegisterPage;