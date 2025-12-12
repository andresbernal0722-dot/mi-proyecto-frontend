import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditColaboradorModal = ({ colaborador, onClose, showToast }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: '',
    especialidad: '',
    estado: 'activo',
    disponibilidad: 'disponible'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (colaborador) {
      setFormData({
        nombre: colaborador.nombre || '',
        email: colaborador.email || '',
        telefono: colaborador.telefono || '',
        rol: colaborador.rol || '',
        especialidad: colaborador.especialidad || '',
        estado: colaborador.estado || 'activo',
        disponibilidad: colaborador.disponibilidad || 'disponible'
      });
    }
  }, [colaborador]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = colaborador._id 
        ? `http://localhost:4000/api/colaboradores/${colaborador._id}`
        : 'http://localhost:4000/api/colaboradores';
      
      const method = colaborador._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error en la operación');

      const data = await response.json();
      showToast(
        `Colaborador ${colaborador._id ? 'actualizado' : 'creado'} exitosamente`,
        'success'
      );
      onClose(data.colaborador);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!colaborador) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h3 className="text-xl font-bold text-white mb-4">
          {colaborador._id ? 'Editar' : 'Nuevo'} Colaborador
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Rol
            </label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="tecnico">Técnico</option>
              <option value="supervisor">Supervisor</option>
              <option value="coordinador">Coordinador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Especialidad
            </label>
            <input
              type="text"
              value={formData.especialidad}
              onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Disponibilidad
            </label>
            <select
              value={formData.disponibilidad}
              onChange={(e) => setFormData({...formData, disponibilidad: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="vacaciones">Vacaciones</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⭮</span>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditColaboradorModal;