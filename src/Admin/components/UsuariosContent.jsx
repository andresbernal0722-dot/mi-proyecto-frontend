import React, { useState, useEffect, useCallback } from "react";
import { User, Search, Edit, ChevronDown, ChevronUp } from "lucide-react";
import EditUserModal from "./modals/EditUserModal";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const UsuariosContent = ({ showToast }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showHiddenUsers, setShowHiddenUsers] = useState(false);
  const [hiddenUsers, setHiddenUsers] = useState([]);
  const [loadingHidden, setLoadingHidden] = useState(false);

  // Función para obtener usuarios con paginación - MEMOIZADA
  const fetchUsuarios = useCallback(async (params) => {
    try {
      const token = localStorage.getItem("token");
      const searchParams = new URLSearchParams();
      
      // Agregar parámetros de paginación
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      
      // Agregar filtros
      if (params.search) searchParams.append('search', params.search);
      if (params.rol && params.rol !== "Todos los roles") searchParams.append('rol', params.rol);
      if (params.estado && params.estado !== "Todos los estados") {
        searchParams.append('estado', params.estado);
      }
      
      // IMPORTANTE: Excluir usuarios ocultos de la tabla principal
      // Solo mostrar Activo e Inactivo si no hay filtro de estado específico
      if (!params.estado || params.estado === "") {
        searchParams.append('estadoNot', 'Oculto');
      }

      const url = `http://localhost:4000/api/usuarios?${searchParams}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Error al obtener usuarios');
      
      const data = await res.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
  }, []);

  // Función para obtener usuarios ocultos
  const fetchHiddenUsers = async () => {
    setLoadingHidden(true);
    try {
      const token = localStorage.getItem("token");
      const searchParams = new URLSearchParams();
      searchParams.append('estado', 'Oculto');
      
      const url = `http://localhost:4000/api/usuarios?${searchParams}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Error al obtener usuarios ocultos');
      
      const data = await res.json();
      setHiddenUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching hidden usuarios:', error);
      showToast("Error al cargar usuarios ocultos", "error");
    } finally {
      setLoadingHidden(false);
    }
  };

  // Hook de paginación
  const {
    data: userData,
    pagination,
    loading,
    error,
    goToPage,
    changeItemsPerPage,
    applyFilters,
    refresh
  } = usePagination(fetchUsuarios, {}, 10);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filters = {
      search: searchTerm,
      rol: roleFilter,
      estado: statusFilter
    };
    applyFilters(filters);
  }, [searchTerm, roleFilter, statusFilter, applyFilters]);

  // Cargar usuarios ocultos cuando se despliega la sección
  useEffect(() => {
    if (showHiddenUsers) {
      fetchHiddenUsers();
    }
  }, [showHiddenUsers]);

  // Función para cambiar el estado del usuario (rotación entre activo, inactivo y oculto)
  const toggleEstado = async (user, isFromHiddenSection = false) => {
    try {
      const token = localStorage.getItem("token");
      
      // Determinar el siguiente estado
      let nuevoEstado;
      if (user.estado === "Activo" || user.estado === true) {
        nuevoEstado = "Inactivo";
      } else if (user.estado === "Inactivo" || user.estado === false) {
        nuevoEstado = "Oculto";
      } else {
        nuevoEstado = "Activo";
      }
      
      const res = await fetch(`http://localhost:4000/api/usuarios/${user._id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      
      if (!res.ok) throw new Error('Error al actualizar estado');
      
      // Recargar datos después de actualizar
      refresh();
      if (isFromHiddenSection) {
        fetchHiddenUsers();
      }
      showToast(`Estado cambiado a ${nuevoEstado}`, "success");
    } catch (error) {
      showToast("Error al cambiar estado", "error");
    }
  };

  // Función para obtener el estilo y texto del estado
  const getEstadoStyle = (estado) => {
    // Normalizar el estado a string
    const estadoStr = typeof estado === 'boolean' 
      ? (estado ? "Activo" : "Inactivo")
      : String(estado);
    
    switch (estadoStr) {
      case "Activo":
      case "true":
        return {
          className: "bg-green-600/30 text-green-400",
          text: "Activo"
        };
      case "Inactivo":
      case "false":
        return {
          className: "bg-red-600/30 text-red-400",
          text: "Inactivo"
        };
      case "Oculto":
        return {
          className: "bg-gray-600/30 text-gray-400",
          text: "Oculto"
        };
      default:
        return {
          className: "bg-gray-600/30 text-gray-400",
          text: estadoStr
        };
    }
  };

  const handleRefresh = () => {
    refresh();
    if (showHiddenUsers) {
      fetchHiddenUsers();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los roles</option>
          <option value="admin">admin</option>
          <option value="cliente">cliente</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Oculto">Oculto</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-purple-500/20">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-purple-600/20">
            <tr>
              <th className="px-6 py-4 text-left">Usuario</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-red-400">
                  Error: {error}
                </td>
              </tr>
            ) : userData.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              userData.map((user) => {
                const estadoStyle = getEstadoStyle(user.estado);
                return (
                  <tr key={user._id}>
                    <td className="px-6 py-3 flex items-center space-x-3">
                      <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td>{user.rol}</td>
                    <td>
                      <span
                        onClick={() => toggleEstado(user)}
                        className={`cursor-pointer px-2 py-1 rounded-full text-xs ${estadoStyle.className}`}
                        title="Click para cambiar estado"
                      >
                        {estadoStyle.text}
                      </span>
                    </td>
                    <td className="flex space-x-2 mt-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Sección de usuarios ocultos */}
      <div className="rounded-xl border border-purple-500/20 bg-gray-900/50">
        <button
          onClick={() => setShowHiddenUsers(!showHiddenUsers)}
          className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-purple-600/10 transition-colors"
        >
          <span className="font-medium">Usuarios Ocultos</span>
          {showHiddenUsers ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {showHiddenUsers && (
          <div className="border-t border-purple-500/20">
            {loadingHidden ? (
              <div className="p-6 text-center text-gray-400">
                Cargando usuarios ocultos...
              </div>
            ) : hiddenUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                Vacío
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left">Usuario</th>
                      <th className="px-6 py-4 text-left">Rol</th>
                      <th className="px-6 py-4 text-left">Estado</th>
                      <th className="px-6 py-4 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {hiddenUsers.map((user) => {
                      const estadoStyle = getEstadoStyle(user.estado);
                      return (
                        <tr key={user._id}>
                          <td className="px-6 py-3 flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                          </td>
                          <td>{user.rol}</td>
                          <td>
                            <span
                              onClick={() => toggleEstado(user, true)}
                              className={`cursor-pointer px-2 py-1 rounded-full text-xs ${estadoStyle.className}`}
                              title="Click para cambiar estado"
                            >
                              {estadoStyle.text}
                            </span>
                          </td>
                          <td className="flex space-x-2 mt-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-blue-400 hover:text-blue-300"
                              title="Editar usuario"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Componente de paginación */}
      <Pagination
        pagination={pagination}
        onPageChange={goToPage}
        onItemsPerPageChange={changeItemsPerPage}
      />

      <EditUserModal 
        user={editingUser} 
        onClose={() => setEditingUser(null)} 
        onUpdate={handleRefresh}
      />
    </div>
  );
};

export default UsuariosContent;