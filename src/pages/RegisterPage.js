import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usuarioServices from '../services/usuarioServices';

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
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Registro</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          style={styles.input}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          style={styles.input}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option value="capitan">Capitán</option>
          <option value="administrador">Administrador</option>
        </select>
        <button onClick={handleRegister} style={styles.registerButton} disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f9fc',
    fontFamily: "'Arial', sans-serif",
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#ff4d4f',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
  success: {
    color: '#28a745',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
};

export default RegisterPage;