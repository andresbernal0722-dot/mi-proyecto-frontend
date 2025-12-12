import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Users,Phone, Mail, User,
  Search, Filter, Eye, Download,CheckCircle,
  AlertCircle, XCircle, Package, Star, ArrowRight, ChevronDown,
  FileText, Calculator, Music, Lightbulb, Monitor, Volume2, Mic
} from 'lucide-react';
import Swal from 'sweetalert2';
import NavBar from '../components/NavBar';
import Footer from '../components/Fotter';


const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // ✅ Agregado estado para el filtro de estado
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [cargando, setCargando] = useState(true);  
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setCargando(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('No autenticado. Por favor inicia sesión.');
          setCargando(false);
          return;
        }

        const response = await fetch('http://localhost:4000/api/reservas/usuario', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const msg = await response.json();
          throw new Error(msg.message || 'Error al obtener reservas');
        }

        const data = await response.json();
        setReservas(Array.isArray(data.reservas) ? data.reservas : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchReservas();
  }, []);

  const handleCancelarClick = async (idReserva) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cancelar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });
  
    if (confirmacion.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/reservas/${idReserva}/cancelar`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || 'Error al cancelar la reserva');
        }
  
        await Swal.fire({
          title: '¡Reserva cancelada!',
          text: 'La reserva ha sido cancelada exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido'
        });
  
        // Actualiza lista
        setReservas(prev => prev.map(res =>
          res._id === idReserva ? { ...res, estado: 'cancelada' } : res
        ));
        setMostrarDetalles(false); // Cierra el modal
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.message || 'No se pudo cancelar la reserva.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    }
  };
  
  
  const tiposEvento = {
    boda: { label: 'Boda', color: 'pink' },
    corporativo: { label: 'Corporativo', color: 'blue' },
    cumpleanos: { label: 'Cumpleaños', color: 'yellow' },
    conferencia: { label: 'Conferencia', color: 'green' },
    concierto: { label: 'Concierto', color: 'purple' },
    graduacion: { label: 'Graduación', color: 'indigo' },
    lanzamiento: { label: 'Lanzamiento', color: 'red' },
    otros: { label: 'Otros', color: 'gray' }
  };

  const estadosReserva = {
    pendiente: { 
      label: 'Pendiente', 
      color: 'yellow', 
      icon: <AlertCircle className="h-4 w-4" />,
      description: 'En proceso de confirmación'
    },
    confirmada: { 
      label: 'Confirmada', 
      color: 'green', 
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Reserva confirmada'
    },
    completada: { 
      label: 'Completada', 
      color: 'blue', 
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Evento realizado'
    },
    cancelada: { 
      label: 'Cancelada', 
      color: 'red', 
      icon: <XCircle className="h-4 w-4" />,
      description: 'Reserva cancelada'
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getColorClasses = (color) => {
    const colorMap = {
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colorMap[color] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  const reservasFiltradas = reservas.filter(reserva => {
    if (!reserva) return false;
    
    const cumpleFiltroEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado;
    const cumpleFiltroFecha = !filtroFecha || (reserva.fechaEvento && reserva.fechaEvento.includes(filtroFecha));
    const cumpleBusqueda = !busqueda || 
    (reserva.nombreEvento?.toLowerCase().includes(busqueda.toLowerCase())) ||
    (reserva.nombreCliente?.toLowerCase().includes(busqueda.toLowerCase())) ||
    (reserva._id?.toLowerCase().includes(busqueda.toLowerCase()));
  
    
    return cumpleFiltroEstado && cumpleFiltroFecha && cumpleBusqueda;
  });

  const getCategoryIcon = (equipos) => {
    const categories = {
      audio: <Volume2 className="h-4 w-4" />,
      iluminacion: <Lightbulb className="h-4 w-4" />,
      video: <Monitor className="h-4 w-4" />,
      dj: <Music className="h-4 w-4" />,
      backline: <Mic className="h-4 w-4" />
    };

    if (!equipos || equipos.length === 0) {
      return categories.audio;
    }

    for (const equipo of equipos) {
      if (!equipo || !equipo.nombre) continue;
      
      if (equipo.nombre.includes('Audio') || equipo.nombre.includes('Altavoz') || equipo.nombre.includes('Micrófono') || equipo.nombre.includes('Line Array')) {
        return categories.audio;
      }
      if (equipo.nombre.includes('LED') || equipo.nombre.includes('Láser') || equipo.nombre.includes('Reflector')) {
        return categories.iluminacion;
      }
      if (equipo.nombre.includes('Proyector') || equipo.nombre.includes('Pantalla') || equipo.nombre.includes('Cámara')) {
        return categories.video;
      }
      if (equipo.nombre.includes('CDJ') || equipo.nombre.includes('DJ')) {
        return categories.dj;
      }
    }
    return categories.audio;
  };

  const abrirDetalles = (reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarDetalles(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Historial de Reservas
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Administra y consulta todas tus reservas de eventos
            </p>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {reservas.length}
              </div>
              <div className="text-gray-300">Total Reservas</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-gray-800/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {reservas.filter(r => r.estado === 'confirmada').length}
              </div>
              <div className="text-gray-300">Confirmadas</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-gray-800/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {reservas.filter(r => r.estado === 'completada').length}
              </div>
              <div className="text-gray-300">Completadas</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/20 to-gray-800/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {reservas.filter(r => r.estado === 'pendiente').length}
              </div>
              <div className="text-gray-300">Pendientes</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controles de Filtrado y Búsqueda */}
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                Buscar Reserva
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre, cliente o ID..."
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                Filtrar por Estado
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 appearance-none"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="confirmada">Confirmadas</option>
                  <option value="completada">Completadas</option>
                  <option value="cancelada">Canceladas</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                Filtrar por Fecha
              </label>
              <input
                type="month"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setBusqueda('');
                  setFiltroEstado('todos');
                  setFiltroFecha('');
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Reservas */}
        <div className="space-y-6">
          {reservasFiltradas.length === 0 ? (
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No hay reservas</h3>
              <p className="text-gray-400">No se encontraron reservas que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            reservasFiltradas.map(reserva => {
              if (!reserva) return null;
              
              // Obtener tipo de evento con validación
              const tipoEvento = reserva.tipoEvento && tiposEvento[reserva.tipoEvento] 
                ? tiposEvento[reserva.tipoEvento] 
                : { label: 'Otros', color: 'gray' };
              
              // Obtener estado con validación
              const estadoReserva = reserva.estado && estadosReserva[reserva.estado]
                ? estadosReserva[reserva.estado]
                : { label: 'Pendiente', color: 'yellow', icon: <AlertCircle className="h-4 w-4" /> };

              return (
              <div key={reserva._id || reserva.id} className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Información Principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-white mr-3">{reserva.nombreEvento || 'Sin nombre'}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getColorClasses(tipoEvento.color)}`}>
                            {tipoEvento.label}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm mb-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="mr-4">{reserva.fechaEvento ? formatDate(reserva.fechaEvento) : 'Sin fecha'}</span>
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="mr-4">{reserva.horaInicio || '00:00'} - {reserva.horaFin || '00:00'}</span>
                          <Users className="h-4 w-4 mr-2" />
                          <span>{reserva.numeroInvitados || 0} personas</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="mr-4">{reserva.ubicacion || 'Sin ubicación'}</span>
                          <User className="h-4 w-4 mr-2" />
                          <span>{reserva.nombreCliente || 'Sin nombre'}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold border mb-2 ${getColorClasses(estadoReserva.color)}`}>
                          {estadoReserva.icon}
                          <span className="ml-2">{estadoReserva.label}</span>
                        </div>
                        <p className="text-xs text-gray-400">ID: {reserva._id || reserva.id || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Información de Equipos */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-purple-300">
                        <Package className="h-4 w-4 mr-2" />
                        <span className="text-sm font-semibold mr-2">
                          {reserva.equiposSeleccionados?.length || 0} equipos alquilados
                        </span>
                        {reserva.equiposSeleccionados && reserva.equiposSeleccionados.length > 0 && getCategoryIcon(reserva.equiposSeleccionados)}
                        <span className="ml-2 text-sm">
                          Total: {reserva.equiposSeleccionados?.reduce((sum, eq) => sum + (eq.cantidad || 0), 0) || 0} piezas
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                          {formatPrice(reserva.total || 0)}
                        </div>
                        <p className="text-xs text-gray-400">Valor total</p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col lg:ml-6 space-y-2">
                    <button
                      onClick={() => abrirDetalles(reserva)}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </button>
                    
                    {reserva.estado === 'pendiente' }
                    
                    <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>

        {/* Modal de Detalles */}
        {mostrarDetalles && reservaSeleccionada && (() => {
          const tipoEventoModal = reservaSeleccionada.tipoEvento && tiposEvento[reservaSeleccionada.tipoEvento] 
            ? tiposEvento[reservaSeleccionada.tipoEvento] 
            : { label: 'Otros', color: 'gray' };
          
          const estadoReservaModal = reservaSeleccionada.estado && estadosReserva[reservaSeleccionada.estado]
            ? estadosReserva[reservaSeleccionada.estado]
            : { label: 'Pendiente', color: 'yellow', icon: <AlertCircle className="h-4 w-4" /> };

          return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900/90 to-gray-800/90 backdrop-blur-sm border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header del Modal */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{reservaSeleccionada.nombreEvento || 'Sin nombre'}</h2>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getColorClasses(tipoEventoModal.color)}`}>
                        {tipoEventoModal.label}
                      </span>
                      <span className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getColorClasses(estadoReservaModal.color)}`}>
                        {estadoReservaModal.icon}
                        <span className="ml-2">{estadoReservaModal.label}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMostrarDetalles(false)}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Información del Evento */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Información del Evento
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fecha:</span>
                          <span className="text-white">{reservaSeleccionada.fechaEvento ? formatDate(reservaSeleccionada.fechaEvento) : 'Sin fecha'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Horario:</span>
                          <span className="text-white">{reservaSeleccionada.horaInicio || '00:00'} - {reservaSeleccionada.horaFin || '00:00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Dirección:</span>
                          <span className="text-white text-right max-w-xs">{reservaSeleccionada.direccion || 'Sin dirección'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Información del Cliente */}
                    <div>
                      <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Información del Cliente
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nombre:</span>
                          <span className="text-white">{reservaSeleccionada.nombreCliente || 'Sin nombre'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white">{reservaSeleccionada.emailCliente || 'Sin email'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Teléfono:</span>
                          <span className="text-white">{reservaSeleccionada.telefonoCliente || 'Sin teléfono'}</span>
                        </div>
                        {reservaSeleccionada.empresaCliente && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Empresa:</span>
                            <span className="text-white">{reservaSeleccionada.empresaCliente}</span>
                          </div>
                        )}
                      </div>
                    </div>                   
                  </div>

                  {/* Equipos Seleccionados y Resumen Financiero */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Equipos Alquilados ({reservaSeleccionada.equiposSeleccionados?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {(reservaSeleccionada.equiposSeleccionados || []).map((equipo, index) => (
                          <div key={index} className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white text-sm">{equipo.nombre || 'Sin nombre'}</h4>
                                <p className="text-gray-400 text-xs mt-1">Cantidad: {equipo.cantidad || 0}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-purple-400 text-sm">
                                  {formatPrice((equipo.precio || 0) * (equipo.cantidad || 0))}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {formatPrice(equipo.precio || 0)} x {equipo.cantidad || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resumen Financiero */}
                    <div>
                      <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center">
                        <Calculator className="h-5 w-5 mr-2" />
                        Resumen Financiero
                      </h3>
                      <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Subtotal Equipos:</span>
                            <span className="text-white">
                              {formatPrice((reservaSeleccionada.equiposSeleccionados || []).reduce((sum, eq) => sum + ((eq.precio || 0) * (eq.cantidad || 0)), 0))}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Servicios Incluidos:</span>
                            <span className="text-green-400">Gratis</span>
                          </div>
                          <div className="border-t border-gray-600 pt-2 mt-2">
                            <div className="flex justify-between text-lg font-bold">
                              <span className="text-white">Total:</span>
                              <span className="text-purple-400">{formatPrice(reservaSeleccionada.total || 0)}</span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">*Precio por día de alquiler</p>
                        </div>
                      </div>

                      {/* Servicios Incluidos */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-purple-300 mb-2">Servicios Incluidos:</h4>
                        <div className="space-y-1">
                          {[
                            'Transporte de equipos',
                            'Montaje y desmontaje',
                            'Técnico especializado',
                            'Soporte durante el evento',
                            'Seguro de equipos'
                          ].map((servicio, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                              <span className="text-gray-300">{servicio}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones del Modal */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                  {reservaSeleccionada.estado === 'pendiente' && (
                    <>
                    <button
                      onClick={() => handleCancelarClick(reservaSeleccionada._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600 transition duration-150 ease-in-out"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelar reserva
                    </button>
                    </>
                  )}                   
                  <button 
                    onClick={() => setMostrarDetalles(false)}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* Información Adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Servicio Premium</h3>
            <p className="text-gray-300 text-sm">
              Todos nuestros clientes reciben atención personalizada y soporte técnico completo durante su evento.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Soporte 24/7</h3>
            <p className="text-gray-300 text-sm">
              ¿Tienes preguntas sobre tu reserva? Contáctanos en cualquier momento para recibir asistencia inmediata.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Nueva Reserva</h3>
            <p className="text-gray-300 text-sm mb-4">
              ¿Planificando otro evento? Crea una nueva reserva y aprovecha nuestros equipos profesionales.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105">
              Crear Reserva
            </button>
          </div>
        </div>

        {/* Estadísticas del Cliente */}
        {reservas.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-purple-200 mb-8 text-center">Tu Resumen de Actividad</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {formatPrice(reservas.reduce((sum, r) => sum + (r.total || 0), 0))}
                </div>
                <div className="text-gray-300">Valor Total Invertido</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {reservas.reduce((sum, r) => sum + ((r.equiposSeleccionados || []).reduce((eqSum, eq) => eqSum + (eq.cantidad || 0), 0)), 0)}
                </div>
                <div className="text-gray-300">Equipos Alquilados</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {reservas.filter(r => r.estado === 'completada').length}
                </div>
                <div className="text-gray-300">Eventos Exitosos</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {reservas.length > 0 ? Math.round(reservas.filter(r => r.estado === 'completada').length / reservas.length * 100) : 0}%
                </div>
                <div className="text-gray-300">Tasa de Éxito</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer de Contacto */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-black border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            ¿Necesitas ayuda con tu reserva?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Nuestro equipo está listo para asistirte con cualquier consulta sobre tus eventos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              Llamar Soporte
            </button>
            <button className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              Enviar Mensaje
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HistorialReservas;