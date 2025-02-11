import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://mosssportfinal-production.up.railway.app";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Intentando iniciar sesión con:', { email, password });

    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, { email, password }, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('Respuesta completa del servidor:', response);

        if (response.status === 200) {
            const { success, token, user, message } = response.data;
            console.log('Datos extraídos:', { success, token, user, message });

            if (success === true) { // Asegurar que es un booleano
                console.log('Token recibido:', token);
                console.log('Usuario recibido:', user);

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                navigate(user.rol === 'administrador' ? '/admin-dashboard' : '/user-dashboard');
            } else {
                console.log('Error del backend:', message);
                setError(message || 'Error en el inicio de sesión.');
            }
        } else {
            console.error(`Error en la solicitud: Código de estado ${response.status}`);
            setError('Error en la solicitud al servidor.');
        }
    } catch (err) {
        console.error('Error completo:', err);
        if (err.response) {
            console.error('Error del servidor:', err.response.status, err.response.data);
            setError(err.response.data.message || 'Error al iniciar sesión');
        } else {
            setError('No se pudo conectar con el servidor');
        }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            style={styles.input}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.loginButton}>
            Iniciar Sesión
          </button>
        </form>
        <button onClick={() => navigate('/registerUser')} style={styles.registerButton}>
          Registrarse
        </button>
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
  loginButton: {
    width: '100%',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'background-color 0.3s ease',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#6c757d',
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
    marginBottom: '15px',
  },
};

export default LoginPage;
