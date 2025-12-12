import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Inicio';
import ServicesSection from './pages/Servicios';
import EventosPage from './pages/Eventos';
import ContactoPQRSPage from './pages/Contacto';
import LoginRegisterPage from './pages/Login';
import ReservaPage from './pages/Reservas';
import AccountPage from './pages/Cuenta';
import PasswordResetPage from './pages/Restablecer';
import RestablecerContraseña from './pages/RestablecerContrasena';
import HistorialReservas from './pages/Historial';
import ProtectedRoute from './ProtectedPage';
import ProtectedAdmin from './ProtectedAdmin'; 
import AdminDashboard from '../src/Admin/Admin';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<ServicesSection />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/contacto" element={<ContactoPQRSPage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} /> 
          <Route path="/restablecer" element={<PasswordResetPage />} />
          <Route path="/cambio/:token" element={<RestablecerContraseña />} />

          {/* Rutas protegidas */}
          <Route path="/cuenta" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/reservas" element={<ProtectedRoute><ReservaPage /></ProtectedRoute>} />
          <Route path="/historial" element={<ProtectedRoute><HistorialReservas /></ProtectedRoute>} />
        </Routes>
    </Router>
  );
}



export default App;
