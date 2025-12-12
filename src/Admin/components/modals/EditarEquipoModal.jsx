import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Componente de notificación Toast
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-500/20 border-green-500 text-green-400",
    error: "bg-red-500/20 border-red-500 text-red-400",
    warning: "bg-yellow-500/20 border-yellow-500 text-yellow-400"
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className={`fixed top-4 right-4 z-[60] border rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in ${styles[type]}`}>
      {icons[type]}
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:opacity-70">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

const EditarEquipoModal = ({ equipo, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
    stockMinimo: "",
    estado: "Activo",
  });

  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (equipo) {
      const { _id, ...equipoData } = equipo;
      setFormData({
        nombre: equipoData.nombre,
        precio: equipoData.precio,
        descripcion: equipoData.descripcion,
        stock: equipoData.stock,
        stockMinimo: equipoData.stockMinimo,
        estado: equipoData.estado,
      });
    }
  }, [equipo]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (!formData.nombre || !formData.precio || !formData.descripcion) {
      showToast("Por favor completa todos los campos requeridos", "warning");
      return;
    }

    setIsSubmitting(true);

    const updatedFormData = {
      ...formData,
      stock: Number(formData.stock),
      stockMinimo: Number(formData.stockMinimo),
    };

    const { _id, ...dataToSend } = updatedFormData;

    const categoriaId = encodeURIComponent(equipo.categoriaId);
    const equipoNombre = encodeURIComponent(equipo.nombre);

    try {
      const res = await fetch(`http://localhost:4000/api/inventario/${categoriaId}/equipos/${equipoNombre}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        showToast("¡Equipo actualizado exitosamente!", "success");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "Error al actualizar el equipo", "error");
      }
    } catch (error) {
      showToast("No se pudo conectar con el servidor", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!equipo) return null;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-96 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Editar Equipo</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-white mb-1">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white mb-1">Precio *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white mb-1">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-purple-500 focus:outline-none transition-colors resize-none"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-white mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-1">Stock Mínimo</label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-white mb-1">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="Activo">Activo</option>
                <option value="En mantenimiento">En mantenimiento</option>
                <option value="No disponible">No disponible</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default EditarEquipoModal;