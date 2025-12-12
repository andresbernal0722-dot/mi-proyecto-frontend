import React from "react";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
