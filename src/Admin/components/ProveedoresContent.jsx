import React, { useState, useEffect, useCallback } from "react";
import { Box, Search, Plus, Edit2, Trash2 } from "lucide-react";
import EditProveedorModal from "./modals/EditProveedorModal";
import ConfirmModal from "./modals/ConfirmModal";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const ProveedoresContent = ({ showToast }) => {
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const fetchProveedores = useCallback(async (params) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      if (params.search) searchParams.append('search', params.search);
      if (params.tipo) searchParams.append('tipo', params.tipo);
      if (params.estado) searchParams.append('estado', params.estado);

      const response = await fetch(`http://localhost:4000/api/proveedores?${searchParams}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Error al cargar proveedores');
      return await response.json();
    } catch (error) {
      console.error('Error fetching proveedores:', error);
      throw error;
    }
  }, []);

  const {
    data: proveedores,
    pagination,
    loading,
    error,
    goToPage,
    changeItemsPerPage,
    applyFilters,
    refresh
  } = usePagination(fetchProveedores, {}, 10);

  useEffect(() => {
    applyFilters({ search: searchTerm, tipo: tipoFilter, estado: estadoFilter });
  }, [searchTerm, tipoFilter, estadoFilter, applyFilters]);

  const handleDelete = async (p) => {
    try {
      const res = await fetch(`http://localhost:4000/api/proveedores/${p._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Error al eliminar proveedor');
      showToast('Proveedor eliminado correctamente');
      refresh();
      setConfirmDelete(null);
    } catch (err) {
      showToast('Error al eliminar proveedor', 'error');
    }
  };

  const handleCloseModal = (updated) => {
    if (updated) refresh();
    setEditingProveedor(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Box className="h-6 w-6 text-purple-500 mr-2" /> Gestión de Proveedores
        </h2>
        <button onClick={() => setEditingProveedor({})} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          <Plus className="h-5 w-5 inline-block mr-2" /> Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nombre, email o producto..." className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white" />
        </div>

        <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white">
          <option value="">Todos los tipos</option>
          <option value="local">Local</option>
          <option value="internacional">Internacional</option>
        </select>

        <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-purple-500/20 rounded-xl">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-purple-600/20">
            <tr>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Teléfono</th>
              <th className="px-6 py-4 text-left">Tipo</th>
              <th className="px-6 py-4 text-left">Productos</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-4">Cargando...</td></tr>
            ) : error ? (
              <tr><td colSpan="7" className="text-center py-4 text-red-400">Error: {error}</td></tr>
            ) : proveedores.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4 text-gray-400">No hay proveedores</td></tr>
            ) : (
              proveedores.map(p => (
                <tr key={p._id} className="border-b border-purple-500/10">
                  <td className="px-6 py-4">{p.nombre}</td>
                  <td className="px-6 py-4">{p.emailContacto}</td>
                  <td className="px-6 py-4">{p.telefono}</td>
                  <td className="px-6 py-4 capitalize">{p.tipo}</td>
                  <td className="px-6 py-4">{(p.productos || []).join(', ')}</td>
                  <td className="px-6 py-4 capitalize">{p.estado}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => setEditingProveedor(p)} className="text-blue-400 hover:text-blue-300"><Edit2 className="h-4 w-4"/></button>
                      <button onClick={() => setConfirmDelete(p)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4"/></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={goToPage} onItemsPerPageChange={changeItemsPerPage} />

      {editingProveedor && <EditProveedorModal proveedor={editingProveedor} onClose={handleCloseModal} showToast={showToast} />}

      <ConfirmModal open={!!confirmDelete} title="Eliminar proveedor" message={`¿Eliminar a "${confirmDelete?.nombre}"?`} onCancel={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete)} />
    </div>
  );
};

export default ProveedoresContent;
