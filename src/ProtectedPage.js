import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verificar si el token está en el localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirigir a la página de login
    return <Navigate to="/login" />;
  }

  // Si hay token, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;
