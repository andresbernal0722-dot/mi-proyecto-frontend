import React from "react";

const Toast = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white text-sm shadow-lg transition-all ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
