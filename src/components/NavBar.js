import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ChevronDown,
  Home,
  Briefcase,
  Calendar,
  Mail,
  LogOut,
  UserPlus,
  LogIn,
  Settings,
  FileText
} from 'lucide-react';

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}


const NavBar = () => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [token, setToken] = useState(localStorage?.getItem('token') || null);
  const [userFromToken, setUserFromToken] = useState(null);
  
  
  useEffect(() => {
    if (token) {
      const decodedUser = decodeJWT(token);
      console.log("Token decodificado:", decodedUser);
      setUserFromToken(decodedUser);
    }
  }, [token]);
  
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavigation = (path) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

const handleLogout = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  }
  setToken(null);
  setDropdownOpen(false);
  navigate('/login');
};


  const navLinks = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/servicios', label: 'Servicios', icon: Briefcase },
    { to: '/eventos', label: 'Eventos', icon: Calendar },
    { to: '/contacto', label: 'Contáctanos', icon: Mail }
  ];

  // Aplicar el fondo igual que el header que me mostraste
  const navbarBackground = 'bg-gradient-to-r from-purple-900 to-black';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navbarBackground} ${isScrolled ? 'shadow-lg shadow-purple-900/80' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 group">
            <button onClick={() => handleNavigation('/')} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-white font-bold text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Souno Logistica
              </span>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.to}
                    onClick={() => handleNavigation(link.to)}
                    className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white transition-all duration-300 hover:bg-purple-700/30"
                  >
                    <IconComponent className="h-4 w-4 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="font-medium">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative user-dropdown">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-800/50 hover:bg-purple-900/70 transition-all duration-300 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              {token && userFromToken && (
                <span className="hidden sm:block text-white font-medium max-w-32 truncate">
                {userFromToken.nombre}
              </span>
              )}
              <ChevronDown className={`h-4 w-4 text-purple-300 transition-transform duration-300 ${
                dropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-lg border border-purple-700 rounded-xl shadow-2xl shadow-purple-700/40 overflow-hidden">
                {token ? (
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-purple-700/30">
                      <p className="text-sm text-gray-400">Conectado como</p>
                      <p className="text-white font-medium truncate">{userFromToken?.email}</p>
                      </div>

                    <button
                      onClick={() => handleNavigation('/reservas')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-700/20 transition-all duration-200"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Mis Reservas</span>
                    </button>

                    <button
                      onClick={() => handleNavigation('/cuenta')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-700/20 transition-all duration-200"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Mi Cuenta</span>
                    </button>

                    <button
                      onClick={() => handleNavigation('/historial')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-700/20 transition-all duration-200"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Historial</span>
                    </button>

                    <div className="border-t border-purple-700/30 mt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <button
                      onClick={() => handleNavigation('/login')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-700/20 transition-all duration-200"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Iniciar Sesión</span>
                    </button>

                    <button
                      onClick={() => handleNavigation('/login')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-700/20 transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Registrarse</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-700/20 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-current block transition-all duration-300 h-0.5 w-6 transform ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-0.5'
                }`} />
                <span className={`bg-current block transition-all duration-300 h-0.5 w-6 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <span className={`bg-current block transition-all duration-300 h-0.5 w-6 transform ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0.5'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2 bg-black/60 backdrop-blur-lg rounded-lg border border-purple-700/30 p-4">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.to}
                    onClick={() => handleNavigation(link.to)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-purple-700/20 transition-all duration-300"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
