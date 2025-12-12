import React, { useState, useEffect, useCallback } from "react";
import { Eye, CheckCircle2, Clock, MessageSquare, Search, Star } from "lucide-react";
import DetallePQRSModal from "./modals/DetallePQRSModal";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const PQRSContent = () => {
  const [detalle, setDetalle] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoPQRSFilter, setTipoPQRSFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  // Función para obtener contactos/PQRS con paginación - MEMOIZADA
  const fetchPQRS = useCallback(async (params) => {
    try {
      const searchParams = new URLSearchParams();
      
      // Agregar parámetros de paginación
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      
      // Agregar filtros
      if (params.search) searchParams.append('search', params.search);
      if (params.tipoPQRS) searchParams.append('tipoPQRS', params.tipoPQRS);
      if (params.respondido !== undefined) searchParams.append('respondido', params.respondido);

      const res = await fetch(`http://localhost:4000/api/contactos?${searchParams}`);
      
      if (!res.ok) throw new Error('Error al obtener PQRS');
      
      return await res.json();
    } catch (error) {
      console.error('Error fetching PQRS:', error);
      throw error;
    }
  }, []);

  // Hook de paginación
  const {
    data: pqrsList,
    pagination,
    loading,
    error,
    goToPage,
    changeItemsPerPage,
    applyFilters,
    refresh
  } = usePagination(fetchPQRS, {}, 10);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filters = {
      search: searchTerm,
      tipoPQRS: tipoPQRSFilter,
      respondido: estadoFilter === 'respondido' ? true : 
                   estadoFilter === 'pendiente' ? false : 
                   undefined
    };
    applyFilters(filters);
  }, [searchTerm, tipoPQRSFilter, estadoFilter, applyFilters]);

  const handleRespond = (updated) => {
    if (!updated || !updated._id) return;
    refresh(); // Recargar datos después de responder
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">PQRS y Cotizaciones</h2>
      </div>

      {/* Barra de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white"
          />
        </div>

        <select
          value={tipoPQRSFilter}
          onChange={(e) => setTipoPQRSFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los tipos</option>
          <option value="peticion">Petición</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
          <option value="sugerencia">Sugerencia</option>
        </select>

        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="respondido">Respondidas</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-purple-500/20 rounded-xl">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-purple-600/20">
            <tr>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Correo</th>
              <th className="px-6 py-4 text-left">Tipo de PQRS</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Respuesta</th>
              <th className="px-6 py-4 text-left">Calificación</th>
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
                <td colSpan="8" className="text-center py-4 text-red-400">
                  Error: {error}
                </td>
              </tr>
            ) : pqrsList.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No hay PQRS que coincidan
                </td>
              </tr>
            ) : (
              pqrsList.map((p) => (
                <tr key={p._id} className={`border-b border-purple-500/10 ${p.respondido ? 'bg-green-900/10' : ''}`}>
                  <td className="px-6 py-3">
                    {p.respondido ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Contestada</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-xs">Pendiente</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3">{p.nombre}</td>
                  <td className="px-6 py-3">{p.email}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 capitalize ${
                        p.tipoPQRS === 'peticion' ? 'bg-blue-400' :
                        p.tipoPQRS === 'queja' ? 'bg-red-400' :
                        p.tipoPQRS === 'reclamo' ? 'bg-orange-400' :
                        'bg-green-400'
                      }`}></span>
                      <span className="capitalize">{p.tipoPQRS}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">{new Date(p.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    {p.respondido ? (
                      <div className="flex items-center text-green-400">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="text-xs">{new Date(p.fechaRespuesta).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin respuesta</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {p.calificacion ? (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < p.calificacion
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-500'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-yellow-400 ml-1">{p.calificacion}/5</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin calificar</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setDetalle(p)}
                      className="text-blue-400 hover:text-blue-300"
                      title={p.respondido ? "Ver detalle y respuesta" : "Responder PQRS"}
                    >
                      <Eye className="h-4 w-4" />
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

      {detalle && (
        <DetallePQRSModal pqrs={detalle} onClose={() => setDetalle(null)} onRespond={handleRespond} />
      )}
    </div>
  );
};

export default PQRSContent;
