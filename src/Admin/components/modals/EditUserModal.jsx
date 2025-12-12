import React, { useState, useEffect } from "react";

const EditUserModal = ({ user, onClose }) => {
  const [form, setForm] = useState(user || {});

  // 🔹 Cuando cambie el usuario seleccionado, actualiza el formulario
  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/usuarios/${form._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar usuario");
      }
  
      console.log("Usuario actualizado:", data);
  
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar los cambios");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold text-white mb-4">Editar Usuario</h2>
        <input
          name="firstName"
          value={form.firstName || ""}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />
        <input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          placeholder="Correo"
          className="w-full mb-3 p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 px-4 py-2 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
