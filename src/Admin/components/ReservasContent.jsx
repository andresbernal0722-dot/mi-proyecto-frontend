import React, { useState, useEffect, useCallback } from "react";
import { Eye, Search, CheckCircle, XCircle, Edit, Play, Square } from "lucide-react";
import DetalleReservaModal from "./modals/DetalleReservaModal";
import EditarReservaAdminModal from "./modals/EditarReservaAdminModal";
import ConfirmModal from "./modals/ConfirmModal";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const ReservasContent = ({ showToast }) => {
  const [detalle, setDetalle] = useState(null);
  const [reservaEditar, setReservaEditar] = useState(null);
  const [confirmAccept, setConfirmAccept] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tipoEventoFilter, setTipoEventoFilter] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Función para obtener reservas con paginación - MEMOIZADA
  const fetchReservas = useCallback(async (params) => {
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
      if (params.fechaDesde) searchParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) searchParams.append('fechaHasta', params.fechaHasta);

      const res = await fetch(`http://localhost:4000/api/reservas?${searchParams}`);
      
      if (!res.ok) throw new Error('Error al obtener reservas');
      
      return await res.json();
    } catch (error) {
      console.error('Error fetching reservas:', error);
      throw error;
    }
  }, []);

  // Hook de paginación
  const {
    data: reservas,
    pagination,
    loading,
    error,
    goToPage,
    changeItemsPerPage,
    applyFilters,
    refresh
  } = usePagination(fetchReservas, {}, 10);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filters = {
      search: filtro,
      estado: estadoFilter,
      tipoEvento: tipoEventoFilter,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta
    };
    applyFilters(filters);
  }, [filtro, estadoFilter, tipoEventoFilter, fechaDesde, fechaHasta, applyFilters]);

  // ACEPTAR reserva (crear bloqueos)
  const aceptarReserva = async (reservaId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${reservaId}/aceptar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al aceptar reserva");
      }

      refresh();
      showToast("Reserva aceptada exitosamente. Bloqueos creados.", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error al aceptar la reserva", "error");
    }
  };

  // RECHAZAR reserva
  const rechazarReserva = async (reservaId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${reservaId}/rechazar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al rechazar reserva");

      refresh();
      showToast("Reserva rechazada correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast("Error al rechazar la reserva", "error");
    }
  };

  // INICIAR evento (descontar inventario)
  const iniciarEvento = async (reservaId) => {
    if (!window.confirm("¿Confirmas que el evento está iniciando? Se descontará el inventario.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${reservaId}/iniciar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar evento");

      refresh();
      showToast("Evento iniciado. Inventario descontado.", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error al iniciar evento", "error");
    }
  };

  // FINALIZAR evento (devolver inventario)
  const finalizarEvento = async (reservaId) => {
    if (!window.confirm("¿Confirmas que el evento ha finalizado? Se devolverá el inventario.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${reservaId}/finalizar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al finalizar evento");

      refresh();
      showToast("Evento finalizado. Inventario devuelto y registrado en historial.", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error al finalizar evento", "error");
    }
  };

  // Función helper para obtener clase de badge según estado
  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: "bg-yellow-600/30 text-yellow-400",
      aceptada: "bg-blue-600/30 text-blue-400",
      en_curso: "bg-purple-600/30 text-purple-400",
      finalizada: "bg-green-600/30 text-green-400",
      cancelada: "bg-red-600/30 text-red-400",
      rechazada: "bg-gray-600/30 text-gray-400"
    };
    return badges[estado] || "bg-gray-600/30 text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Título y filtros */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white">Gestión de Reservas</h2>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar cliente, evento..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-gray-800 border border-purple-500/30 rounded-lg pl-8 pr-4 py-2 text-sm text-white focus:outline-none"
            />
          </div>
          
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-sm text-white"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aceptada">Aceptada</option>
            <option value="en_curso">En Curso</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
            <option value="rechazada">Rechazada</option>
          </select>
          
          <select
            value={tipoEventoFilter}
            onChange={(e) => setTipoEventoFilter(e.target.value)}
            className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-sm text-white"
          >
            <option value="">Todos los tipos</option>
            <option value="boda">Boda</option>
            <option value="cumpleanos">Cumpleaños</option>
            <option value="corporativo">Corporativo</option>
            <option value="quinceanos">Quinceaños</option>
            <option value="otro">Otro</option>
          </select>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500"
                placeholder="Desde"
                title="Fecha desde"
              />
              <label className="absolute -top-5 left-0 text-xs text-gray-400">Desde</label>
            </div>
            
            <div className="relative">
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500"
                placeholder="Hasta"
                title="Fecha hasta"
              />
              <label className="absolute -top-5 left-0 text-xs text-gray-400">Hasta</label>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de reservas */}
      <div className="overflow-x-auto border border-purple-500/20 rounded-xl">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-purple-600/20">
            <tr>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Evento</th>
              <th className="px-6 py-4 text-left">Tipo</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-red-400">Error: {error}</td>
              </tr>
            ) : reservas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No hay reservas registradas
                </td>
              </tr>
            ) : (
              reservas.map((r) => (
                <tr key={r._id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                  <td className="px-6 py-3">{r.nombreCliente}</td>
                  <td className="px-6 py-3">{r.nombreEvento}</td>
                  <td className="px-6 py-3 capitalize">{r.tipoEvento}</td>
                  <td className="px-6 py-3">
                    {new Date(r.fechaEvento).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getEstadoBadge(r.estado)}`}>
                      {r.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {/* Ver detalle - siempre disponible */}
                      <button
                        onClick={() => setDetalle(r)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Editar - solo pendientes */}
                      {r.estado === "pendiente" && (
                        <button
                          onClick={() => setReservaEditar(r)}
                          className="text-purple-400 hover:text-purple-300"
                          title="Editar y asignar equipos"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}

                      {/* Aceptar - solo pendientes */}
                      {r.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => setConfirmAccept(r)}
                            className="text-green-400 hover:text-green-300"
                            title="Aceptar reserva (crear bloqueos)"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => rechazarReserva(r._id)}
                            className="text-red-400 hover:text-red-300"
                            title="Rechazar reserva"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* Iniciar - solo aceptadas */}
                      {r.estado === "aceptada" && (
                        <button
                          onClick={() => iniciarEvento(r._id)}
                          className="text-cyan-400 hover:text-cyan-300"
                          title="Iniciar evento (descontar inventario)"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}

                      {/* Finalizar - solo en curso */}
                      {r.estado === "en_curso" && (
                        <button
                          onClick={() => finalizarEvento(r._id)}
                          className="text-green-400 hover:text-green-300"
                          title="Finalizar evento (devolver inventario)"
                        >
                          <Square className="h-4 w-4" />
                        </button>
                      )}
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

      {/* Modal Detalle */}
      <DetalleReservaModal reserva={detalle} onClose={() => setDetalle(null)} />

      {/* Modal Editar Admin (asignar equipos y colaboradores) */}
      {reservaEditar && (
        <EditarReservaAdminModal
          reserva={reservaEditar}
          onClose={() => setReservaEditar(null)}
          onActualizar={refresh}
          showToast={showToast}
        />
      )}

      {/* Confirmación aceptar reserva */}
      <ConfirmModal
        open={!!confirmAccept}
        title="Aceptar reserva"
        message={`¿Está seguro de aceptar la reserva "${confirmAccept?.nombreEvento}"?`}
        onCancel={() => setConfirmAccept(null)}
        onConfirm={() => {
          if (confirmAccept) {
            aceptarReserva(confirmAccept._id);
          }
          setConfirmAccept(null);
        }}
      />
    </div>
  );
};

export default ReservasContent;