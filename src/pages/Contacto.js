import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send, MessageCircle, AlertCircle, ThumbsUp, CheckCircle, User
} from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Fotter';

const ContactoPQRSPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    tipoPQRS: 'peticion',
    mensaje: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const tiposPQRS = [
    { value: 'peticion', label: 'Petición', icon: <MessageCircle className="h-4 w-4" />, color: 'blue' },
    { value: 'queja', label: 'Queja', icon: <AlertCircle className="h-4 w-4" />, color: 'red' },
    { value: 'reclamo', label: 'Reclamo', icon: <AlertCircle className="h-4 w-4" />, color: 'orange' },
    { value: 'sugerencia', label: 'Sugerencia', icon: <ThumbsUp className="h-4 w-4" />, color: 'green' }
  ];

  const faqItems = [
    {
      pregunta: "¿Con cuánta anticipación debo solicitar una cotización?",
      respuesta: "Recomendamos solicitar la cotización con al menos 30 días de anticipación para eventos pequeños y 60 días para eventos grandes, para garantizar disponibilidad y mejores precios."
    },
    {
      pregunta: "¿Ofrecen servicios fuera de Bogotá?",
      respuesta: "Sí, prestamos servicios en toda Colombia. Para eventos fuera de Bogotá se aplican costos adicionales de transporte y logística."
    },
    {
      pregunta: "¿Qué incluye el soporte técnico durante el evento?",
      respuesta: "Incluye un técnico especializado durante todo el evento, monitoreo constante de equipos, y soporte inmediato ante cualquier inconveniente técnico."
    },
    {
      pregunta: "¿Manejan eventos al aire libre?",
      respuesta: "Absolutamente. Tenemos equipos especializados para eventos al aire libre, incluyendo protección contra clima y generadores de energía."
    }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validación de campos obligatorios
    const camposFaltantes = [];
    if (!formData.nombre) camposFaltantes.push('nombre');
    if (!formData.email) camposFaltantes.push('email');
    if (!formData.mensaje) camposFaltantes.push('mensaje');
    
    if (camposFaltantes.length > 0) {
      alert(`Por favor completa los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/contactos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el formulario');
      }

      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 5000);

      // Reset form
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        tipoPQRS: 'peticion',
        mensaje: ''
      });

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un problema al enviar el formulario. Intenta más tarde.');
    }
  };

  const getPQRSColor = (tipo) => {
    const colors = {
      peticion: 'blue-500',
      queja: 'red-500',
      reclamo: 'orange-500',
      sugerencia: 'green-500'
    };
    return colors[tipo] || 'purple-500';
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      < NavBar />
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              PQRS
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Peticiones, Quejas, Reclamos y Sugerencias
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            {formSubmitted && (
              <div className="mb-8 bg-green-900/20 border border-green-500/30 rounded-xl p-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-400">¡Mensaje Enviado!</h3>
                  <p className="text-green-300">Te contactaremos dentro de las próximas 24 horas.</p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
              <div className="space-y-6">
                
                {/* Información Personal */}
                <div>
                  <h2 className="text-2xl font-bold text-purple-200 mb-6 flex items-center">
                    <User className="h-6 w-6 mr-2" />
                    Datos para PQRS
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
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
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
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
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
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
                        value={formData.empresa}
                        onChange={(e) => handleInputChange('empresa', e.target.value)}
                        className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>
                </div>

                {/* Tipo de PQRS */}
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-4">
                    Tipo de PQRS *
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tiposPQRS.map((tipo) => (
                      <div
                        key={tipo.value}
                        onClick={() => handleInputChange('tipoPQRS', tipo.value)}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          formData.tipoPQRS === tipo.value
                            ? `border-${getPQRSColor(tipo.value)} bg-${getPQRSColor(tipo.value)}/10`
                            : 'border-gray-600 bg-gray-800/30 hover:border-purple-500/50'
                        }`}
                      >
                        <div className={`mr-3 text-${getPQRSColor(tipo.value)}`}>
                          {tipo.icon}
                        </div>
                        <span className="font-medium">{tipo.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) => handleInputChange('mensaje', e.target.value)}
                    rows={6}
                    className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                    placeholder="Describe detalladamente tu petición, queja, reclamo o sugerencia..."
                  ></textarea>
                </div>

                {/* Botón de Envío */}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-12 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center mx-auto"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Enviar PQRS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Información de Contacto */}
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-purple-200 mb-6">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-purple-400 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p className="text-gray-300">logisticsuono@gmail.com</p>
                    <p className="text-gray-400 text-sm">logisticsuono@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-purple-400 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Teléfonos</p>
                    <p className="text-gray-300">+57 (1) 234-5678</p>
                    <p className="text-gray-400 text-sm">+57 300 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-purple-400 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Oficina Principal</p>
                    <p className="text-gray-300">Calle 123 #45-67</p>
                    <p className="text-gray-400 text-sm">Bogotá, Colombia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-purple-400 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Horario de Atención</p>
                    <p className="text-gray-300">Lun - Vie: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-400 text-sm">Sáb: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa Simulado */}
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-purple-200 mb-4">Ubicación</h3>
              <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-gray-300">Mapa Interactivo</p>
                  <p className="text-gray-400 text-sm">Bogotá, Colombia</p>
                </div>
              </div>
            </div>

            {/* Tiempo de Respuesta */}
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-purple-200 mb-4">Tiempos de Respuesta</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Peticiones:</span>
                  <span className="text-purple-400 font-semibold">48 horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Quejas:</span>
                  <span className="text-purple-400 font-semibold">72 horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Reclamos:</span>
                  <span className="text-purple-400 font-semibold">72 horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sugerencias:</span>
                  <span className="text-purple-400 font-semibold">48 horas</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Preguntas Frecuentes
            </span>
          </h2>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-purple-200 mb-3 flex items-start">
                  <MessageCircle className="h-5 w-5 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                  {item.pregunta}
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.respuesta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-black border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            ¿Tienes alguna inquietud?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Estamos aquí para escucharte y mejorar continuamente nuestros servicios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Enviar PQRS
            </button>
          </div>
        </div>
      </section>
      < Footer />
    </div>
  );
};

export default ContactoPQRSPage;