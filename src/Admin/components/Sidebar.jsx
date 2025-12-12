import React from "react";
import {
  Home,
  Users,
  Package2,
  Calendar,
  MessageSquare,
  FileBarChart,
  Archive,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "colaboradores", label: "Colaboradores", icon: Users },
    { id: "proveedores", label: "Proveedores", icon: Package2 },
    { id: "calendario", label: "Calendario", icon: Calendar },
    { id: "eventos", label: "Eventos", icon: Package2 },
    { id: "reservas", label: "Reservas", icon: Calendar },
    { id: "pqrs", label: "PQRS", icon: MessageSquare },
    { id: "inventario", label: "Inventario", icon: Archive },
    { id: "reportes", label: "Reportes", icon: FileBarChart },
  ];

  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    
    // También puedes eliminar otros datos relacionados si existen
    localStorage.removeItem('user');
    localStorage.removeItem('adminData');
    
    // Redirigir a la página principal
    window.location.href = '/';
  };

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-purple-900/95 to-gray-900/95 transition-transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex justify-between items-center p-5 border-b border-purple-500/20">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Souno Logistic
        </h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveSection(id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              activeSection === id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                : "text-gray-300 hover:bg-purple-600/20 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5 mr-3" />
            {label}
          </button>
        ))}

        <div className="mt-8 px-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all duration-300"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;