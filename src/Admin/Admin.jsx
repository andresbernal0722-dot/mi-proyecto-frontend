import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardContent from "./components/DashboardContent";
import UsuariosContent from "./components/UsuariosContent";
import EventosContent from "./components/EventosContent";
import ReservasContent from "./components/ReservasContent";
import PQRSContent from "./components/PQRSContent";
import InventarioContent from "./components/InventarioContent";
import ReportesContent from "./components/ReportesContent";
import ColaboradoresContent from "./components/ColaboradoresContent";
import CalendarioContent from "./components/CalendarioContent";
import ProveedoresContent from "./components/ProveedoresContent";
import Toast from "./components/Toast";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Mostrar notificación tipo "toast"
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cambiar entre secciones del panel
  const renderContent = () => {
    switch (activeSection) {
      case "usuarios":
        return <UsuariosContent showToast={showToast} />;
      case "eventos":
        return <EventosContent showToast={showToast} />;
      case "reservas":
        return <ReservasContent showToast={showToast} />;
      case "pqrs":
        return <PQRSContent showToast={showToast} />;
      case "calendario":
        return <CalendarioContent showToast={showToast} />;
      case "inventario":
        return <InventarioContent showToast={showToast} />;
      case "reportes":
        return <ReportesContent />;
      case "colaboradores":
        return <ColaboradoresContent showToast={showToast} />;
      case "proveedores":
        return <ProveedoresContent showToast={showToast} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Menú lateral */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Header activeSection={activeSection} setSidebarOpen={setSidebarOpen} />
        <main className="p-6 overflow-y-auto">{renderContent()}</main>
      </div>

      {/* Notificación flotante */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Admin;
