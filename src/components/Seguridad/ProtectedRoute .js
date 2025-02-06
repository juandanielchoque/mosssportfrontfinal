import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); 

  console.log('Token:', token);
  console.log('User:', user);

  if (!token) {
    console.log('No token, redirecting to /');
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    console.log('Role mismatch, redirecting to /login');
    return <Navigate to="/login" replace />; 
  }

  return children;
};

export default ProtectedRoute;