import React, { useState, useEffect } from 'react';
import {
  Calendar, User, CheckCircle, AlertCircle, Star, Phone, Mail
} from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Fotter';

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

const ReservaPage = () => {
  const [reservaData, setReservaData] = useState({
    nombreEvento: '',
    tipoEvento: '',
    fechaEvento: '',
    horaInicio: '',
    horaFin: '',
    direccion: '',
    descripcionEvento: '',
    nombreCliente: '',
    emailCliente: '',
    telefonoCliente: '',
    empresaCliente: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar datos del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = decodeJWT(token);
      if (userData) {
        setReservaData(prev => ({
          ...prev,
          nombreCliente: userData.nombre || '',
          emailCliente: userData.email || '',
          telefonoCliente: userData.telefono || '',
          empresaCliente: userData.empresa || ''
        }));
      }
    }
  }, []);

  const tiposEvento = [
    { value: 'boda', label: 'Boda', icon: '💒' },
    { value: 'corporativo', label: 'Evento Corporativo', icon: '🏢' },
    { value: 'cumpleanos', label: 'Cumpleaños', icon: '🎂' },
    { value: 'conferencia', label: 'Conferencia', icon: '🎤' },
    { value: 'concierto', label: 'Concierto', icon: '🎵' },
    { value: 'graduacion', label: 'Graduación', icon: '🎓' },
    { value: 'lanzamiento', label: 'Lanzamiento de Producto', icon: '🚀' },
    { value: 'otros', label: 'Otros', icon: '🎉' }
  ];

  const handleInputChange = (name, value) => {
    setReservaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const esFechaValida = (fechaStr) => {
    if (!fechaStr) return false;
    const hoy = new Date();
    const fechaEvento = new Date(fechaStr);
    const diferenciaDias = (fechaEvento - hoy) / (1000 * 60 * 60 * 24);
    return diferenciaDias >= 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!esFechaValida(reservaData.fechaEvento)) {
      alert('La fecha del evento debe ser al menos con 3 días de anticipación.');
      return;
    }
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
  
    try {
      console.log('📤 Enviando solicitud de reserva...');
  
      const response = await fetch('http://localhost:4000/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(reservaData)
      });
  
      if (response.status === 401) {
        const data = await response.json();
        console.error('🚫 Error de autenticación:', data.message);
        
        if (data.expired) {
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          alert('Error de autenticación. Por favor, inicia sesión nuevamente.');
        }
        
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(errorData.message || 'Error al enviar la solicitud');
        return;
      }
  
      const data = await response.json();
      console.log('✅ Solicitud enviada exitosamente:', data);
  
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 10000);
  
      // Reset form
      setReservaData({
        nombreEvento: '',
        tipoEvento: '',
        fechaEvento: '',
        horaInicio: '',
        horaFin: '',
        direccion: '',
        descripcionEvento: '',
        nombreCliente: reservaData.nombreCliente,
        emailCliente: reservaData.emailCliente,
        telefonoCliente: reservaData.telefonoCliente,
        empresaCliente: reservaData.empresaCliente
      });
  
    } catch (error) {
      console.error('❌ Error al enviar la solicitud:', error);
      alert('Hubo un problema al enviar la solicitud. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = () => {
    return reservaData.nombreEvento && 
           reservaData.tipoEvento && 
           reservaData.fechaEvento &&
           esFechaValida(reservaData.fechaEvento) &&
           reservaData.nombreCliente &&
           reservaData.emailCliente;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Solicitar Reserva
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Completa el formulario y nuestro equipo se pondrá en contacto contigo para asignar los equipos necesarios
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {formSubmitted && (
          <div className="mb-8 bg-green-900/20 border border-green-500/30 rounded-xl p-6 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-400">¡Solicitud Enviada!</h3>
              <p className="text-green-300">
                Hemos recibido tu solicitud. Nuestro equipo revisará los detalles y te contactará dentro de las próximas 24 horas para confirmar disponibilidad y asignar los equipos necesarios.
              </p>
            </div>
          </div>
        )}

        {!esFechaValida(reservaData.fechaEvento) && reservaData.fechaEvento && (
          <div className="mb-8 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-400">Fecha inválida</h3>
              <p className="text-yellow-300">
                La fecha del evento debe ser con al menos 3 días de anticipación.
              </p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-purple-200 mb-8 flex items-center">
              <Calendar className="h-8 w-8 mr-3" />
              Datos del Evento
            </h2>

            <div className="space-y-8">
              {/* Información del Evento */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Información del Evento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Nombre del Evento *
                    </label>
                    <input
                      type="text"
                      value={reservaData.nombreEvento}
                      onChange={(e) => handleInputChange('nombreEvento', e.target.value)}
                      required
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="Ej. Boda de María y Juan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Tipo de Evento *
                    </label>
                    <select
                      value={reservaData.tipoEvento}
                      onChange={(e) => handleInputChange('tipoEvento', e.target.value)}
                      required
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposEvento.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.icon} {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Fecha del Evento *
                    </label>
                    <input
                      type="date"
                      value={reservaData.fechaEvento}
                      onChange={(e) => handleInputChange('fechaEvento', e.target.value)}
                      required
                      min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Hora de Inicio
                    </label>
                    <input
                      type="time"
                      value={reservaData.horaInicio}
                      onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Hora de Finalización
                    </label>
                    <input
                      type="time"
                      value={reservaData.horaFin}
                      onChange={(e) => handleInputChange('horaFin', e.target.value)}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      value={reservaData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="Calle, carrera, ciudad"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-purple-300 mb-2">
                    Descripción del Evento
                  </label>
                  <textarea
                    value={reservaData.descripcionEvento}
                    onChange={(e) => handleInputChange('descripcionEvento', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Describe tu evento, ambiente deseado, cantidad aproximada de invitados, necesidades especiales..."
                  />
                </div>
              </div>

              {/* Información del Cliente */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={reservaData.nombreCliente}
                      onChange={(e) => handleInputChange('nombreCliente', e.target.value)}
                      required
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={reservaData.emailCliente}
                      onChange={(e) => handleInputChange('emailCliente', e.target.value)}
                      required
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="tu.email@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={reservaData.telefonoCliente}
                      onChange={(e) => handleInputChange('telefonoCliente', e.target.value)}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Empresa/Organización
                    </label>
                    <input
                      type="text"
                      value={reservaData.empresaCliente}
                      onChange={(e) => handleInputChange('empresaCliente', e.target.value)}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="Nombre de empresa (opcional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                <strong>Nota:</strong> Una vez enviada tu solicitud, nuestro equipo te contactará para:
              </p>
              <ul className="mt-2 space-y-1 text-blue-300 text-sm ml-4">
                <li>• Confirmar disponibilidad para tu fecha</li>
                <li>• Asignar los equipos según tus necesidades</li>
                <li>• Calcular el costo total del servicio</li>
                <li>• Coordinar los detalles logísticos</li>
              </ul>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={!canSubmit() || loading}
                className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center ${
                  canSubmit() && !loading
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transform hover:scale-105'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Características del Servicio */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              ¿Cómo funciona?
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-500/40 transition-all duration-300">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Envía tu solicitud</h3>
              <p className="text-gray-300">Completa el formulario con los detalles de tu evento</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-500/40 transition-all duration-300">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Revisamos y contactamos</h3>
              <p className="text-gray-300">Nuestro equipo asigna equipos y calcula costos</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-500/40 transition-all duration-300">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Confirmación</h3>
              <p className="text-gray-300">Recibes la confirmación y detalles finales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-black border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            ¿Necesitas asesoría personalizada?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Nuestros expertos están listos para ayudarte a planificar el evento perfecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              Llamar Ahora
            </button>
            <button className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              Enviar WhatsApp
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ReservaPage;