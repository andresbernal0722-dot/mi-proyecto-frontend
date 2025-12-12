import React from "react";

const DetalleEquipoModal = ({ equipo, onClose }) => {
  if (!equipo) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold text-white mb-4">Detalle del Equipo</h2>
        
        <div className="space-y-3 text-sm text-gray-300">
          <p><strong>Nombre:</strong> {equipo.nombre}</p>
          <p><strong>Categoría:</strong> {equipo.categoria}</p>
          <p><strong>Precio:</strong> ${equipo.precio}</p>
          <p><strong>Descripción:</strong> {equipo.descripcion}</p>
          <p><strong>Cantidad Disponible:</strong> {equipo.stock}</p>
          <p><strong>Stock Mínimo:</strong> {equipo.stockMinimo}</p>
          <p><strong>Estado:</strong> {equipo.estado}</p>
        </div>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700 transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleEquipoModal;
