import React, { useState, useEffect, useCallback } from "react";
import { Users, Search, Plus, Edit2, Trash2, Calendar, Filter } from "lucide-react";
import EditColaboradorModal from "./modals/EditColaboradorModal";
import ConfirmModal from "./modals/ConfirmModal";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const ColaboradoresContent = ({ showToast }) => {
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [disponibilidadFilter, setDisponibilidadFilter] = useState("");
  const [especialidadFilter, setEspecialidadFilter] = useState("");

  // Función para obtener colaboradores con paginación - MEMOIZADA
  const fetchColaboradores = useCallback(async (params) => {
    try {
      const searchParams = new URLSearchParams();
      
      // Agregar parámetros de paginación
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      
      // Agregar filtros
      if (params.search) searchParams.append('search', params.search);
      if (params.rol) searchParams.append('rol', params.rol);
      if (params.estado) searchParams.append('estado', params.estado);
      if (params.disponibilidad) searchParams.append('disponibilidad', params.disponibilidad);
      if (params.especialidad) searchParams.append('especialidad', params.especialidad);

      const response = await fetch(`http://localhost:4000/api/colaboradores?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Error al cargar colaboradores');

      return await response.json();
    } catch (error) {
      console.error('Error fetching colaboradores:', error);
      throw error;
    }
  }, []);

  // Hook de paginación
  const {
    data: colaboradores,
    pagination,
    loading,
    error,
    goToPage,
    changeItemsPerPage,
    applyFilters,
    refresh
  } = usePagination(fetchColaboradores, {}, 10);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filters = {
      search: searchTerm,
      rol: rolFilter,
      estado: estadoFilter,
      disponibilidad: disponibilidadFilter,
      especialidad: especialidadFilter
    };
    applyFilters(filters);
  }, [searchTerm, rolFilter, estadoFilter, disponibilidadFilter, especialidadFilter, applyFilters]);

  // Lista de especialidades únicas para el filtro
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    // Extraer especialidades únicas de los colaboradores
    const uniqueEspecialidades = [...new Set(colaboradores.map(c => c.especialidad))];
    setEspecialidades(uniqueEspecialidades);
  }, [colaboradores]);

  const handleDeleteColaborador = async (colaborador) => {
    try {
      await fetch(`http://localhost:4000/api/colaboradores/${colaborador._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      refresh(); // Recargar datos después de eliminar
      showToast("Colaborador eliminado correctamente");
      setConfirmDelete(null);
    } catch (error) {
      showToast("Error al eliminar el colaborador", "error");
    }
  };

  const handleModalClose = (updatedColaborador) => {
    if (updatedColaborador) {
      refresh(); // Recargar datos después de crear/actualizar
    }
    setEditingColaborador(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Users className="h-6 w-6 text-purple-500 mr-2" />
          Gestión de Colaboradores
        </h2>
        <button
          onClick={() => setEditingColaborador({})}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" /> <span>Nuevo Colaborador</span>
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="relative col-span-full xl:col-span-3">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white"
          />
        </div>

        <select
          value={rolFilter}
          onChange={(e) => setRolFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los roles</option>
          <option value="tecnico">Técnico</option>
          <option value="supervisor">Supervisor</option>
          <option value="coordinador">Coordinador</option>
        </select>

        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="suspendido">Suspendido</option>
        </select>

        <select
          value={disponibilidadFilter}
          onChange={(e) => setDisponibilidadFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Disponibilidad</option>
          <option value="disponible">Disponible</option>
          <option value="ocupado">Ocupado</option>
          <option value="vacaciones">Vacaciones</option>
        </select>
      </div>

      {/* Tabla de colaboradores */}
      <div className="overflow-x-auto border border-purple-500/20 rounded-xl">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-purple-600/20">
            <tr>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Teléfono</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-left">Especialidad</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Disponibilidad</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
                    <span>Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-red-400">
                  Error: {error}
                </td>
              </tr>
            ) : colaboradores.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No hay colaboradores que coincidan con los filtros
                </td>
              </tr>
            ) : (
              colaboradores.map((colaborador) => (
                <tr key={colaborador._id} className="border-b border-purple-500/10">
                  <td className="px-6 py-4">{colaborador.nombre}</td>
                  <td className="px-6 py-4">{colaborador.email}</td>
                  <td className="px-6 py-4">{colaborador.telefono}</td>
                  <td className="px-6 py-4 capitalize">{colaborador.rol}</td>
                  <td className="px-6 py-4">{colaborador.especialidad}</td>
                  <td className="px-6 py-4 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        colaborador.estado === "activo"
                          ? "bg-green-600/30 text-green-400"
                          : colaborador.estado === "inactivo"
                          ? "bg-red-600/30 text-red-400"
                          : "bg-yellow-600/30 text-yellow-400"
                      }`}
                    >
                      {colaborador.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        colaborador.disponibilidad === "disponible"
                          ? "bg-green-600/30 text-green-400"
                          : colaborador.disponibilidad === "ocupado"
                          ? "bg-red-600/30 text-red-400"
                          : "bg-blue-600/30 text-blue-400"
                      }`}
                    >
                      {colaborador.disponibilidad}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingColaborador(colaborador)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(colaborador)}
                        className="text-red-400 hover:text-red-300"
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

      {/* Componente de paginación */}
      <Pagination
        pagination={pagination}
        onPageChange={goToPage}
        onItemsPerPageChange={changeItemsPerPage}
      />

      {/* Modales */}
      {editingColaborador && (
        <EditColaboradorModal
          colaborador={editingColaborador}
          onClose={handleModalClose}
          showToast={showToast}
        />
      )}
      
      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar colaborador"
        message={`¿Estás seguro de que deseas eliminar a "${confirmDelete?.nombre}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => handleDeleteColaborador(confirmDelete)}
      />
    </div>
  );
};

export default ColaboradoresContent;