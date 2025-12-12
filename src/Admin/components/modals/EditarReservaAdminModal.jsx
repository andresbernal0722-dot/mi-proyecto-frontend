import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Users, Package, AlertCircle, CheckCircle } from "lucide-react";

const EditarReservaAdminModal = ({ reserva, onClose, onActualizar, showToast }) => {
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
    colaboradoresAsignados: [],
    total: 0
  });

  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [colaboradoresDisponibles, setColaboradoresDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);

  // Cargar datos de la reserva al abrir
  useEffect(() => {
    if (reserva) {
      setFormData({
        nombreEvento: reserva.nombreEvento || "",
        tipoEvento: reserva.tipoEvento || "",
        fechaEvento: reserva.fechaEvento 
          ? new Date(reserva.fechaEvento).toISOString().substring(0, 10)
          : "",
        horaInicio: reserva.horaInicio || "",
        horaFin: reserva.horaFin || "",
        direccion: reserva.direccion || "",
        descripcionEvento: reserva.descripcionEvento || "",
        nombreCliente: reserva.nombreCliente || "",
        emailCliente: reserva.emailCliente || "",
        telefonoCliente: reserva.telefonoCliente || "",
        empresaCliente: reserva.empresaCliente || "",
        equiposSeleccionados: reserva.equiposSeleccionados || [],
        colaboradoresAsignados: reserva.colaboradoresAsignados || [],
        total: reserva.total || 0
      });
    }
  }, [reserva]);

  // Cargar disponibilidad cuando cambie la fecha
  useEffect(() => {
    if (formData.fechaEvento) {
      cargarDisponibilidad();
    }
  }, [formData.fechaEvento]);

  const cargarDisponibilidad = async () => {
    setLoadingDisponibilidad(true);
    try {
      // Cargar equipos disponibles
      const resEquipos = await fetch(
        `http://localhost:4000/api/reservas/disponibilidad/equipos?fechaEvento=${formData.fechaEvento}`
      );
      if (resEquipos.ok) {
        const equipos = await resEquipos.json();
        console.log('📦 EQUIPOS DISPONIBLES:', JSON.stringify(equipos, null, 2));
        setEquiposDisponibles(equipos);
      }

      // Cargar colaboradores disponibles
      const resColaboradores = await fetch(
        `http://localhost:4000/api/reservas/disponibilidad/colaboradores?fechaEvento=${formData.fechaEvento}`
      );
      if (resColaboradores.ok) {
        const colaboradores = await resColaboradores.json();
        setColaboradoresDisponibles(colaboradores);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
      showToast("Error al cargar disponibilidad", "error");
    } finally {
      setLoadingDisponibilidad(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const agregarEquipo = (equipo) => {
    const existe = formData.equiposSeleccionados.find(e => e.codigo === equipo.codigo);
    
    if (existe) {
      // Incrementar cantidad si hay disponible
      if (existe.cantidad < equipo.disponible) {
        setFormData(prev => ({
          ...prev,
          equiposSeleccionados: prev.equiposSeleccionados.map(e =>
            e.codigo === equipo.codigo
              ? { ...e, cantidad: e.cantidad + 1 }
              : e
          )
        }));
      } else {
        showToast(`No hay más unidades disponibles de ${equipo.nombre}`, "error");
      }
    } else {
      // Agregar nuevo equipo
      if (equipo.disponible > 0) {
        setFormData(prev => ({
          ...prev,
          equiposSeleccionados: [
            ...prev.equiposSeleccionados,
            {
              codigo: equipo.codigo,
              categoriaId: equipo.categoriaId,
              nombre: equipo.nombre,
              precio: equipo.precio,
              descripcion: equipo.descripcion,
              cantidad: 1,
              stock: equipo.stockTotal,
              stockMinimo: 1,
              estado: equipo.estado
            }
          ]
        }));
      } else {
        showToast(`${equipo.nombre} no está disponible para esta fecha`, "error");
      }
    }

    calcularTotal();
  };

  const quitarEquipo = (codigo) => {
    setFormData(prev => ({
      ...prev,
      equiposSeleccionados: prev.equiposSeleccionados
        .map(e => e.codigo === codigo ? { ...e, cantidad: e.cantidad - 1 } : e)
        .filter(e => e.cantidad > 0)
    }));
    calcularTotal();
  };

  const toggleColaborador = (colaborador) => {
    const existe = formData.colaboradoresAsignados.find(c => c.colaboradorId.toString() === colaborador._id.toString());
    
    if (existe) {
      setFormData(prev => ({
        ...prev,
        colaboradoresAsignados: prev.colaboradoresAsignados.filter(
          c => c.colaboradorId.toString() !== colaborador._id.toString()
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        colaboradoresAsignados: [
          ...prev.colaboradoresAsignados,
          {
            colaboradorId: colaborador._id,
            nombre: colaborador.nombre,
            rol: colaborador.rol,
            especialidad: colaborador.especialidad
          }
        ]
      }));
    }
  };

  const calcularTotal = () => {
    const total = formData.equiposSeleccionados.reduce((sum, equipo) => {
      return sum + (equipo.precio * equipo.cantidad);
    }, 0);
    setFormData(prev => ({ ...prev, total }));
  };

  useEffect(() => {
    calcularTotal();
  }, [formData.equiposSeleccionados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('📤 Enviando al backend:', formData);
    console.log('🔧 Equipos:', formData.equiposSeleccionados);
    console.log('👥 Colaboradores:', formData.colaboradoresAsignados);

    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${reserva._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar reserva");
      }

      showToast("Reserva actualizada exitosamente", "success");
      onActualizar();
      onClose();
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error al actualizar reserva", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!reserva) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl border border-purple-500/20 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-purple-500/20 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Editar Reserva y Asignar Recursos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Datos Básicos */}
          <div>
            <h3 className="text-xl font-bold text-purple-300 mb-4">Datos del Evento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre del Evento</label>
                <input
                  type="text"
                  value={formData.nombreEvento}
                  onChange={(e) => handleInputChange("nombreEvento", e.target.value)}
                  className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Fecha del Evento</label>
                <input
                  type="date"
                  value={formData.fechaEvento}
                  onChange={(e) => handleInputChange("fechaEvento", e.target.value)}
                  className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Cliente</label>
                <input
                  type="text"
                  value={formData.nombreCliente}
                  onChange={(e) => handleInputChange("nombreCliente", e.target.value)}
                  className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.emailCliente}
                  onChange={(e) => handleInputChange("emailCliente", e.target.value)}
                  className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Equipos Disponibles */}
          <div>
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
              <Package className="h-6 w-6 mr-2" />
              Asignar Equipos
            </h3>

            {loadingDisponibilidad ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-gray-400 mt-2">Verificando disponibilidad...</p>
              </div>
            ) : equiposDisponibles.length === 0 ? (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-yellow-300">No hay equipos disponibles para esta fecha</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {equiposDisponibles.map((equipo) => {
                  const enReserva = formData.equiposSeleccionados.find(e => e.codigo === equipo.codigo);
                  const cantidadSeleccionada = enReserva ? enReserva.cantidad : 0;

                  return (
                    <div
                      key={equipo.codigo}
                      className={`bg-gray-800/50 border rounded-lg p-4 ${
                        cantidadSeleccionada > 0 ? "border-purple-500" : "border-gray-600"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{equipo.nombre}</h4>
                          <p className="text-gray-400 text-sm">{equipo.descripcion}</p>
                          <p className="text-purple-400 font-bold mt-1">{formatPrice(equipo.precio)}/día</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Disponible: <span className={equipo.disponible > 0 ? "text-green-400" : "text-red-400"}>
                              {equipo.disponible}
                            </span> de {equipo.stockTotal}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => quitarEquipo(equipo.codigo)}
                            disabled={cantidadSeleccionada === 0}
                            className="w-8 h-8 bg-gray-700 hover:bg-red-600 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="w-8 text-center font-semibold text-white">
                            {cantidadSeleccionada}
                          </span>

                          <button
                            type="button"
                            onClick={() => agregarEquipo(equipo)}
                            disabled={equipo.disponible === 0 || cantidadSeleccionada >= equipo.disponible}
                            className="w-8 h-8 bg-gray-700 hover:bg-green-600 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {cantidadSeleccionada > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <p className="text-sm text-purple-400">
                            Subtotal: {formatPrice(equipo.precio * cantidadSeleccionada)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Colaboradores Disponibles */}
          <div>
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Asignar Colaboradores
            </h3>

            {loadingDisponibilidad ? (
              <div className="text-center py-4">
                <p className="text-gray-400">Cargando colaboradores...</p>
              </div>
            ) : colaboradoresDisponibles.length === 0 ? (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-yellow-300">No hay colaboradores disponibles para esta fecha</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colaboradoresDisponibles.map((colaborador) => {
                  const isSelected = formData.colaboradoresAsignados.some(
                    c => c.colaboradorId.toString() === colaborador._id.toString()
                  );

                  return (
                    <div
                      key={colaborador._id}
                      onClick={() => toggleColaborador(colaborador)}
                      className={`bg-gray-800/50 border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-900/20"
                          : "border-gray-600 hover:border-purple-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{colaborador.nombre}</h4>
                          <p className="text-sm text-gray-400 capitalize">{colaborador.rol}</p>
                          <p className="text-sm text-purple-400">{colaborador.especialidad}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Resumen</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Equipos seleccionados:</span>
                <span className="text-white font-semibold">
                  {formData.equiposSeleccionados.reduce((sum, e) => sum + e.cantidad, 0)} unidades
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Colaboradores asignados:</span>
                <span className="text-white font-semibold">{formData.colaboradoresAsignados.length}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-purple-500/30">
                <span className="text-white">Total:</span>
                <span className="text-purple-400">{formatPrice(formData.total)}</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || formData.equiposSeleccionados.length === 0}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarReservaAdminModal;