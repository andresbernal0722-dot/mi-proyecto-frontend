import React, { useState, useEffect } from "react";

const EditEventoModal = ({ evento, onClose, onSaved }) => {
  const [form, setForm] = useState(evento || {});

  useEffect(() => {
    if (evento) setForm(evento);
  }, [evento]);

  if (!evento) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const url = evento._id
        ? `http://localhost:4000/api/eventos/${evento._id}`
        : "http://localhost:4000/api/eventos";

      const method = evento._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al guardar evento");

      // 🔹 Llama al callback del padre para actualizar la tabla
      if (onSaved) onSaved(data.evento || data);

      onClose();
    } catch (err) {
      console.error("Error guardando evento:", err);
      alert("Error al guardar el evento");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold text-white mb-4">
          {evento._id ? "Editar Evento" : "Nuevo Evento"}
        </h2>

        <input
          name="nombreEvento"
          value={form.nombreEvento || ""}
          onChange={handleChange}
          placeholder="Nombre del evento"
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />
        <input
          type="date"
          name="fechaEvento"
          value={form.fechaEvento ? form.fechaEvento.substring(0, 10) : ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />
        <input
          name="direccion"
          value={form.direccion || ""}
          onChange={handleChange}
          placeholder="Dirección o ubicación"
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />
        <input
          name="tipoEvento"
          value={form.tipoEvento || ""}
          onChange={handleChange}
          placeholder="Tipo de evento (ej. boda, concierto...)"
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />
        <input
          name="nombreCliente"
          value={form.nombreCliente || ""}
          onChange={handleChange}
          placeholder="Nombre del cliente"
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />
        <input
          name="emailCliente"
          value={form.emailCliente || ""}
          onChange={handleChange}
          placeholder="Correo del cliente"
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventoModal;
