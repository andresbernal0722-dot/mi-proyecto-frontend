import React, { useState } from "react";
import { Star } from "lucide-react";

const DetallePQRSModal = ({ pqrs, onClose, onRespond }) => {
  const [respuesta, setRespuesta] = useState(pqrs?.respuesta || "");
  const [loading, setLoading] = useState(false);

  if (!pqrs) return null;

  const handleResponder = async () => {
    if (!respuesta.trim()) return alert('Ingrese una respuesta antes de enviar.');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/contactos/${pqrs._id}/responder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuesta })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al responder');
      // llamar callback para que el padre recargue la lista
      if (onRespond) onRespond(data.data);
      alert('Respuesta enviada correctamente.');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al enviar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 border border-purple-500/30 rounded-t-xl sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sticky top-0 bg-gray-900 pb-2">Detalle PQRS</h2>

        {/* Información de PQRS */}
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-semibold text-purple-200 text-sm">Información del Cliente</p>
              <p className="text-sm text-gray-300"><strong>Nombre:</strong> {pqrs.nombre}</p>
              <p className="text-sm text-gray-300"><strong>Correo:</strong> {pqrs.email}</p>
              <p className="text-sm text-gray-300"><strong>Tipo PQRS:</strong> {pqrs.tipoPQRS}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ml-4 ${pqrs.respondido ? 'bg-green-900/20 border border-green-500/30 text-green-400' : 'bg-yellow-900/20 border border-yellow-500/30 text-yellow-400'}`}>
              {pqrs.respondido ? 'Contestada' : 'Pendiente'}
            </div>
          </div>

          <div className="bg-black/40 rounded-lg p-3 border border-purple-500/20">
            <p className="font-semibold text-purple-200 mb-1 text-sm">Mensaje del Cliente</p>
            <p className="text-sm text-gray-300 line-clamp-3">{pqrs.mensaje}</p>
            <p className="text-xs text-gray-400 mt-2">Enviado el {new Date(pqrs.fecha).toLocaleString()}</p>
          </div>

          {pqrs.respondido && (
            <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
              <p className="font-semibold text-green-400 mb-1 text-sm">Respuesta Enviada</p>
              <p className="text-sm text-gray-300 line-clamp-3">{pqrs.respuesta}</p>
              <p className="text-xs text-green-400 mt-1">
                Respondido el {new Date(pqrs.fechaRespuesta).toLocaleString()}
              </p>
            </div>
          )}

          {/* Link a encuesta */}
          {pqrs.respondido && pqrs.linkEncuesta && (
            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
              <p className="font-semibold text-blue-400 mb-1 text-sm">📋 Encuesta Enviada</p>
              <p className="text-xs text-gray-300 mb-2">Encuesta de satisfacción compartida con el cliente</p>
              <a
                href={pqrs.linkEncuesta}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded transition-colors"
              >
                Ver Encuesta
              </a>
            </div>
          )}

          {/* Sección de Calificación del Cliente */}
          {pqrs.respondido && pqrs.calificacion && (
            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
              <p className="font-semibold text-blue-400 mb-1 text-sm">⭐ Calificación del Cliente</p>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < pqrs.calificacion
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-500'
                    }`}
                  />
                ))}
                <span className="text-yellow-400 font-semibold text-xs ml-1">{pqrs.calificacion}/5</span>
              </div>
              {pqrs.comentarioCalificacion && (
                <p className="text-xs text-gray-300 italic line-clamp-2">"{pqrs.comentarioCalificacion}"</p>
              )}
              <p className="text-xs text-blue-400 mt-1">
                Calificado el {new Date(pqrs.fechaCalificacion).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {!pqrs.respondido && (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-purple-200 mb-2">
              Escribe tu Respuesta
            </label>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              rows={3}
              className="w-full bg-black/60 border border-purple-500/30 rounded-lg p-3 text-white text-sm placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              placeholder="Escribe la respuesta que se enviará al cliente..."
            />
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-gray-900 pt-4 border-t border-purple-500/20">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-purple-500/50 hover:border-purple-500 rounded-lg font-semibold text-white text-sm transition-all duration-300"
          >
            Cerrar
          </button>
          {!pqrs.respondido && (
            <button
              onClick={handleResponder}
              disabled={loading}
              className={`flex items-center px-6 py-2 text-sm ${
                loading 
                  ? 'bg-purple-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
              } rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105`}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {loading ? 'Enviando...' : 'Responder PQRS'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallePQRSModal;
