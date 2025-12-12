import React from "react";
import { Bell, Menu, User } from "lucide-react";

const Header = ({ activeSection, setSidebarOpen }) => {
  const titles = {
    dashboard: "Dashboard",
    usuarios: "Gestión de Usuarios",
    eventos: "Gestión de Eventos",
    reservas: "Gestión de Reservas",
    pqrs: "PQRS y Cotizaciones",
    inventario: "Inventario",
    reportes: "Reportes y Análisis",
    calendario: "Calendario"
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-gray-800/20 backdrop-blur-sm border-b border-purple-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {titles[activeSection] || "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">


          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Admin Usuario</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
