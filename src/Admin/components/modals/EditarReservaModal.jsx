import React, { useState, useEffect } from "react";

const EditarReservaModal = ({ reserva, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({
    nombreEvento: "",
    tipoEvento: "",
    fechaEvento: "",
    horaInicio: "",
    horaFin: "",
    direccion: "",
    descripcionEvento: "",
    nombreCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    empresaCliente: "",
    equiposSeleccionados: [],
    descuento: 0, // Porcentaje de descuento
    subtotal: 0, // Total antes del descuento
    total: 0 // Total después del descuento
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stockDisponible, setStockDisponible] = useState({});
  const [loadingStock, setLoadingStock] = useState(false);
  const [errorStock, setErrorStock] = useState({});

  // Verificar stock disponible al cargar o cambiar equipos
  const verificarStock = async (equipos) => {
    setLoadingStock(true);
    setErrorStock({});
    try {
      const token = localStorage.getItem("token");
      const promesas = equipos.map(equipo =>
        fetch(`http://localhost:4000/api/inventario/disponibilidad/${equipo.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json())
      );
      
      const resultados = await Promise.all(promesas);
      const stockInfo = {};
      resultados.forEach((res, index) => {
        stockInfo[equipos[index].id] = res.stockDisponible;
      });
      setStockDisponible(stockInfo);
    } catch (error) {
      console.error("Error al verificar stock:", error);
    } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    if (reserva) {
      // Asegurémonos de que cada equipo tenga su ID correcto
      const equiposConId = (reserva.equiposSeleccionados || []).map(eq => ({
        ...eq,
        equipoId: eq._id || eq.equipoId // Aseguramos tener el ID correcto
      }));

      const subtotal = equiposConId.reduce((acc, eq) => acc + (eq.precio * eq.cantidad), 0);
      const descuento = reserva.descuento || 0;
      const total = subtotal * (1 - (descuento / 100));

      setFormData({
        nombreEvento: reserva.nombreEvento || "",
        tipoEvento: reserva.tipoEvento || "",
        fechaEvento: reserva.fechaEvento ? reserva.fechaEvento.split('T')[0] : "",
        horaInicio: reserva.horaInicio || "",
        horaFin: reserva.horaFin || "",
        direccion: reserva.direccion || "",
        descripcionEvento: reserva.descripcionEvento || "",
        nombreCliente: reserva.nombreCliente || "",
        emailCliente: reserva.emailCliente || "",
        telefonoCliente: reserva.telefonoCliente || "",
        empresaCliente: reserva.empresaCliente || "",
        equiposSeleccionados: equiposConId,
        descuento: descuento,
        subtotal: subtotal,
        total: total
      });

      // Verificar stock disponible para cada equipo
      verificarStock(equiposConId);
    }
  }, [reserva]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescuentoChange = (nuevoDescuento) => {
    // Asegurar que el descuento esté entre 0 y 100
    const descuento = Math.min(100, Math.max(0, parseFloat(nuevoDescuento) || 0));

    setFormData(prev => ({
      ...prev,
      descuento,
      total: prev.subtotal * (1 - (descuento / 100))
    }));
  };

  const handleCantidadChange = (equipoId, nuevaCantidad) => {
    setErrorStock(prev => ({ ...prev, [equipoId]: null }));
    const cantidad = Math.max(0, parseInt(nuevaCantidad) || 0);
    
    // Verificar si hay suficiente stock
    if (stockDisponible[equipoId] !== undefined && cantidad > stockDisponible[equipoId]) {
      setErrorStock(prev => ({
        ...prev,
        [equipoId]: `Solo hay ${stockDisponible[equipoId]} unidades disponibles`
      }));
      return;
    }

    setFormData(prev => {
      const equiposActualizados = prev.equiposSeleccionados.map(eq => {
        if (eq.equipoId === equipoId) {
          return { ...eq, cantidad };
        }
        return eq;
      });

      // Calcular subtotal
      const nuevoSubtotal = equiposActualizados.reduce((acc, eq) => 
        acc + (eq.precio * eq.cantidad), 0
      );

      // Aplicar descuento si existe
      const nuevoTotal = nuevoSubtotal * (1 - (prev.descuento / 100));

      return {
        ...prev,
        equiposSeleccionados: equiposActualizados,
        subtotal: nuevoSubtotal,
        total: nuevoTotal
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/reservas/${reserva._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la reserva");
      }

      showNotification("success", "Reserva actualizada exitosamente");
      setTimeout(() => {
        onActualizar();
        onClose();
      }, 1500);
    } catch (err) {
      showNotification("error", err.message);
      console.error("Error al actualizar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!reserva) return null;

  // Solo permitir editar reservas pendientes
  if (reserva.estado !== "pendiente") {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-[500px] shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">🚫</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">
            No se puede editar
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Solo se pueden editar reservas en estado <strong>pendiente</strong>.
            <br />
            Esta reserva está en estado: <span className="text-yellow-400 capitalize font-semibold">{reserva.estado}</span>
          </p>
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-medium transition-colors duration-200"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {/* Notificación flotante estilo toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-[60] transition-all duration-300 ease-out transform">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 min-w-[320px] backdrop-blur-sm ${
            notification.type === "success" 
              ? "bg-gradient-to-r from-green-600 to-green-500 border-green-400" 
              : "bg-gradient-to-r from-red-600 to-red-500 border-red-400"
          }`}>
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">
                {notification.type === "success" ? "¡Éxito!" : "Error"}
              </p>
              <p className="text-white/95 text-sm leading-tight">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-full flex items-center justify-center border-2 border-purple-500/40">
            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
          Editar Reserva
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información del Cliente */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Nombre Cliente <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Correo Electrónico <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="emailCliente"
                  value={formData.emailCliente}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefonoCliente"
                  value={formData.telefonoCliente}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Empresa
                </label>
                <input
                  type="text"
                  name="empresaCliente"
                  value={formData.empresaCliente}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Información del Evento */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Información del Evento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Nombre del Evento <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="nombreEvento"
                  value={formData.nombreEvento}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Tipo de Evento <span className="text-red-400">*</span>
                </label>
                <select
                  name="tipoEvento"
                  value={formData.tipoEvento}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Concierto">Concierto</option>
                  <option value="Conferencia">Conferencia</option>
                  <option value="Boda">Boda</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Festival">Festival</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Fecha del Evento <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="fechaEvento"
                  value={formData.fechaEvento}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Hora Fin
                </label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 font-medium">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-300 text-sm mb-1 font-medium">
                Descripción del Evento
              </label>
              <textarea
                name="descripcionEvento"
                value={formData.descripcionEvento}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none resize-none transition-all"
              />
            </div>
          </div>

          {/* Equipos Seleccionados */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Equipos Seleccionados
            </h3>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-3">
              <p className="text-purple-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Puedes ajustar las cantidades de los equipos. El sistema verificará la disponibilidad.
              </p>
            </div>
            {formData.equiposSeleccionados?.length > 0 ? (
              <ul className="space-y-2">
                {formData.equiposSeleccionados.map((eq) => (
                  <li
                    key={eq.equipoId}
                    className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg text-sm border border-gray-700/50"
                  >
                    <span className="text-gray-300 font-medium flex-grow">{eq.nombre}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCantidadChange(eq.equipoId, eq.cantidad - 1)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={eq.cantidad}
                            onChange={(e) => handleCantidadChange(eq.equipoId, e.target.value)}
                            className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleCantidadChange(eq.equipoId, eq.cantidad + 1)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                          </button>
                        </div>
                        {errorStock[eq.id] && (
                          <span className="text-red-400 text-xs mt-1">{errorStock[eq.id]}</span>
                        )}
                      </div>
                      <span className="text-purple-400 font-semibold w-24 text-right">
                        ${(eq.precio * eq.cantidad)?.toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay equipos registrados.</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center px-4">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-gray-300 font-medium">
                  ${formData.subtotal?.toLocaleString()}
                </span>
              </div>

              {/* Campo de descuento */}
              <div className="flex items-center gap-3 px-4">
                <span className="text-gray-400">Descuento:</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.descuento}
                    onChange={(e) => handleDescuentoChange(e.target.value)}
                    className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white"
                  />
                  <span className="text-gray-400">%</span>
                  {formData.descuento > 0 && (
                    <span className="text-green-400 text-sm">
                      (-${(formData.subtotal * (formData.descuento / 100)).toLocaleString()})
                    </span>
                  )}
                </div>
              </div>

              {/* Total con descuento */}
              <div className="flex justify-between items-center bg-purple-600/20 px-4 py-3 rounded-lg">
                <span className="text-gray-300 font-semibold">Total Final:</span>
                <span className="text-2xl font-bold text-purple-400">
                  ${formData.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-50 flex items-center gap-2 transition-all duration-200 shadow-lg shadow-purple-500/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarReservaModal;