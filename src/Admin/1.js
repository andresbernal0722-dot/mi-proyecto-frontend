import React, { useState, useEffect } from 'react';
import {
  Calendar, User,Search, Eye, Download, Edit, Trash2, CheckCircle,AlertCircle, XCircle, Package, Star, Music, Lightbulb, Monitor, Volume2, Mic,
  BarChart3, TrendingUp, DollarSign, UserCheck, MessageSquare, Plus, Home, LogOut, Menu, X, Bell, Activity,
  Calendar as CalendarIcon, Users as UsersIcon, Package2, FileBarChart, HelpCircle,Zap, Camera, ArchiveIcon, ClipboardListIcon
} from 'lucide-react';


const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos los roles");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [editingEvento, setEditingEvento] = useState(null);
  const [confirmDeleteEvento, setConfirmDeleteEvento] = useState(null);
  // Filtros Eventos
  const [searchEvento, setSearchEvento] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos los tipos");
  const [statusFilterEvento, setStatusFilterEvento] = useState("Todos los estados");
  const [toast, setToast] = useState(null);
  const [eventosData, setEventosData] = useState([]);
  const [pqrsData, setPqrsData] = useState([]);
  //Reservas
  const [reservasData, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [fechaFilter, setFechaFilter] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null); 
  const [confirmarReservaId, setConfirmarReservaId] = useState(null); 
  const [rechazarReservaId, setRechazarReservaId] = useState(null); 
  const [confirmDelete, setConfirmDelete] = useState(null);
  //CONTACTO
  const [pqrsSeleccionada, setPqrsSeleccionada] = useState(null);
  const [confirmDeletePQRS, setConfirmDeletePQRS] = useState(null);
  // --- INVENTARIO ---
  const [inventarioData, setInventarioData] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("all");
  const [estadoFiltro, setEstadoFiltro] = useState("all");
  const [busquedaInventario, setBusquedaInventario] = useState("");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [confirmDeleteEquipo, setConfirmDeleteEquipo] = useState(null);


  
  // Estados para formularios
  const [newEvento, setNewEvento] = useState({
    nombre: '', categoria: '', precio: '', descripcion: '', disponible: true, imagen: ''
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // desaparece en 3s
  };
  
  // Datos simulados para estadísticas
  const statsData = {
    totalUsers: 1847,
    reservasPendientes: 23,
    reservasConfirmadas: 156,
    ingresosMes: 45750000,
    eventosActivos: 89,
    pqrsAbiertas: 7,
    equiposDisponibles: 342,
    satisfaccionClientes: 94
  };

  const ventasMensuales = [
    { mes: 'Ene', ventas: 12500000 },
    { mes: 'Feb', ventas: 18750000 },
    { mes: 'Mar', ventas: 23400000 },
    { mes: 'Abr', ventas: 31200000 },
    { mes: 'May', ventas: 28900000 },
    { mes: 'Jun', ventas: 45750000 }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: UsersIcon },
    { id: 'eventos', label: 'Gestión de Eventos', icon: Package2 },
    { id: 'reservas', label: 'Reservas', icon: CalendarIcon },
    { id: 'pqrs', label: 'PQRS - Cotización', icon: MessageSquare },
    { id: 'reportes', label: 'Reportes', icon: FileBarChart },
    { id: 'inventario', label: 'Inventario', icon: ArchiveIcon }, 
  ];
  

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  useEffect(() => {
    if (activeSection === 'usuarios') {
      const fetchUsuarios = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token'); 
          const res = await fetch('http://localhost:4000/api/usuarios', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });          
          const data = await res.json();
          setUserData(data);
        } catch (error) {
          console.error("Error cargando usuarios:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsuarios();
    }
  }, [activeSection]);


  // Cargar eventos 
  useEffect(() => {
    if (activeSection === "eventos") {
      const fetchEventos = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:4000/api/eventos", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          setEventosData(data);
        } catch (error) {
          console.error("Error cargando eventos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEventos();
    }
  }, [activeSection]);

  // Editar Evento
  const handleEditEvento = (evento) => {
    setEditingUser(null); // para no mezclar
    setEditingEvento(evento); // necesitas un estado nuevo
  };

  // Eliminar Evento
  const handleDeleteEvento = async (evento) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/eventos/${evento._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        setEventosData((prev) => prev.filter((ev) => ev._id !== evento._id));
        showToast("Evento eliminado correctamente ", "success");
        setConfirmDeleteEvento(null);
      } else {
        showToast("Error al eliminar evento ", "error");
      }
    } catch (error) {
      showToast("Error al eliminar evento ", "error");
    }
  };
  
  //reservas
  // 🔹 Cargar reservas al montar
  useEffect(() => {
    fetch("http://localhost:4000/api/reservas")
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error("Error cargando reservas:", err));
  }, []);

  // 🔹 Confirmar reserva
  const handleConfirmar = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${id}/confirmar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setReservas((prev) =>
          prev.map((r) => (r._id === id ? { ...r, estado: "confirmada" } : r))
        );
        showToast("Reserva confirmada correctamente", "success");
      }
    } catch (err) {
      console.error("Error confirmando:", err);
    }
  };

  // 🔹 Rechazar reserva
  const handleRechazar = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${id}/rechazar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setReservas((prev) =>
          prev.map((r) => (r._id === id ? { ...r, estado: "rechazada" } : r))
        );
        showToast("Reserva rechazada correctamente", "success");
      }
    } catch (err) {
      console.error("Error rechazando:", err);
    }
  };

  // 🔹 Eliminar reserva
  const handleDeleteReserva = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReservas((prev) => prev.filter((r) => r._id !== id));
        setConfirmDelete(null);
        showToast("Reserva eliminada correctamente", "success");
      }
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };
  
  // Cargar PQRS (contactos) desde backend
  useEffect(() => {
    if (activeSection === "pqrs") {
      const fetchContactos = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:4000/api/contactos", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          setPqrsData(data);
        } catch (error) {
          console.error("Error cargando PQRS:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchContactos();
    }
  }, [activeSection]);

  const handleDeleteContacto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/contactos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setPqrsData((prev) => prev.filter((p) => p._id !== id));
        showToast("PQRS eliminada correctamente ", "success");
      }
    } catch (error) {
      console.error("Error eliminando contacto:", error);
      showToast("Error eliminando PQRS ", "error");
    }
  };
  
  useEffect(() => {
    if (activeSection === "inventario") {
      const fetchInventario = async () => {
        try {
          setLoadingInventario(true);
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:4000/api/inventario", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          setInventarioData(data);
        } catch (error) {
          console.error("Error cargando inventario:", error);
        } finally {
          setLoadingInventario(false);
        }
      };
      fetchInventario();
    }
  }, [activeSection]);

  const handleDeleteEquipo = async (categoriaId, equipoId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:4000/api/inventario/${categoriaId}/equipos/${equipoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInventarioData(prev =>
        prev.map(cat =>
          cat._id === categoriaId
            ? { ...cat, equipos: cat.equipos.filter(eq => eq._id !== equipoId) }
            : cat
        )
      );
      setConfirmDeleteEquipo(null);
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
    }
  };
  
  
  // Componente Sidebar
  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-purple-900/95 to-gray-900/95 backdrop-blur-lg border-r border-purple-500/20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 px-4">
          <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all duration-300">
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </div>
  );

  // Componente Header
  const Header = () => (
    <div className="bg-gradient-to-r from-purple-900/20 to-gray-800/20 backdrop-blur-sm border-b border-purple-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Admin Usuario</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Principal
  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Usuarios</p>
              <p className="text-3xl font-bold text-white">{statsData.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400">+12%</span>
            <span className="text-gray-400 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-gray-800/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Reservas Confirmadas</p>
              <p className="text-3xl font-bold text-white">{statsData.reservasConfirmadas}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400">+8%</span>
            <span className="text-gray-400 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/20 to-gray-800/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Ingresos del Mes</p>
              <p className="text-3xl font-bold text-white">{formatPrice(statsData.ingresosMes)}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400">+23%</span>
            <span className="text-gray-400 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/20 to-gray-800/20 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Reservas Pendientes</p>
              <p className="text-3xl font-bold text-white">{statsData.reservasPendientes}</p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-400">Requieren atención</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Ventas y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Ventas Mensuales</h3>
          <div className="space-y-4">
            {ventasMensuales.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400">{item.mes}</span>
                <div className="flex items-center flex-1 mx-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                      style={{ width: `${(item.ventas / Math.max(...ventasMensuales.map(v => v.ventas))) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-white font-medium">{formatPrice(item.ventas)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Nueva reserva confirmada</p>
                <p className="text-gray-400 text-xs">Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <UserCheck className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Usuario registrado</p>
                <p className="text-gray-400 text-xs">Hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Package className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Equipo agregado al inventario</p>
                <p className="text-gray-400 text-xs">Hace 30 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-full">
                <MessageSquare className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Nueva PQRS recibida</p>
                <p className="text-gray-400 text-xs">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
          <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package2 className="h-6 w-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{statsData.eventosActivos}</p>
          <p className="text-gray-400 text-sm">Eventos Activos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
          <div className="bg-red-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{statsData.pqrsAbiertas}</p>
          <p className="text-gray-400 text-sm">PQRS Abiertas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
          <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-6 w-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{statsData.equiposDisponibles}</p>
          <p className="text-gray-400 text-sm">Equipos Disponibles</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
          <div className="bg-yellow-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{statsData.satisfaccionClientes}%</p>
          <p className="text-gray-400 text-sm">Satisfacción</p>
        </div>
      </div>
    </div>
  );

  ///////////////////////////////////////
  // USUARIOS////////////////////////////
  ///////////////////////////////////////


  const filteredUsers = userData.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
  
    const matchesRole =
      roleFilter === "Todos los roles" || user.rol === roleFilter;
  
    const matchesStatus =
      statusFilter === "Todos los estados" ||
      (statusFilter === "Activo" && user.estado) ||
      (statusFilter === "Inactivo" && !user.estado);
  
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const toggleEstado = async (user) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/usuarios/${user._id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: !user.estado }),
      });
      const data = await res.json();
    
      setUserData((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, estado: data.usuario.estado } : u
        )
      );
    
      showToast(
        `Usuario ${data.usuario.estado ? "activado" : "inactivado"} correctamente ⚡`,
        "success"
      );
    } catch (error) {
      showToast("Error cambiando estado ", "error");
    }    
  };
  
    // Editar
    const handleEdit = (user) => {
      setEditingUser(user);
    };

    //delate
    const handleDelete = async (user) => {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:4000/api/usuarios/${user._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
            setUserData((prev) => prev.filter((u) => u._id !== user._id));
        showToast("Usuario eliminado correctamente ", "success");
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        showToast("Error al eliminar usuario ", "error");
      } finally {
        setConfirmDeleteUser(null); 
      }
    };
    
    
  


  // Gestión de Usuarios
  const UsuariosContent = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
      </div>

      {/* Filtros */}
      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option>Todos los roles</option>
            <option>admin</option>
            <option>cliente</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("Todos los roles");
              setStatusFilter("Todos los estados");
            }}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600/20 border-b border-purple-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Fecha Registro</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-purple-600/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                          user.estado
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {user.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("es-CO")
                        : "Sin registro"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center justify-center space-x-3">
                        {/* Botón de estado */}
                        <button onClick={() => toggleEstado(user)}>
                          <div
                            className={`h-5 w-5 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                              user.estado
                                ? "bg-green-500 border-green-600 hover:bg-green-600"
                                : "bg-red-500 border-red-600 hover:bg-red-600"
                            }`}
                          />
                        </button>
                        {/* Botón Editar */}
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setConfirmDeleteUser(user)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


  ///////////////////////////////////////////////////////////////////////Eventos//////////////////////////////////////////////////////////////


  const filteredEventos = eventosData.filter((evento) => {
    const matchesSearch = evento.title.toLowerCase().includes(searchEvento.toLowerCase());
    const matchesTipo = tipoFilter === "Todos los tipos" || evento.type === tipoFilter;
    const matchesStatus =
      statusFilterEvento === "Todos los estados" || evento.status === statusFilterEvento;
  
    return matchesSearch && matchesTipo && matchesStatus;
  });
  

  // Gestión de Eventos
  const EventosContent = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Eventos</h2>
      </div>
  
      {/* Filtros */}
      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Buscar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar evento..."
              value={searchEvento}
              onChange={(e) => setSearchEvento(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
  
          {/* Tipo */}
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
          >
            <option>Todos los tipos</option>
            <option>Musical</option>
            <option>Corporativo</option>
            <option>Teatral</option>
            <option>Conferencia</option>
          </select>
  
          {/* Estado */}
          <select
            value={statusFilterEvento}
            onChange={(e) => setStatusFilterEvento(e.target.value)}
            className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
          >
            <option>Todos los estados</option>
            <option>próximo</option>
            <option>finalizado</option>
            <option>cancelado</option>
          </select>
  
          {/* Limpiar */}
          <button
            onClick={() => {
              setSearchEvento("");
              setTipoFilter("Todos los tipos");
              setStatusFilterEvento("Todos los estados");
            }}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
  
      {/* Tabla */}
      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600/20 border-b border-purple-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Título</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Hora</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Ubicación</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-400">Cargando eventos...</td>
                </tr>
              ) : filteredEventos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-400">No se encontraron eventos</td>
                </tr>
              ) : (
                filteredEventos.map((evento) => (
                  <tr key={evento._id} className="hover:bg-purple-600/10 transition-colors">
                    <td className="px-6 py-4">{evento.title}</td>
                    <td className="px-6 py-4">{new Date(evento.date).toLocaleDateString("es-CO")}</td>
                    <td className="px-6 py-4">{evento.time}</td>
                    <td className="px-6 py-4">{evento.type}</td>
                    <td className="px-6 py-4">{evento.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                        evento.status === "próximo"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : evento.status === "finalizado"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>
                        {evento.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button
                        onClick={() => setEditingEvento(evento)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteEvento(evento)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  /////////////////////////////////////////////////////////////////////////////// PQRS- CONTACTO //////////////////////////////////////////////////////

  // PQRS Content
  const PQRSContent = () => {
    const [searchPQRS, setSearchPQRS] = useState("");
    const [tipoPQRSFilter, setTipoPQRSFilter] = useState("Todos");
    const [tipoSolicitudFilter, setTipoSolicitudFilter] = useState("Todos");
  
    const filteredPQRS = pqrsData.filter((pqrs) => {
      const matchesSearch =
        pqrs.nombre.toLowerCase().includes(searchPQRS.toLowerCase()) ||
        pqrs.email.toLowerCase().includes(searchPQRS.toLowerCase()) ||
        pqrs.mensaje.toLowerCase().includes(searchPQRS.toLowerCase());
  
      const matchesTipoPQRS =
        tipoPQRSFilter === "Todos" || pqrs.tipoPQRS === tipoPQRSFilter;
  
      const matchesTipoSolicitud =
        tipoSolicitudFilter === "Todos" ||
        pqrs.tipoSolicitud === tipoSolicitudFilter;
  
      return matchesSearch && matchesTipoPQRS && matchesTipoSolicitud;
    });
  
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Gestión de PQRS</h2>
        </div>
  
        {/* Filtros */}
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Buscar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar PQRS..."
                value={searchPQRS}
                onChange={(e) => setSearchPQRS(e.target.value)}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
  
            {/* Tipo PQRS */}
            <select
              value={tipoPQRSFilter}
              onChange={(e) => setTipoPQRSFilter(e.target.value)}
              className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
            >
              <option>Todos</option>
              <option>peticion</option>
              <option>queja</option>
              <option>reclamo</option>
              <option>sugerencia</option>
            </select>
  
            {/* Tipo Solicitud */}
            <select
              value={tipoSolicitudFilter}
              onChange={(e) => setTipoSolicitudFilter(e.target.value)}
              className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
            >
              <option>Todos</option>
              <option>información</option>
              <option>cotización</option>
            </select>
  
            {/* Limpiar */}
            <button
              onClick={() => {
                setSearchPQRS("");
                setTipoPQRSFilter("Todos");
                setTipoSolicitudFilter("Todos");
              }}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
  
        {/* Tabla */}
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-600/20 border-b border-purple-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Teléfono</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Empresa</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Tipo Solicitud</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Tipo PQRS</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Fecha</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-purple-300 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-400">Cargando PQRS...</td>
                  </tr>
                ) : filteredPQRS.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-400">No se encontraron PQRS</td>
                  </tr>
                ) : (
                  filteredPQRS.map((pqrs) => (
                    <tr key={pqrs._id} className="hover:bg-purple-600/10 transition-colors">
                      <td className="px-6 py-4">{pqrs.nombre}</td>
                      <td className="px-6 py-4">{pqrs.email}</td>
                      <td className="px-6 py-4">{pqrs.telefono}</td>
                      <td className="px-6 py-4">{pqrs.empresa}</td>
                      <td className="px-6 py-4">{pqrs.tipoSolicitud}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                          pqrs.tipoPQRS === "peticion"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : pqrs.tipoPQRS === "queja"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : pqrs.tipoPQRS === "reclamo"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-green-500/20 text-green-400 border-green-500/30"
                        }`}>
                          {pqrs.tipoPQRS}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(pqrs.fecha).toLocaleDateString("es-CO")}</td>
                      <td className="px-6 py-4 flex items-center justify-center gap-3">
                        <button
                          onClick={() => setPqrsSeleccionada(pqrs)}
                          className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg"
                        >
                          <Eye className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => setConfirmDeletePQRS(pqrs)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////// RESERVAS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 🔹 Filtrar reservas
  useEffect(() => {
    let reservas = [...reservasData];

    if (search) {
      reservas = reservas.filter(
        (r) =>
          r.nombreEvento.toLowerCase().includes(search.toLowerCase()) ||
          r.nombreCliente.toLowerCase().includes(search.toLowerCase()) ||
          r.emailCliente.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (estadoFilter !== "Todos") {
      reservas = reservas.filter((r) => r.estado.toLowerCase() === estadoFilter.toLowerCase());
    }

    if (tipoFilter !== "Todos") {
      reservas = reservas.filter((r) => r.tipoEvento.toLowerCase() === tipoFilter.toLowerCase());
    }

    if (fechaFilter) {
      reservas = reservas.filter((r) => r.fechaEvento === fechaFilter);
    }

    setFilteredReservas(reservas);
  }, [search, estadoFilter, tipoFilter, fechaFilter, reservasData]);

  // 🔹 Contadores
  const pendientesCount = reservasData.filter((r) => r.estado === "pendiente").length;
  const confirmadasCount = reservasData.filter((r) => r.estado === "confirmada").length;


  // Reservas Content
  const ReservasContent = () => (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Reservas</h2>
        <div className="flex space-x-3">
          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-sm font-semibold">
            {pendientesCount} Pendientes
          </span>
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm font-semibold">
            {confirmadasCount} Confirmadas
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar reserva..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option>Todos</option>
            <option>Pendiente</option>
            <option>Confirmada</option>
            <option>Completada</option>
            <option>Cancelada</option>
          </select>
          <input
            type="date"
            value={fechaFilter}
            onChange={(e) => setFechaFilter(e.target.value)}
            className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option>Todos</option>
            <option>Boda</option>
            <option>Corporativo</option>
            <option>Cumpleaños</option>
            <option>Conferencia</option>
            <option>Concierto</option>
          </select>
          <button
            onClick={() => {
              setSearch("");
              setEstadoFilter("Todos");
              setTipoFilter("Todos");
              setFechaFilter("");
            }}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-purple-500/20">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-900/50">
          <thead className="bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Evento</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Horario</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Ubicación</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Invitados</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Cliente</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Contacto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">Total</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-purple-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
            {filteredReservas.length > 0 ? (
              filteredReservas.map((reserva) => (
                <tr key={reserva._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{reserva.nombreEvento}</td>
                  <td className="px-4 py-3 capitalize">{reserva.tipoEvento}</td>
                  <td className="px-4 py-3">{reserva.fechaEvento}</td>
                  <td className="px-4 py-3">{reserva.horaInicio} - {reserva.horaFin}</td>
                  <td className="px-4 py-3">{reserva.ubicacion}</td>
                  <td className="px-4 py-3">{reserva.numeroInvitados}</td>
                  <td className="px-4 py-3">{reserva.nombreCliente}</td>
                  <td className="px-4 py-3">
                    <div>{reserva.emailCliente}</div>
                    <div className="text-gray-400 text-xs">{reserva.telefonoCliente}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      reserva.estado === "pendiente"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : reserva.estado === "confirmada"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : reserva.estado === "cancelada"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }`}>
                      {reserva.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-400">{formatPrice(reserva.total)}</td>
                  <td className="px-4 py-3 flex items-center justify-center gap-2">
                  <td className="px-4 py-3 flex items-center justify-center gap-2">
                        <button onClick={() => setReservaSeleccionada(reserva)} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg">
                          <Eye className="h-4 w-4 text-white" />
                        </button>
                        {reserva.estado === "pendiente" && (
                          <>
                            <button onClick={() => setConfirmarReservaId(reserva._id)} className="bg-green-600 hover:bg-green-700 p-2 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </button>
                            <button onClick={() => setRechazarReservaId(reserva._id)} className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded-lg">
                              <XCircle className="h-4 w-4 text-white" />
                            </button>
                          </>
                        )}
                        <button onClick={() => setConfirmDelete(reserva)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg">
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </td>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-6 text-gray-400 italic">
                  No hay reservas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

//////////////////////////////////////////////////////////////// INVENTARIO //////////////////////////////////////////////////////////////////////////////////

const InventarioContent = () => {
  const equiposPlanos = inventarioData.flatMap(cat =>
    cat.equipos.map(eq => ({
      ...eq,
      _id: eq._id || eq.id, 
      categoria: cat.nombre,
      categoriaId: cat._id
    }))
  );
  

  // Aplicar filtros
  const equiposFiltrados = equiposPlanos.filter(eq => {
    const coincideCategoria = categoriaFiltro === "all" || eq.categoria === categoriaFiltro;
    const coincideEstado = estadoFiltro === "all" || eq.estado === estadoFiltro;
    const coincideBusqueda = eq.nombre.toLowerCase().includes(busquedaInventario.toLowerCase());
    return coincideCategoria && coincideEstado && coincideBusqueda;
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Gestión de Inventario</h2>

     {/* Filtros */}
<div className="flex flex-wrap gap-4 items-center">
  <input
    type="text"
    placeholder="Buscar equipo..."
    value={busquedaInventario}
    onChange={(e) => setBusquedaInventario(e.target.value)}
    className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-purple-500/30 focus:ring-2 focus:ring-purple-500"
  />
  <select
    value={categoriaFiltro}
    onChange={(e) => setCategoriaFiltro(e.target.value)}
    className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-purple-500/30"
  >
    <option value="all">Todas las categorías</option>
    {inventarioData.map(cat => (
      <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
    ))}
  </select>
  <select
    value={estadoFiltro}
    onChange={(e) => setEstadoFiltro(e.target.value)}
    className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-purple-500/30"
  >
    <option value="all">Todos los estados</option>
    <option value="Activo">Activo</option>
    <option value="En mantenimiento">En mantenimiento</option>
    <option value="No disponible">No disponible</option>
  </select>

  {/* Botón limpiar */}
  <button
    onClick={() => {
      setBusquedaInventario("");
      setCategoriaFiltro("all");
      setEstadoFiltro("all");
    }}
    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md min-w-[150px]"
  >
    Limpiar filtros
  </button>
</div>



      {/* Tabla */}
      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600/20 border-b border-purple-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Equipo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase">Estado</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-purple-300 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/20">
              {equiposFiltrados.map(eq => (
                <tr key={eq._id} className="hover:bg-purple-900/10">
                  <td className="px-6 py-4 text-white">{eq.categoria}</td>
                  <td className="px-6 py-4 text-white">{eq.nombre}</td>
                  <td className="px-6 py-4 text-white">${eq.precio.toLocaleString()}</td>
                  <td className="px-6 py-4 text-white">
                    {eq.stock} / <span className="text-sm text-gray-400">min {eq.stockMinimo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      eq.estado === "Activo" ? "bg-green-600/30 text-green-400" :
                      eq.estado === "En mantenimiento" ? "bg-yellow-600/30 text-yellow-400" :
                      "bg-red-600/30 text-red-400"
                    }`}>
                      {eq.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setEquipoSeleccionado(eq)}
                      className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg"
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteEquipo(eq)}
                      className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
              {equiposFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No hay equipos que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



  // Reportes Content
  const ReportesContent = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Reportes y Análisis</h2>
      
      {/* Opciones de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 cursor-pointer">
          <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Reporte de Ventas</h3>
          <p className="text-gray-400 text-sm mb-4">Análisis detallado de ingresos y tendencias de ventas mensuales</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold transition-all duration-300">
            Generar Reporte
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-gray-800/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 cursor-pointer">
          <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <UsersIcon className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Reporte de Usuarios</h3>
          <p className="text-gray-400 text-sm mb-4">Estadísticas de registros, actividad y segmentación de usuarios</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-all duration-300">
            Generar Reporte
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-900/20 to-gray-800/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 cursor-pointer">
          <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Reporte de Inventario</h3>
          <p className="text-gray-400 text-sm mb-4">Estado de equipos, disponibilidad y rotación de inventario</p>
          <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition-all duration-300">
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Gráficos de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Reservas por Mes</h3>
          <div className="space-y-3">
            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((mes, index) => {
              const value = [45, 62, 58, 73, 69, 84][index];
              return (
                <div key={mes} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{mes}</span>
                  <div className="flex items-center flex-1 mx-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white font-medium text-sm">{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Equipos Más Solicitados</h3>
          <div className="space-y-4">
            {[
              { equipo: 'Altavoz JBL PRX815W', solicitudes: 45, categoria: 'Audio' },
              { equipo: 'Reflector LED Par 64', solicitudes: 38, categoria: 'Iluminación' },
              { equipo: 'CDJ-3000', solicitudes: 32, categoria: 'DJ Equipment' },
              { equipo: 'Micrófono Shure SM58', solicitudes: 28, categoria: 'Audio' },
              { equipo: 'Proyector 4K', solicitudes: 24, categoria: 'Video' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.equipo}</h4>
                    <span className="text-xs text-purple-400">{item.categoria}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-400">{item.solicitudes}</p>
                    <p className="text-xs text-gray-400">solicitudes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas Financieras */}
      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Métricas Financieras</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{formatPrice(145750000)}</div>
            <div className="text-gray-400 text-sm">Ingresos Totales (6 meses)</div>
            <div className="text-green-400 text-xs mt-1">+18% vs período anterior</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{formatPrice(24250000)}</div>
            <div className="text-gray-400 text-sm">Promedio Mensual</div>
            <div className="text-blue-400 text-xs mt-1">Estable</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">342</div>
            <div className="text-gray-400 text-sm">Reservas Completadas</div>
            <div className="text-purple-400 text-xs mt-1">+15% vs período anterior</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{formatPrice(425438)}</div>
            <div className="text-gray-400 text-sm">Ticket Promedio</div>
            <div className="text-yellow-400 text-xs mt-1">+5% vs período anterior</div>
          </div>
        </div>
      </div>
    </div>
  );



  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'usuarios':
        return <UsuariosContent />;
      case 'eventos':
        return <EventosContent />;
      case 'pqrs':
        return <PQRSContent />;
      case 'reservas':
        return <ReservasContent />;
      case 'reportes':
        return <ReportesContent />;
      case 'inventario': 
        return <InventarioContent />;
      default:
        return <DashboardContent />;
    }
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg transition-all duration-300
          ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

{editingUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md border border-purple-500/30">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">Editar Usuario</h2>

      <div className="space-y-4">
        <input
          type="text"
          value={editingUser.firstName}
          onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
          placeholder="Nombre"
        />
        <input
          type="text"
          value={editingUser.lastName}
          onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
          placeholder="Apellido"
        />
        <input
          type="email"
          value={editingUser.email}
          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
          placeholder="Correo"
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setEditingUser(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              await fetch(`http://localhost:4000/api/usuarios/${editingUser._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  firstName: editingUser.firstName,
                  lastName: editingUser.lastName,
                  email: editingUser.email,
                  phone: editingUser.phone,
                }),
              });              
                setUserData((prev) =>
                prev.map((u) => (u._id === editingUser._id ? editingUser : u))
              );
            
              showToast("Usuario actualizado correctamente ✅", "success");
              setEditingUser(null);
            } catch (error) {
              showToast("Error al actualizar usuario ", "error");
            }            
          }}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-white font-semibold transition-all"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

{confirmDeleteUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-red-500/30 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Confirmar eliminación</h2>
      <p className="text-gray-300 mb-6">
        ¿Seguro que deseas eliminar a <span className="font-semibold text-white">{confirmDeleteUser.firstName}</span>?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setConfirmDeleteUser(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => handleDelete(confirmDeleteUser)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold transition-all"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}


{/* Modal Editar Evento */}
{editingEvento && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 overflow-y-auto">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-3xl border border-purple-500/30 my-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">Editar Evento</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Título */}
        <input
          type="text"
          value={editingEvento.title}
          onChange={(e) => setEditingEvento({ ...editingEvento, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
          placeholder="Título"
        />

        {/* Fecha */}
        <input
          type="date"
          value={new Date(editingEvento.date).toISOString().split("T")[0]}
          onChange={(e) => setEditingEvento({ ...editingEvento, date: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
        />

        {/* Hora */}
        <input
          type="text"
          value={editingEvento.time}
          onChange={(e) => setEditingEvento({ ...editingEvento, time: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
          placeholder="Hora (ej: 20:00 - 22:30)"
        />

        {/* Tipo */}
        <input
          type="text"
          value={editingEvento.type}
          onChange={(e) => setEditingEvento({ ...editingEvento, type: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
          placeholder="Tipo (ej: Musical, Conferencia)"
        />

        {/* Ubicación */}
        <input
          type="text"
          value={editingEvento.location}
          onChange={(e) => setEditingEvento({ ...editingEvento, location: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
          placeholder="Ubicación"
        />

        {/* Invitados */}
        <input
          type="number"
          value={editingEvento.guests}
          onChange={(e) => setEditingEvento({ ...editingEvento, guests: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
          placeholder="Número de invitados"
        />

        {/* Estado */}
        <select
          value={editingEvento.status}
          onChange={(e) => setEditingEvento({ ...editingEvento, status: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
        >
          <option value="próximo">Próximo</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        {/* Presupuesto */}
        <input
          type="text"
          value={editingEvento.budget}
          onChange={(e) => setEditingEvento({ ...editingEvento, budget: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
          placeholder="Presupuesto"
        />

        {/* Imagen */}
        <input
          type="text"
          value={editingEvento.image}
          onChange={(e) => setEditingEvento({ ...editingEvento, image: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
          placeholder="URL de imagen principal"
        />
      </div>

      {/* Descripción */}
      <textarea
        value={editingEvento.description}
        onChange={(e) => setEditingEvento({ ...editingEvento, description: e.target.value })}
        className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
        rows="3"
        placeholder="Descripción"
      />

      {/* Servicios */}
      <textarea
        value={editingEvento.services?.join(", ")}
        onChange={(e) =>
          setEditingEvento({ ...editingEvento, services: e.target.value.split(",").map(s => s.trim()) })
        }
        className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
        rows="2"
        placeholder="Servicios (separados por coma)"
      />

      {/* Equipos */}
      <textarea
        value={editingEvento.equipment?.join(", ")}
        onChange={(e) =>
          setEditingEvento({ ...editingEvento, equipment: e.target.value.split(",").map(eq => eq.trim()) })
        }
        className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
        rows="2"
        placeholder="Equipos (separados por coma)"
      />

      {/* Galería */}
      <textarea
        value={editingEvento.gallery?.join(", ")}
        onChange={(e) =>
          setEditingEvento({ ...editingEvento, gallery: e.target.value.split(",").map(g => g.trim()) })
        }
        className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
        rows="2"
        placeholder="URLs de galería (separadas por coma)"
      />

      {/* Testimonio */}
      <textarea
        value={editingEvento.testimonial || ""}
        onChange={(e) => setEditingEvento({ ...editingEvento, testimonial: e.target.value })}
        className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 text-white"
        rows="2"
        placeholder="Testimonio"
      />

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setEditingEvento(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white"
        >
          Cancelar
        </button>
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`http://localhost:4000/api/eventos/${editingEvento._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editingEvento),
              });

              if (!res.ok) {
                const errorData = await res.json();
                showToast(errorData.message || "Error al actualizar evento ❌", "error");
                return;
              }

              const data = await res.json();
              setEventosData((prev) =>
                prev.map((ev) => (ev._id === editingEvento._id ? data.evento : ev))
              );
              showToast("Evento actualizado correctamente ✅", "success");
              setEditingEvento(null);
            } catch (error) {
              showToast("Error al actualizar evento ❌", "error");
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-white font-semibold"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
)}


{/* Modal Eliminar Evento */}
{confirmDeleteEvento && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-red-500/30 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Confirmar eliminación</h2>
      <p className="text-gray-300 mb-6">
        ¿Seguro que deseas eliminar el evento{" "}
        <span className="font-semibold text-white">{confirmDeleteEvento.title}</span>?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setConfirmDeleteEvento(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white"
        >
          Cancelar
        </button>
        <button
          onClick={() => handleDeleteEvento(confirmDeleteEvento)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}
{reservaSeleccionada && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 overflow-y-auto">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-3xl border border-purple-500/30 my-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">Detalles de la Reserva</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Nombre del Evento</h3>
          <p>{reservaSeleccionada.nombreEvento}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Tipo de Evento</h3>
          <p className="capitalize">{reservaSeleccionada.tipoEvento}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Fecha</h3>
          <p>{reservaSeleccionada.fechaEvento}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Horario</h3>
          <p>{reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Ubicación</h3>
          <p>{reservaSeleccionada.ubicacion}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Dirección</h3>
          <p>{reservaSeleccionada.direccion}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Invitados</h3>
          <p>{reservaSeleccionada.numeroInvitados}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Estado</h3>
          <p className="capitalize">{reservaSeleccionada.estado}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Cliente</h3>
          <p>{reservaSeleccionada.nombreCliente}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Correo</h3>
          <p>{reservaSeleccionada.emailCliente}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Teléfono</h3>
          <p>{reservaSeleccionada.telefonoCliente}</p>
        </div>
        {reservaSeleccionada.empresaCliente && (
          <div>
            <h3 className="font-semibold text-purple-300 mb-1">Empresa</h3>
            <p>{reservaSeleccionada.empresaCliente}</p>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Presupuesto Estimado</h3>
          <p>{reservaSeleccionada.presupuestoEstimado || "No especificado"}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Total</h3>
          <p className="text-green-400 font-bold">{formatPrice(reservaSeleccionada.total)}</p>
        </div>
        <div className="md:col-span-2">
          <h3 className="font-semibold text-purple-300 mb-1">Equipos Seleccionados</h3>
          {reservaSeleccionada.equiposSeleccionados?.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {reservaSeleccionada.equiposSeleccionados.map((equipo, index) => (
                <li key={index}>
                  <span className="font-semibold">{equipo.nombre}</span> (x{equipo.cantidad}) - {formatPrice(equipo.precio)}
                  <p className="text-gray-400 text-sm">{equipo.descripcion}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Sin equipos asignados.</p>
          )}
        </div>
        <div className="md:col-span-2">
          <h3 className="font-semibold text-purple-300 mb-1">Descripción del Evento</h3>
          <p className="text-gray-300">{reservaSeleccionada.descripcionEvento || "No hay descripción."}</p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setReservaSeleccionada(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{confirmarReservaId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm border border-green-500/30 text-center">
      <h2 className="text-xl font-bold text-green-400 mb-4">Confirmar Reserva</h2>
      <p className="text-gray-300 mb-6">¿Deseas confirmar esta reserva?</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setConfirmarReservaId(null)} className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white">
          Cancelar
        </button>
        <button
          onClick={() => {
            handleConfirmar(confirmarReservaId);
            setConfirmarReservaId(null);
          }}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}
{rechazarReservaId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm border border-yellow-500/30 text-center">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Rechazar Reserva</h2>
      <p className="text-gray-300 mb-6">¿Seguro que deseas rechazar esta reserva?</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setRechazarReservaId(null)} className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white">
          Cancelar
        </button>
        <button
          onClick={() => {
            handleRechazar(rechazarReservaId);
            setRechazarReservaId(null);
          }}
          className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white font-semibold"
        >
          Rechazar
        </button>
      </div>
    </div>
  </div>
)}
{confirmDelete && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm border border-red-500/30 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Eliminar Reserva</h2>
      <p className="text-gray-300 mb-6">
        ¿Estás seguro de que deseas eliminar la reserva de <span className="font-semibold text-white">{confirmDelete.nombreEvento}</span>?
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setConfirmDelete(null)} className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white">
          Cancelar
        </button>
        <button
          onClick={() => handleDeleteReserva(confirmDelete._id)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal Ver PQRS */}
{pqrsSeleccionada && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 overflow-y-auto">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-purple-500/30 my-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">Detalle de PQRS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Nombre</p>
          <p className="text-white font-medium">{pqrsSeleccionada.nombre}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Email</p>
          <p className="text-white font-medium">{pqrsSeleccionada.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Teléfono</p>
          <p className="text-white font-medium">{pqrsSeleccionada.telefono}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Empresa</p>
          <p className="text-white font-medium">{pqrsSeleccionada.empresa || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Tipo Solicitud</p>
          <p className="text-white font-medium">{pqrsSeleccionada.tipoSolicitud}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Tipo PQRS</p>
          <p className="text-white font-medium">{pqrsSeleccionada.tipoPQRS}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Fecha Evento</p>
          <p className="text-white font-medium">{pqrsSeleccionada.fechaEvento || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Número de Invitados</p>
          <p className="text-white font-medium">{pqrsSeleccionada.numeroInvitados || "N/A"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-400">Ubicación</p>
          <p className="text-white font-medium">{pqrsSeleccionada.ubicacion || "N/A"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-400">Mensaje</p>
          <p className="text-white font-medium">{pqrsSeleccionada.mensaje}</p>
        </div>
        {pqrsSeleccionada.serviciosInteres?.length > 0 && (
          <div className="md:col-span-2">
            <p className="text-sm text-gray-400">Servicios de Interés</p>
            <ul className="list-disc list-inside text-white font-medium">
              {pqrsSeleccionada.serviciosInteres.map((serv, i) => (
                <li key={i}>{serv}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setPqrsSeleccionada(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal Confirmar Eliminar PQRS */}
{confirmDeletePQRS && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-red-500/30 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Confirmar eliminación</h2>
      <p className="text-gray-300 mb-6">
        ¿Seguro que deseas eliminar la PQRS de <span className="font-semibold text-white">{confirmDeletePQRS.nombre}</span>?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setConfirmDeletePQRS(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => handleDeleteContacto(confirmDeletePQRS._id)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold transition-all"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal Ver Equipo */}
{equipoSeleccionado && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 overflow-y-auto">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-lg border border-purple-500/30 my-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">Detalle de Equipo</h2>
      <p className="text-white"><span className="text-gray-400">Categoría:</span> {equipoSeleccionado.categoria}</p>
      <p className="text-white"><span className="text-gray-400">Nombre:</span> {equipoSeleccionado.nombre}</p>
      <p className="text-white"><span className="text-gray-400">Descripción:</span> {equipoSeleccionado.descripcion}</p>
      <p className="text-white"><span className="text-gray-400">Precio:</span> ${equipoSeleccionado.precio.toLocaleString()}</p>
      <p className="text-white"><span className="text-gray-400">Stock:</span> {equipoSeleccionado.stock} (mín {equipoSeleccionado.stockMinimo})</p>
      <p className="text-white"><span className="text-gray-400">Estado:</span> {equipoSeleccionado.estado}</p>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setEquipoSeleccionado(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal Confirmar Eliminar */}
{confirmDeleteEquipo && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-red-500/30 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Confirmar eliminación</h2>
      <p className="text-gray-300 mb-6">
        ¿Seguro que deseas eliminar <span className="font-semibold text-white">{confirmDeleteEquipo.nombre}</span>?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setConfirmDeleteEquipo(null)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white"
        >
          Cancelar
        </button>
        <button
          onClick={() => handleDeleteEquipo(confirmDeleteEquipo.categoriaId, confirmDeleteEquipo._id)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AdminDashboard;