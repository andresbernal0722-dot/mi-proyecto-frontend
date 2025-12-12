import React, { useState } from 'react';
import { 
  Music, 
  Lightbulb, 
  Shield, 
  Camera, 
  Users, 
  Settings
} from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Fotter';

const ServicesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    {
      icon: <Music className="h-8 w-8" />,
      title: "Equipos de Sonido",
      description: "Sistemas de audio profesionales para eventos de cualquier tamaño. Micrófonos, altavoces, mezcladores y amplificadores de última generación.",
      features: ["Micrófonos inalámbricos", "Sistemas de altavoces", "Mesas de mezcla digitales", "Amplificadores profesionales"],
      gradient: "from-blue-600 to-purple-600"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Iluminación Profesional",
      description: "Diseño e instalación de sistemas de iluminación que crean ambientes únicos y memorables para tu evento especial.",
      features: ["Luces LED inteligentes", "Efectos especiales", "Iluminación arquitectural", "Control automatizado"],
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Seguridad del Evento",
      description: "Personal especializado en seguridad para garantizar que tu evento se desarrolle sin contratiempos y con total tranquilidad.",
      features: ["Personal de seguridad", "Control de acceso", "Monitoreo CCTV", "Planes de emergencia"],
      gradient: "from-green-600 to-teal-600"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Equipos Audiovisuales",
      description: "Proyectores, pantallas gigantes, sistemas de videoconferencia y equipos de grabación profesional.",
      features: ["Proyectores 4K", "Pantallas LED gigantes", "Sistemas de videoconferencia", "Equipos de grabación"],
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Coordinación y Logística",
      description: "Planificación integral y coordinación profesional para que cada detalle de tu evento sea ejecutado a la perfección.",
      features: ["Planificación del evento", "Coordinación en sitio", "Gestión de proveedores", "Timeline detallado"],
      gradient: "from-indigo-600 to-blue-600"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Soporte Técnico",
      description: "Asistencia técnica especializada durante todo el evento, asegurando el funcionamiento óptimo de todos los equipos.",
      features: ["Técnicos especializados", "Soporte 24/7", "Mantenimiento preventivo", "Solución de problemas"],
      gradient: "from-gray-600 to-slate-600"
    }
  ];

  return (
    <section className="bg-black min-h-screen flex flex-col">
      <NavBar />

      {/* Header full width */}
      <div className="w-screen bg-gradient-to-r from-purple-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Nuestros Servicios
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto whitespace-pre-line">
            {`Ofrecemos soluciones integrales para eventos con equipos de primera calidad,\npersonal especializado y un servicio excepcional que garantiza el éxito de tu celebración.`}
          </p>
        </div>
      </div>

      {/* Contenido servicios */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-500 hover:scale-105 w-80"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Icono */}
              <div className="relative overflow-hidden h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`bg-gradient-to-br ${service.gradient} p-6 rounded-full text-white transform group-hover:scale-110 transition-transform duration-500`}>
                    <div className="h-16 w-16 flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Servicio
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-purple-100">{service.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{service.description}</p>

                <div className={`transition-all duration-500 ${hoveredCard === index ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300 text-xs">
                        <div className={`w-1.5 h-1.5 bg-gradient-to-r ${service.gradient} rounded-full mr-2 flex-shrink-0`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg hover:shadow-purple-500/25 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 opacity-90 hover:opacity-100`}>
                  Solicitar Cotización
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
            <div className="text-gray-300">Eventos Realizados</div>
          </div>
          <div className="text-center bg-gradient-to-br from-blue-900/20 to-gray-800/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-gray-300">Soporte Técnico</div>
          </div>
          <div className="text-center bg-gradient-to-br from-green-900/20 to-gray-800/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">15+</div>
            <div className="text-gray-300">Años de Experiencia</div>
          </div>
          <div className="text-center bg-gradient-to-br from-yellow-900/20 to-gray-800/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
            <div className="text-gray-300">Satisfacción del Cliente</div>
          </div>
        </div>
      </main>

      {/* Footer separado abajo */}
      <footer className="mt-20">
        <Footer />
      </footer>
    </section>
  );
};

export default ServicesSection;
