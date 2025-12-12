import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, X, Music,Award } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Fotter';

const EventosPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [eventos, setEventos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/eventos')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar eventos');
        return res.json();
      })
      .then(data => {
        const eventosMapeados = data.map(evento => ({
          id: evento._id,
          title: evento.nombreEvento || '',
          location: evento.direccion || '',
          type: evento.tipoEvento || '',
          description: evento.descripcionEvento || '',
          date: evento.fechaEvento || '',
          time: evento.horaInicio || '',
          guests: evento.equiposSeleccionados ? evento.equiposSeleccionados.length : 0,
          status: evento.estado || 'proximo',
          services: evento.servicios || [],
          equipment: evento.equiposSeleccionados ? evento.equiposSeleccionados.map(e => e.nombre) : [],
          budget: evento.total || '$0',
          testimonial: evento.testimonial || null,
        }));
        setEventos(eventosMapeados);
      })
      .catch(err => console.error(err));
  }, []);

  const filtros = [
    { key: 'todos', label: 'Todos los Eventos' },
    { key: 'Boda', label: 'Boda' },
    { key: 'Corporativo', label: 'Corporativo' },
    { key: 'Concierto', label: 'Concierto' },
    { key: 'Musical', label: 'Musical' },
    { key: 'Graduación', label: 'Graduación' }
  ];

  const eventosFiltrados = eventos
    .filter(evento => activeFilter === 'todos' || evento.type === activeFilter)
    .filter(evento =>
      (evento.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (evento.location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (evento.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

  const openModal = (evento) => {
    setSelectedEvent(evento);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEvent(null);
    document.body.style.overflow = 'unset';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Boda': return <Award className="h-4 w-4" />;
      case 'Corporativo': return <Users className="h-4 w-4" />;
      case 'Concierto':
      case 'Musical': return <Music className="h-4 w-4" />;
      case 'Graduación': return <Award className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'realizado') {
      return <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Realizado</span>;
    }
    return <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Próximo</span>;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <section className="py-20 bg-gradient-to-r from-purple-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Nuestros Eventos
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Descubre la magia de nuestros eventos con equipos profesionales de sonido e iluminación
          </p>
        </div>
      </section>

      <section className="py-8 bg-gray-900 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {filtros.map((filtro) => (
              <button
                key={filtro.key}
                onClick={() => setActiveFilter(filtro.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeFilter === filtro.key
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar evento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all w-full md:w-64"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {eventosFiltrados.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">No se encontraron eventos.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventosFiltrados.map((evento) => (
                <div
                  key={evento.id}
                  onClick={() => openModal(evento)}
                  className="group bg-gradient-to-br from-purple-900/20 to-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-500 cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    {getStatusBadge(evento.status)}
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
                      {getTypeIcon(evento.type)}
                      {evento.type}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-purple-100">{evento.title}</h3>
                  <p className="text-gray-300 mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-400" /> {evento.date}
                  </p>
                  <p className="text-gray-300 mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-400" /> {evento.location}
                  </p>
                  <p className="text-gray-300 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-400" /> {evento.guests} invitados
                  </p>
                  <p className="text-gray-400 text-sm line-clamp-3">{evento.description}</p>
                  <div className="mt-3 text-purple-400 text-sm font-semibold">Click para ver detalles →</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal solo con texto */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
              onClick={closeModal}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-gray-900 rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="absolute top-4 right-4">
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                <p className="mb-1 text-gray-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" /> {selectedEvent.date}
                </p>
                <p className="mb-1 text-gray-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" /> {selectedEvent.time}
                </p>
                <p className="mb-1 text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-400" /> {selectedEvent.location}
                </p>
                <p className="mb-2 text-gray-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" /> {selectedEvent.guests} invitados
                </p>
                <p className="text-gray-400 mb-2">{selectedEvent.description}</p>
                {selectedEvent.equipment.length > 0 && (
                  <div className="mb-2">
                    <h4 className="font-semibold text-purple-200">Equipos:</h4>
                    <ul className="list-disc ml-5 text-gray-300">
                      {selectedEvent.equipment.map((eq, idx) => <li key={idx}>{eq}</li>)}
                    </ul>
                  </div>
                )}
                {selectedEvent.services.length > 0 && (
                  <div className="mb-2">
                    <h4 className="font-semibold text-purple-200">Servicios:</h4>
                    <ul className="list-disc ml-5 text-gray-300">
                      {selectedEvent.services.map((srv, idx) => <li key={idx}>{srv}</li>)}
                    </ul>
                  </div>
                )}
                {selectedEvent.budget && (
                  <p className="text-purple-400 font-semibold">Presupuesto: {selectedEvent.budget}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventosPage;
