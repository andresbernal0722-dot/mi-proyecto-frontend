import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar,Star, Quote } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Fotter';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentClient, setCurrentClient] = useState(0);
  
  // Datos del carrusel principal
  const heroSlides = [
    {
      title: "Iluminamos Tus Eventos",
      subtitle: "Equipos profesionales de sonido e iluminación para eventos únicos",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      cta: "Ver Servicios"
    },
    {
      title: "Sonido Profesional",
      subtitle: "Sistemas de audio de alta calidad para bodas, conferencias y conciertos",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      cta: "Cotizar Ahora"
    },
    {
      title: "Tecnología Avanzada",
      subtitle: "Los mejores equipos del mercado con soporte técnico especializado",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      cta: "Conocer Más"
    }
  ];

  // Eventos participados
  const pastEvents = [
    {
      title: "Boda García-Martínez",
      date: "15 Marzo 2024",
      type: "Boda",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Iluminación romántica y sonido cristalino para 200 invitados"
    },
    {
      title: "Conferencia Tech Summit",
      date: "28 Febrero 2024",
      type: "Corporativo",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Equipos audiovisuales para 500 asistentes en evento corporativo"
    },
    {
      title: "Festival de Música Local",
      date: "10 Febrero 2024",
      type: "Concierto",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Sistema de sonido profesional para festival al aire libre"
    }
  ];

  // Próximos eventos
  const upcomingEvents = [
    {
      title: "Graduación Universidad Central",
      date: "5 Abril 2024",
      type: "Graduación",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSyrpX0nCTFJ-rgON-7qUq9XEEQDVh_ZtUrA&s"
    },
    {
      title: "Lanzamiento Producto XYZ",
      date: "12 Abril 2024",
      type: "Corporativo",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Concierto Sinfónico",
      date: "20 Abril 2024",
      type: "Musical",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  // Testimonios
  const testimonials = [
    {
      name: "María González",
      role: "Coordinadora de Eventos",
      company: "Empresa ABC",
      text: "Excelente servicio y equipos de primera calidad. Hicieron que nuestro evento corporativo fuera un éxito total.",
      rating: 5
    },
    {
      name: "Carlos Ruiz",
      role: "Novio",
      company: "Boda Personal",
      text: "La iluminación y el sonido de nuestra boda fueron perfectos. Todo funcionó sin problemas y el equipo fue muy profesional.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Organizadora",
      company: "Festival Cultural",
      text: "Su experiencia en eventos masivos es increíble. Los equipos aguantaron toda la noche sin problemas.",
      rating: 5
    }
  ];

  // Clientes
  const clients = [
    { name: "cas colegio colombo americano", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLL9acNzmLTjBk4_WWsF40OITJsjvkP1_ubg4XV0AmreO7gu7CPpNLQt_IORz1WelFUp4&usqp=CAU" },
    { name: "consejo noruego para refugiados", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTAPe7Z02a0HHumhuPjakAoe4S8OQgNirHAw&s" },
    { name: "centro comercial hacienda santa barbara", logo: "https://www.bogotamiciudad.com/_imagenes/directorio/121551.jpg" },
    { name: "Coltanques", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9m6Y-2hc7HtJYFWvo8AOWrpxFeCQOVJK0Og&s" },
    { name: "Universidad de Los Andes", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiVQOBH-C71NQLFXXbYjF7PfE2vmxQ_LJQgg&s" },
    { name: "universidad nacional abierta y a distancia", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcMC2RU6IOcWig1DyJg5T1JRlClItq7n7YHg&s" },
    { name: "universidad santo tomas", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjUU1rI7TK3Z04p7J_WOS5k2JREjhyXORBBQ&s" },
    { name: "Centro Comercial Andino", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__lS9_l9b-80Ng744IpyVn4uXHqF7gq-ZIg&s" }
  ];

  // Auto-scroll para carruseles
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    const clientInterval = setInterval(() => {
      setCurrentClient((prev) => (prev + 1) % Math.ceil(clients.length / 3));
    }, 3000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(testimonialInterval);
      clearInterval(clientInterval);
    };
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      {/* Carrusel Principal */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-black/60 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                    <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      {slide.title}
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
                    {slide.subtitle}
                  </p>
                  <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 animate-fade-in-up animation-delay-400">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-purple-600/20 hover:bg-purple-600/40 backdrop-blur-sm p-2 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-purple-600/20 hover:bg-purple-600/40 backdrop-blur-sm p-2 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-purple-500 scale-125' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Eventos Participados */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Eventos Realizados
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {pastEvents.map((event, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-500 hover:transform hover:scale-105 w-80"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {event.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-purple-100">{event.title}</h3>
                  <p className="text-gray-300 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                    {event.date}
                  </p>
                  <p className="text-gray-400">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Próximos Eventos
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-purple-800/20 to-black/40 backdrop-blur-sm border border-purple-400/30 rounded-xl overflow-hidden hover:border-purple-400/60 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 w-80"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="bg-purple-600 px-2 py-1 rounded text-sm font-semibold">
                      {event.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-purple-100">{event.title}</h3>
                  <p className="text-purple-300 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Lo Que Dicen Nuestros Clientes
            </span>
          </h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center">
                      <Quote className="h-12 w-12 text-purple-400 mx-auto mb-6" />
                      <p className="text-xl text-gray-200 mb-6 italic">"{testimonial.text}"</p>
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <h4 className="text-lg font-bold text-purple-100">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.role} - {testimonial.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clientes */}
      <section className="py-20 bg-black border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Clientes que Confían en Nosotros
          </span>
        </h2>

        <div className="relative overflow-hidden">
          <div className="flex w-max animate-scroll space-x-12">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-800/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/30 rounded-full hover:border-purple-400/50 transition-all duration-300 hover:scale-110"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-20 h-20 object-contain rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>




      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default HomePage;