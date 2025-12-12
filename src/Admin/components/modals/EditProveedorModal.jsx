import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditProveedorModal = ({ proveedor, onClose, showToast }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    emailContacto: '',
    telefono: '',
    direccion: '',
    tipo: 'local',
    productos: '',
    estado: 'activo'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre: proveedor.nombre || '',
        emailContacto: proveedor.emailContacto || '',
        telefono: proveedor.telefono || '',
        direccion: proveedor.direccion || '',
        tipo: proveedor.tipo || 'local',
        productos: (proveedor.productos || []).join(', '),
        estado: proveedor.estado || 'activo'
      });
    }
  }, [proveedor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, productos: formData.productos.split(',').map(s => s.trim()).filter(Boolean) };
      const url = proveedor._id ? `http://localhost:4000/api/proveedores/${proveedor._id}` : 'http://localhost:4000/api/proveedores';
      const method = proveedor._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error en la operación');
      const data = await res.json();
      showToast(`Proveedor ${proveedor._id ? 'actualizado' : 'creado'} con éxito`, 'success');
      onClose(data.proveedor);
    } catch (err) {
      showToast(err.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!proveedor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button onClick={() => onClose()} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="h-6 w-6"/></button>
        <h3 className="text-xl font-bold text-white mb-4">{proveedor._id ? 'Editar' : 'Nuevo'} Proveedor</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
            <input required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email contacto</label>
            <input required type="email" value={formData.emailContacto} onChange={(e) => setFormData({...formData, emailContacto: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
            <input required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Dirección</label>
            <input value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
            <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option value="local">Local</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Productos (separados por coma)</label>
            <input value={formData.productos} onChange={(e) => setFormData({...formData, productos: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
            <select value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => onClose()} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProveedorModal;
