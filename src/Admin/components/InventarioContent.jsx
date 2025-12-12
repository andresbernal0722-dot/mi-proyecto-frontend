import React, { useState, useEffect, useCallback } from "react";
import { Eye, Edit, Upload, Search, RefreshCw, Plus, Trash2 } from "lucide-react";
import DetalleEquipoModal from "./modals/DetalleEquipoModal";
import EditarEquipoModal from "./modals/EditarEquipoModal";
import CrearEquipoModal from "./modals/CrearEquipoModal";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const InventarioContent = () => {
  const [detalle, setDetalle] = useState(null);
  const [editar, setEditar] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  // Lista de categorías para el dropdown
  const [listaCategorias, setListaCategorias] = useState([]);

  // Cargar lista de categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/inventario/categorias');
        const data = await res.json();
        setListaCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    cargarCategorias();
  }, []);

  // Función para obtener inventario
  const fetchInventario = useCallback(async (params) => {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      if (params.search) searchParams.append('search', params.search);

      const res = await fetch(`http://localhost:4000/api/inventario/admin?${searchParams}`);
      
      if (!res.ok) throw new Error('Error al obtener inventario');
      
      const data = await res.json();
      return data.categorias || []; // Retornar solo el array de categorías
    } catch (error) {
      console.error('Error fetching inventario:', error);
      throw error;
    }
  }, []);

  // Hook de paginación
  const {
    data: categorias,
    pagination,
    loading,
    error,
    goToPage,
    changeItemsPerPage,
    applyFilters,
    refresh
  } = usePagination(fetchInventario, {}, 10);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filters = {
      search: searchTerm
    };
    applyFilters(filters);
  }, [searchTerm, applyFilters]);

  // Función para resetear filtros
  const resetFiltros = () => {
    setSearchTerm("");
    setCategoriaFilter("");
    setStockFilter("");
  };

  // ✅ Filtrar en el frontend
  const categoriasFiltradas = (categorias || []).map(categoria => {
    const equiposFiltrados = (categoria.equipos || []).filter(equipo => {
      // Filtro por búsqueda
      const matchesSearch = !searchTerm || 
        equipo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por stock
      const matchesStock = (() => {
        if (!stockFilter) return true;
        if (stockFilter === "0") return equipo.stock === 0;
        
        const [min, max] = stockFilter.split("-").map(Number);
        if (stockFilter === "21+") return equipo.stock >= 21;
        return equipo.stock >= min && equipo.stock <= (max || min);
      })();

      return matchesSearch && matchesStock;
    });

    return {
      ...categoria,
      equipos: equiposFiltrados
    };
  }).filter(categoria => {
    // Filtro por categoría
    const matchesCategoria = !categoriaFilter || categoria._id === categoriaFilter;
    return matchesCategoria && categoria.equipos.length > 0;
  });

  // ✅ Eliminar equipo
  const eliminarEquipo = async (categoriaId, codigo, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

    try {
      const res = await fetch(`http://localhost:4000/api/inventario/${categoriaId}/equipos/${codigo}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar equipo');

      alert('Equipo eliminado exitosamente');
      refresh();
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      alert('Error al eliminar equipo');
    }
  };

  // Subir el archivo Excel
  const manejarCargaMasiva = async () => {
    if (!archivo) {
      setMensaje("Por favor selecciona un archivo .xlsx");
      return;
    }

    setCargando(true);
    setMensaje("");

    const formData = new FormData();
    formData.append("archivoExcel", archivo);

    try {
      const res = await fetch("http://localhost:4000/api/cargaMasiva/carga-masiva", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Carga masiva completada con éxito");
        refresh();
      } else {
        setMensaje("❌ Error: " + (data.message || "No se pudo procesar el archivo"));
      }
    } catch (error) {
      console.error("Error al cargar archivo:", error);
      setMensaje("❌ Error al conectar con el servidor");
    } finally {
      setCargando(false);
      setArchivo(null);
      setTimeout(() => setMostrarModalCarga(false), 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Inventario de Equipos</h2>

        <div className="flex gap-3">
          {/* ✅ Botón crear equipo */}
          <button
            onClick={() => setMostrarModalCrear(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="h-4 w-4" />
            Crear Equipo
          </button>

          {/* Botón de carga masiva */}
          <button
            onClick={() => setMostrarModalCarga(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Upload className="h-4 w-4" />
            Carga Masiva
          </button>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Búsqueda por texto */}
        <div className="relative col-span-full lg:col-span-2">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white"
          />
        </div>

        {/* Filtro por Categoría */}
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todas las categorías</option>
          {listaCategorias.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.categoria || 'Sin nombre'}</option>
          ))}
        </select>

        {/* Filtro por Stock */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
        >
          <option value="">Todos los stocks</option>
          <option value="0">Agotado (0)</option>
          <option value="1-5">1 a 5 unidades</option>
          <option value="6-10">6 a 10 unidades</option>
          <option value="11-20">11 a 20 unidades</option>
          <option value="21+">Más de 20 unidades</option>
        </select>

        {/* Botón de Reset */}
        <button
          onClick={resetFiltros}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors lg:col-span-4"
        >
          <RefreshCw className="h-4 w-4" />
          Resetear filtros
        </button>
      </div>

      <div className="overflow-x-auto border border-purple-500/20 rounded-xl">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-purple-600/20">
            <tr>
              <th className="px-6 py-4 text-left">Categoría</th>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Precio</th>
              <th className="px-6 py-4 text-left">Disponibles</th>
              <th className="px-6 py-4 text-left">Stock Mínimo</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-red-400">
                  Error: {error}
                </td>
              </tr>
            ) : categoriasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  No se encontraron equipos con los filtros seleccionados
                </td>
              </tr>
            ) : (
              categoriasFiltradas.map((categoria) => (
                <React.Fragment key={categoria._id}>
                  <tr>
                    <td colSpan="7" className="px-6 py-3 bg-gray-800 text-white font-bold">
                      {categoria.categoria || 'Sin categoría'}
                    </td>
                  </tr>
                  {categoria.equipos.map((equipo) => (
                    <tr key={equipo.codigo || equipo._id} className="border-b border-purple-500/10">
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3">{equipo.nombre}</td>
                      <td className="px-6 py-3">${equipo.precio?.toLocaleString()}</td>
                      <td className="px-6 py-3">{equipo.stock}</td>
                      <td className="px-6 py-3">{equipo.stockMinimo}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          equipo.estado === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {equipo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-3 flex gap-2">
                        <button
                          onClick={() => setDetalle(equipo)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setEditar({ ...equipo, categoriaId: categoria._id })}
                          className="text-yellow-400 hover:text-yellow-300"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => eliminarEquipo(categoria._id, equipo.codigo, equipo.nombre)}
                          className="text-red-400 hover:text-red-300"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
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

      {/* Modal de Detalle del Equipo */}
      <DetalleEquipoModal equipo={detalle} onClose={() => setDetalle(null)} />

      {/* Modal de Edición del Equipo */}
      <EditarEquipoModal equipo={editar} onClose={() => setEditar(null)} onUpdate={refresh} />

      {/* ✅ Modal de Crear Equipo */}
      <CrearEquipoModal 
        isOpen={mostrarModalCrear}
        onClose={() => setMostrarModalCrear(false)}
        onSuccess={refresh}
        categorias={listaCategorias}
      />

      {/* Modal de Carga Masiva */}
      {mostrarModalCarga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-xl border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-3">Carga Masiva de Inventario</h3>

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="block w-full text-sm text-gray-300 bg-gray-700 rounded-lg cursor-pointer border border-gray-600 p-2"
            />

            {mensaje && <p className="mt-3 text-sm text-center text-purple-400">{mensaje}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setMostrarModalCarga(false)}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
                disabled={cargando}
              >
                Cancelar
              </button>

              <button
                onClick={manejarCargaMasiva}
                className={`px-4 py-2 rounded-lg text-white ${
                  cargando ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
                }`}
                disabled={cargando}
              >
                {cargando ? "Cargando..." : "Subir Archivo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioContent;