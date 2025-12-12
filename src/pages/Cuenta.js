import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Save, Edit3, CheckCircle, AlertTriangle
} from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Fotter';
import StarRating from '../components/StarRating';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [formData, setFormData] = useState(userData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // ======================
  // Cargar usuario desde token
  // ======================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userInfo = {
        id: decoded._id || decoded.id,  
        firstName: decoded.firstName || decoded.nombre || '',
        lastName: decoded.lastName || decoded.apellido || '',
        email: decoded.email,
        phone: decoded.telefono  || ''
      };

      setUserData(userInfo);
      setFormData(userInfo);
    } catch (error) {
      console.error('Token inválido:', error);
    }
  }, []);

  // ======================
  // Validaciones
  // ======================
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\+]?[1-9][\d]{0,15}$/.test(phone);
  const validatePassword = (password) => password.length >= 8;

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Contraseña actual requerida';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nueva contraseña requerida';
    } else if (!validatePassword(passwordData.newPassword)) {
      newErrors.newPassword = 'Debe tener al menos 8 caracteres';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================
  // Handlers
  // ======================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, id: userData.id })
      });

      const result = await response.json();

      if (response.ok) {
        setUserData(result.user);
        setFormData(result.user);
        setIsEditing(false);
        setNotification({ message: result.message, type: 'success', visible: true });
      } else {
        throw new Error(result.message || 'Error desconocido');
      }
    } catch (error) {
      setNotification({ message: error.message, type: 'error', visible: true });
    }

    setIsLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/usuarios/perfil/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userData.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setNotification({ message: result.message, type: 'success', visible: true });
      } else {
        throw new Error(result.message || 'Error desconocido');
      }
    } catch (error) {
      setNotification({ message: error.message, type: 'error', visible: true });
    }

    setIsLoading(false);
  };

  const cancelEdit = () => {
    setFormData(userData);
    setIsEditing(false);
    setErrors({});
  };

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'password', name: 'Contraseña', icon: Lock },
    { id: 'pqrs', name: 'Mis PQRS', icon: Mail }
  ];

  const [misPqrs, setMisPqrs] = useState([]);
  const [cargandoPqrs, setCargandoPqrs] = useState(false);
  const [calificandoPqrs, setCalificandoPqrs] = useState({});

  // Derivados: separar PQRS pendientes y respondidas
  const pendientesPqrs = misPqrs.filter(p => !p.respondido);
  const respondidasPqrs = misPqrs.filter(p => p.respondido);

  // Cargar PQRS del usuario cuando se activa la pestaña
  useEffect(() => {
    const cargarPqrs = async () => {
      if (activeTab !== 'pqrs' || !userData.email) return;

      setCargandoPqrs(true);
      try {
        const response = await fetch(`http://localhost:4000/api/contactos?email=${encodeURIComponent(userData.email)}`);
        if (!response.ok) throw new Error('Error al cargar PQRS');

        const data = await response.json();

        // El backend devuelve { contactos: [...], pagination: {...} }
        let items = Array.isArray(data) ? data : (data && data.contactos) ? data.contactos : [];

        // Si no encontramos nada con el filtro por email, intentar un fallback
        if ((!items || items.length === 0) && userData.email) {
          try {
            const fallbackRes = await fetch(`http://localhost:4000/api/contactos?limit=1000`);
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const fallbackItems = Array.isArray(fallbackData) ? fallbackData : (fallbackData && fallbackData.contactos) ? fallbackData.contactos : [];

              const emailNormalized = String(userData.email || '').trim().toLowerCase();
              items = (fallbackItems || []).filter(it => String(it.email || '').trim().toLowerCase() === emailNormalized);
            }
          } catch (err) {
            console.warn('Fallback fetch de contactos falló:', err);
          }
        }

        // Normalizar campos por si hay inconsistencias y ordenar por fecha (más recientes primero)
        const normalized = items.map(item => ({
          _id: item._id,
          nombre: item.nombre,
          email: item.email,
          tipoPQRS: item.tipoPQRS,
          mensaje: item.mensaje,
          respondido: !!item.respondido,
          respuesta: item.respuesta || '',
          fecha: item.fecha || item.createdAt || null,
          fechaRespuesta: item.fechaRespuesta || null
        }));

        normalized.sort((a, b) => {
          const da = a.fecha ? new Date(a.fecha).getTime() : 0;
          const db = b.fecha ? new Date(b.fecha).getTime() : 0;
          return db - da;
        });

        setMisPqrs(normalized);
      } catch (error) {
        console.error('Error:', error);
        setNotification({
          message: 'Error al cargar tus PQRS',
          type: 'error',
          visible: true
        });
      } finally {
        setCargandoPqrs(false);
      }
    };

    cargarPqrs();
  }, [activeTab, userData.email]);

  // Función para guardar calificación
  const handleCalificarRespuesta = async (pqrsId, calificacionData) => {
    try {
      console.log('🔄 Iniciando calificación para PQRS:', pqrsId);
      console.log('📊 Datos de calificación:', calificacionData);
      
      setCalificandoPqrs(prev => ({ ...prev, [pqrsId]: true }));

      const url = `http://localhost:4000/api/contactos/${pqrsId}/calificar`;
      console.log('🌐 URL de petición:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(calificacionData)
      });

      console.log('📨 Respuesta del servidor - Status:', response.status);

      if (!response.ok) {
        const err = await response.json();
        console.error('❌ Error del servidor:', err);
        throw new Error(err.message || 'Error al guardar calificación');
      }

      const result = await response.json();
      console.log('✅ Respuesta exitosa:', result);

      // Actualizar la PQRS en el estado local
      setMisPqrs(prev =>
        prev.map(p =>
          p._id === pqrsId
            ? {
                ...p,
                calificacion: result.data.calificacion,
                comentarioCalificacion: result.data.comentarioCalificacion,
                fechaCalificacion: result.data.fechaCalificacion
              }
            : p
        )
      );

      setNotification({
        message: '¡Gracias por tu calificación!',
        type: 'success',
        visible: true
      });

      console.log('✅ Calificación actualizada en el estado');
      return true;
    } catch (error) {
      console.error('❌ Error al calificar:', error);
      setNotification({
        message: 'Error al guardar tu calificación. Intenta de nuevo.',
        type: 'error',
        visible: true
      });
      return false;
    } finally {
      setCalificandoPqrs(prev => ({ ...prev, [pqrsId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      {/* Fondo decorativo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-800/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Mi Cuenta
              </span>
            </h1>
            <p className="text-gray-400">Gestiona tu información personal y configuraciones</p>
          </div>

          {/* Notificación */}
          {notification.visible && (
            <div className={`mb-6 px-4 py-3 rounded-lg flex items-center ${
              notification.type === 'success'
                ? 'bg-green-600/20 border border-green-500/30 text-green-100'
                : 'bg-red-600/20 border border-red-500/30 text-red-100'
            }`}>
              {notification.type === 'success' ? 
                <CheckCircle className="h-5 w-5 mr-3" /> : 
                <AlertTriangle className="h-5 w-5 mr-3" />
              }
              {notification.message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar con tabs */}
            <div className="lg:w-1/4">
              <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsEditing(false);
                          setErrors({});
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-purple-600/30 border border-purple-500/50 text-purple-100'
                            : 'text-gray-300 hover:bg-purple-600/10 hover:text-purple-200'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>

                
              </div>
            </div>

            {/* Contenido principal */}
            <div className="lg:w-3/4">
              <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">

                {/* Tab Perfil */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-purple-100">Información Personal</h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300"
                          type="button"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar
                        </button>
                      )}
                    </div>
                    <div>
                      {/* Campos del formulario */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Nombre
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg transition-all duration-300 ${
                                isEditing
                                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                                  : 'cursor-not-allowed opacity-75'
                              } ${
                                errors.firstName
                                  ? 'border-red-500'
                                  : 'border-purple-500/30 hover:border-purple-500/50'
                              }`}
                            />
                          </div>
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Apellido
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg transition-all duration-300 ${
                                isEditing
                                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                                  : 'cursor-not-allowed opacity-75'
                              } ${
                                errors.lastName
                                  ? 'border-red-500'
                                  : 'border-purple-500/30 hover:border-purple-500/50'
                              }`}
                            />
                          </div>
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg transition-all duration-300 ${
                                isEditing
                                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                                  : 'cursor-not-allowed opacity-75'
                              } ${
                                errors.email
                                  ? 'border-red-500'
                                  : 'border-purple-500/30 hover:border-purple-500/50'
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Teléfono
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg transition-all duration-300 ${
                                isEditing
                                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                                  : 'cursor-not-allowed opacity-75'
                              } ${
                                errors.phone
                                  ? 'border-red-500'
                                  : 'border-purple-500/30 hover:border-purple-500/50'
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-4 mt-8">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            ) : (
                              <Save className="h-5 w-5 mr-2" />
                            )}
                            Guardar Cambios
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-6 py-3 border border-purple-500/50 hover:border-purple-500 rounded-lg font-semibold transition-all duration-300"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                )}

                {/* Tab Mis PQRS */}
                {activeTab === 'pqrs' && (
                  <div>
                    <h2 className="text-2xl font-bold text-purple-100 mb-4">Mis PQRS</h2>

                    {cargandoPqrs ? (
                      <p className="text-gray-400">Cargando...</p>
                    ) : misPqrs.length === 0 ? (
                      <p className="text-gray-400">No tienes PQRS registradas.</p>
                    ) : (
                      <div className="space-y-6">
                        {/* Pendientes */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-purple-200">Pendientes</h3>
                            <span className="text-sm text-gray-400">{pendientesPqrs.length}</span>
                          </div>
                          <div className="space-y-3">
                            {pendientesPqrs.length === 0 ? (
                              <p className="text-gray-400">No tienes PQRS pendientes.</p>
                            ) : (
                              pendientesPqrs.map((p) => (
                                <div key={p._id} className="bg-black/40 border border-yellow-600/20 rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold">{p.tipoPQRS} - {p.nombre}</p>
                                      <p className="text-sm text-gray-300">{p.fecha ? new Date(p.fecha).toLocaleString() : ''}</p>
                                    </div>
                                    <div className="ml-4">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-600/20 text-yellow-300 border border-yellow-600/30">Pendiente</span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-gray-300">{p.mensaje}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Respondidas */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-purple-200">Respondidas</h3>
                            <span className="text-sm text-gray-400">{respondidasPqrs.length}</span>
                          </div>
                          <div className="space-y-3">
                            {respondidasPqrs.length === 0 ? (
                              <p className="text-gray-400">Aún no tienes respuestas.</p>
                            ) : (
                              respondidasPqrs.map((p) => (
                                <div key={p._id} className="bg-black/40 border border-purple-500/20 rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold">{p.tipoPQRS} - {p.nombre}</p>
                                      <p className="text-sm text-gray-300">{p.fecha ? new Date(p.fecha).toLocaleString() : ''}</p>
                                    </div>
                                    <div className="ml-4">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-300 border border-green-600/30">Respondido</span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-gray-300">{p.mensaje}</p>
                                  <div className="mt-3 bg-gray-800/50 border-l-4 border-purple-600 p-3 rounded">
                                    <p className="text-sm text-purple-200 font-semibold">Respuesta:</p>
                                    <p className="text-gray-300">{p.respuesta}</p>
                                    <p className="text-xs text-gray-400 mt-1">{p.fechaRespuesta ? new Date(p.fechaRespuesta).toLocaleString() : ''}</p>
                                  </div>

                                  {/* Link a encuesta de satisfacción */}
                                  {p.linkEncuesta && (
                                    <div className="mt-3 bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded">
                                      <p className="text-sm text-blue-200 font-semibold mb-2">📋 ¿Qué tal fue tu experiencia?</p>
                                      <p className="text-xs text-gray-300 mb-2">Ayúdanos a mejorar completando una breve encuesta de satisfacción.</p>
                                      <a
                                        href={p.linkEncuesta}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded transition-colors"
                                      >
                                        Completar Encuesta →
                                      </a>
                                    </div>
                                  )}

                                  {/* Componente de calificación */}
                                  <StarRating
                                    pqrsId={p._id}
                                    initialRating={p.calificacion || 0}
                                    initialComment={p.comentarioCalificacion || ''}
                                    isLoading={calificandoPqrs[p._id] || false}
                                    onSubmit={(calificacionData) =>
                                      handleCalificarRespuesta(p._id, calificacionData)
                                    }
                                  />
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Contraseña */}
                {activeTab === 'password' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-purple-100">Cambiar Contraseña</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Contraseña Actual
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                              errors.currentPassword
                                ? 'border-red-500'
                                : 'border-purple-500/30 hover:border-purple-500/50'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                          >
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="mt-1 text-sm text-red-400">{errors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Nueva Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                              errors.newPassword
                                ? 'border-red-500'
                                : 'border-purple-500/30 hover:border-purple-500/50'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                              errors.confirmPassword
                                ? 'border-red-500'
                                : 'border-purple-500/30 hover:border-purple-500/50'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <button
                        onClick={handlePasswordUpdate}
                        disabled={isLoading}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Save className="h-5 w-5 mr-2" />
                        )}
                        Actualizar Contraseña
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;