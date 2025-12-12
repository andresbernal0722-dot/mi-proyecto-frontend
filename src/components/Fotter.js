import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Music,
  Lightbulb,
  Calendar,
  Users,
  Award,
  ArrowUp,
  Heart
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavigation = (path) => {
    // Reemplaza con tu lógica de navegación
    console.log(`Navegando a: ${path}`);
  };

  const currentYear = new Date().getFullYear();

  const companyInfo = {
    name: "Souno Logistica",
    slogan: "Iluminamos tus momentos más importantes",
    description: "Especialistas en equipos profesionales de sonido e iluminación para eventos únicos e inolvidables."
  };

  const quickLinks = [
    { label: "Inicio", path: "/" },
    { label: "Servicios", path: "/servicios" },
    { label: "Eventos", path: "/eventos" },
    { label: "Nosotros", path: "/nosotros" },
    { label: "Galería", path: "/galeria" },
    { label: "Blog", path: "/blog" }
  ];

  const services = [
    { label: "Sonido Profesional", icon: Music },
    { label: "Iluminación LED", icon: Lightbulb },
    { label: "Organización de Eventos", icon: Calendar },
    { label: "Equipos Audiovisuales", icon: Users }
  ];

  const contactInfo = {
    phone: "+57 3186889686",
    email: "ventas@suonologistic.com",
    address: "Cra 70 # 2A-18, Bogotá, Colombia"
  };

  const socialLinks = [
    { icon: Facebook, url: "#", label: "Facebook" },
    { icon: Instagram, url: "#", label: "Instagram" },
    { icon: Twitter, url: "#", label: "Twitter" },
    { icon: Youtube, url: "#", label: "YouTube" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {companyInfo.name}
                </h3>
              </div>
            </div>
            
            <p className="text-purple-200 font-medium mb-4 italic">
              {companyInfo.slogan}
            </p>
            
            <p className="text-gray-400 leading-relaxed mb-6">
              {companyInfo.description}
            </p>

            {/* Awards/Certifications */}
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <Award className="h-4 w-4 text-purple-400" />
              <span>Certificados profesionales</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="text-gray-400 hover:text-white hover:text-purple-300 transition-all duration-300 hover:translate-x-2"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-6">Nuestros Servicios</h4>
            <ul className="space-y-3">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <li key={index} className="flex items-center space-x-3 group">
                    <IconComponent className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                    <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      {service.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-6">Contáctanos</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <Phone className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 flex-shrink-0 mt-0.5" />
                <div>
                  <a 
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {contactInfo.phone}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Lun - Sab: 8:00 AM - 8:00 PM</p>
                </div>
              </li>
              
              <li className="flex items-start space-x-3 group">
                <Mail className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 flex-shrink-0 mt-0.5" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 break-all"
                >
                  {contactInfo.email}
                </a>
              </li>
              
              <li className="flex items-start space-x-3 group">
                <MapPin className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                  {contactInfo.address}
                </span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h5 className="text-sm font-medium text-purple-300 mb-4">Síguenos</h5>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110"
                    >
                      <IconComponent className="h-4 w-4 text-purple-300 group-hover:text-white transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="border-t border-purple-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400 text-sm">
              <p>© {currentYear} {companyInfo.name}. Todos los derechos reservados.</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleNavigation('/privacidad')}
                  className="hover:text-purple-300 transition-colors duration-300"
                >
                  Privacidad
                </button>
                <button 
                  onClick={() => handleNavigation('/terminos')}
                  className="hover:text-purple-300 transition-colors duration-300"
                >
                  Términos
                </button>
                <button 
                  onClick={() => handleNavigation('/pqrs')}
                  className="hover:text-purple-300 transition-colors duration-300"
                >
                  PQRS
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Hecho con</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>en Colombia</span>
              </div>
              
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110"
                aria-label="Volver arriba"
              >
                <ArrowUp className="h-4 w-4 text-purple-300 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient lighting effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-purple-600/10 to-transparent blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;