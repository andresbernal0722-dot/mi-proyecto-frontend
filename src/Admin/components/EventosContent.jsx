import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Edit, Trash2, Plus, Search } from "lucide-react";
import ConfirmModal from "./modals/ConfirmModal";
import EditEventoModal from "./modals/EditEventoModal";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const EventosContent = ({ showToast }) => {
  const [editingEvento, setEditingEvento] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 🔹 Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tipoEventoFilter, setTipoEventoFilter] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Función para obtener eventos con paginación - MEMOIZADA
  const fetchEventos = useCallback(async (params) => {
    try {
      const searchParams = new URLSearchParams();
      
      // Agregar parámetros de paginación
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      
      // Agregar filtros
      if (params.search) searchParams.append('search', params.search);
      if (params.estado) searchParams.append('estado', params.estado);
      if (params.tipoEvento) searchParams.append('tipoEvento', params.tipoEvento);
      if (params.fechaInicio) searchParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) searchParams.append('fechaFin', params.fechaFin);

      const res = await fetch(`http://localhost:4000/api/eventos?${searchParams}`);
      
      if (!res.ok) throw new Error('Error al obtener eventos');
      
      return await res.json();
    } catch (error) {
      console.error('Error fetching eventos:', error);
      throw error;
    }
  }, []);

  // Hook de paginación
  const {
    data: eventos,
    pagination,
    loading,
    error,
    goToPage,
    changeItemsPerPage,
    applyFilters,
    refresh
  } = usePagination(fetchEventos, {}, 10);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filters = {
      search: searchTerm,
      estado: estadoFilter,
      tipoEvento: tipoEventoFilter,
      fechaInicio,
      fechaFin
    };
    applyFilters(filters);
  }, [searchTerm, estadoFilter, tipoEventoFilter, fechaInicio, fechaFin, applyFilters]);

  const deleteEvento = async (evento) => {
    try {
      await fetch(`http://localhost:4000/api/eventos/${evento._id}`, {
        method: "DELETE",
      });
      
      refresh(); // Recargar datos después de eliminar
      showToast("Evento eliminado correctamente");
      setConfirmDelete(null);
    } catch {
      showToast("Error al eliminar el evento", "error");
    }
  };

  const handleModalClose = (updatedEvento) => {
    if (updatedEvento) {
      refresh(); // Recargar datos después de crear/actualizar
    }
    setEditingEvento(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Eventos</h2>
        <button
          onClick={() => setEditingEvento({})}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" /> <span>Nuevo Evento</span>
        </button>
      </div>

      {/* 🔹 Barra de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="relative col-span-full xl:col-span-2">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white"
          />
        </div>

        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
          <option value="rechazada">Rechazada</option>
        </select>

        <select
          value={tipoEventoFilter}
          onChange={(e) => setTipoEventoFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los tipos</option>
          <option value="boda">Boda</option>
          <option value="cumpleanos">Cumpleaños</option>
          <option value="corporativo">Corporativo</option>
          <option value="quinceanos">Quinceaños</option>
          <option value="otro">Otro</option>
        </select>

        <div className="flex gap-2 col-span-full xl:col-span-2">
          <div className="flex-1">
            <label className="text-gray-400 text-xs">Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-400 text-xs">Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-purple-500/20 rounded-xl">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-purple-600/20">
            <tr>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Tipo</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Ubicación</th>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-red-400">
                  Error: {error}
                </td>
              </tr>
            ) : eventos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  No hay eventos que coincidan
                </td>
              </tr>
            ) : (
              eventos.map((evento) => (
                <tr key={evento._id} className="border-b border-purple-500/10">
                  <td className="px-6 py-4">{evento.nombreEvento}</td>
                  <td className="px-6 py-4 capitalize">{evento.tipoEvento}</td>
                  <td className="px-6 py-4">
                    {new Date(evento.fechaEvento).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{evento.direccion}</td>
                  <td className="px-6 py-4">{evento.nombreCliente}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        evento.estado === "confirmada"
                          ? "bg-green-600/30 text-green-400"
                          : evento.estado === "pendiente"
                          ? "bg-yellow-600/30 text-yellow-400"
                          : evento.estado === "cancelada"
                          ? "bg-red-600/30 text-red-400"
                          : "bg-blue-600/30 text-blue-400"
                      }`}
                    >
                      {evento.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => setEditingEvento(evento)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(evento)}
                      className="text-red-400 hover:text-red-300"
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

      {/* Componente de paginación */}
      <Pagination
        pagination={pagination}
        onPageChange={goToPage}
        onItemsPerPageChange={changeItemsPerPage}
      />

      <EditEventoModal
        evento={editingEvento}
        onClose={handleModalClose}
        showToast={showToast}
      />
      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar evento"
        message={`¿Seguro que deseas eliminar "${confirmDelete?.nombreEvento}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => deleteEvento(confirmDelete)}
      />
    </div>
  );
};

export default EventosContent;
