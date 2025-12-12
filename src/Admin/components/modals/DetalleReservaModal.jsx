import React from "react";

const DetalleReservaModal = ({ reserva, onClose }) => {
  if (!reserva) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
          Detalle de la Reserva
        </h2>

        <div className="space-y-3 text-gray-300">
          <p>
            <strong className="text-white">Cliente:</strong> {reserva.nombreCliente}
          </p>
          <p>
            <strong className="text-white">Correo:</strong> {reserva.emailCliente}
          </p>
          <p>
            <strong className="text-white">Teléfono:</strong>{" "}
            {reserva.telefonoCliente || "N/A"}
          </p>

          <hr className="border-purple-500/30 my-3" />

          <p>
            <strong className="text-white">Evento:</strong> {reserva.nombreEvento}
          </p>
          <p>
            <strong className="text-white">Tipo:</strong> {reserva.tipoEvento}
          </p>
          <p>
            <strong className="text-white">Fecha:</strong>{" "}
            {new Date(reserva.fechaEvento).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-white">Hora:</strong>{" "}
            {reserva.horaInicio} - {reserva.horaFin || "Sin definir"}
          </p>
          <p>
            <strong className="text-white">Dirección:</strong>{" "}
            {reserva.direccion || "No especificada"}
          </p>

          <hr className="border-purple-500/30 my-3" />

          <p>
            <strong className="text-white">Estado:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs capitalize ${
                reserva.estado === "confirmada"
                  ? "bg-green-600/30 text-green-400"
                  : reserva.estado === "pendiente"
                  ? "bg-yellow-600/30 text-yellow-400"
                  : "bg-red-600/30 text-red-400"
              }`}
            >
              {reserva.estado}
            </span>
          </p>

          <p>
            <strong className="text-white">Total:</strong> ${reserva.total.toLocaleString()}
          </p>

          {reserva.descripcionEvento && (
            <p>
              <strong className="text-white">Descripción:</strong>{" "}
              {reserva.descripcionEvento}
            </p>
          )}

          <hr className="border-purple-500/30 my-3" />

          <h3 className="text-lg font-semibold text-purple-400">
            Equipos seleccionados
          </h3>
          {reserva.equiposSeleccionados?.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {reserva.equiposSeleccionados.map((eq, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-gray-800/50 px-3 py-2 rounded-md text-sm"
                >
                  <span>{eq.nombre}</span>
                  <span className="text-gray-400">
                    {eq.cantidad} x ${eq.precio}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No hay equipos registrados.</p>
          )}
        </div>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleReservaModal;
