import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RegisterPage from './pages/RegisterPage';
import SeleccionarTorneosYCategorias from './pages/SeleccionarTorneosYCategorias';
import RegisterPageUser from './pages/RegisterPageUser';
import VerPartidos from './pages/userTablas/VerPartidos';
import UserPage from './pages/UserPage';
import VerEquipos from './pages/userTablas/VerEquipos';
import VerEstadisticas from './pages/userTablas/VerEstadisticas';
import ProtectedRoute from './components/ProtectedRoute';
import Calificacion from './pages/userTablas/VerCalificacion';
import General from './pages/userTablas/TablaGeneral'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPage/>} /> {/* Página de inicio */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerUser" element={<RegisterPageUser />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/torneos-disciplinas-categorias" element={<SeleccionarTorneosYCategorias />} />
        <Route path="/tablaPartidos" element={<VerPartidos />} />
        <Route path="/tablaEquipos" element={<VerEquipos />} />
        <Route path="/tablaEstadisticas" element={<VerEstadisticas />} />
        <Route path="/tablaCalificacion" element={<Calificacion />} />
        <Route path="/tablaGeneral" element={<General />} />
        
        
      </Routes>
    </Router>
  );
};

export default App;