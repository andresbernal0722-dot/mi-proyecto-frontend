import React, { useState } from "react";
import { X } from "lucide-react";

const CrearEquipoModal = ({ isOpen, onClose, onSuccess, categorias }) => {
  const [formData, setFormData] = useState({
    categoriaId: "",
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
    stockMinimo: "1",
    estado: "Activo"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:4000/api/inventario/${formData.categoriaId}/equipos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: Number(formData.precio),
          descripcion: formData.descripcion,
          stock: Number(formData.stock),
          stockMinimo: Number(formData.stockMinimo),
          estado: formData.estado
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al crear equipo');
      }

      alert('Equipo creado exitosamente');
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        categoriaId: "",
        nombre: "",
        precio: "",
        descripcion: "",
        stock: "",
        stockMinimo: "1",
        estado: "Activo"
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-purple-500/20 w-full max-w-2xl">
        <div className="border-b border-purple-500/20 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Crear Nuevo Equipo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Categoría *</label>
            <select
              value={formData.categoriaId}
              onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.categoria}</option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre del Equipo *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Precio *</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                required
                min="0"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Stock Inicial *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                required
                min="0"
              />
            </div>

            {/* Stock Mínimo */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Stock Mínimo *</label>
              <input
                type="number"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({...formData, stockMinimo: e.target.value})}
                className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                required
                min="1"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Estado *</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                required
              >
                <option value="Activo">Activo</option>
                <option value="No disponible">No disponible</option>
                <option value="En mantenimiento">En mantenimiento</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearEquipoModal;