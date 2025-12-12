import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react";

const CalendarioContent = ({ showToast }) => {
  const [eventos, setEventos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // month, week

  // Cargar eventos y reservas - MEMOIZADO
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventosRes, reservasRes] = await Promise.all([
        fetch("http://localhost:4000/api/eventos?limit=1000"), // Obtener todos los eventos para el calendario
        fetch("http://localhost:4000/api/reservas?limit=1000")  // Obtener todas las reservas para el calendario
      ]);
        
        const eventosData = await eventosRes.json();
        const reservasData = await reservasRes.json();
        
        // Extraer datos de las respuestas paginadas
        const eventos = eventosData.eventos || eventosData.data || eventosData;
        const reservas = reservasData.reservas || reservasData.data || reservasData;
        
        setEventos(eventos);
        setReservas(reservas);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        showToast("Error al cargar el calendario", "error");
      } finally {
        setLoading(false);
      }
    }, [showToast]);

    // Ejecutar al montar el componente
    useEffect(() => {
      fetchData();
    }, [fetchData]);

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Obtener eventos y reservas de un día específico
  const getItemsForDay = (date) => {
    if (!date) return { eventos: [], reservas: [] };
    
    const dateStr = date.toISOString().split('T')[0];
    
    const eventosDelDia = eventos.filter(e => {
      const eventoDate = new Date(e.fechaEvento).toISOString().split('T')[0];
      return eventoDate === dateStr;
    });
    
    const reservasDelDia = reservas.filter(r => {
      const reservaDate = new Date(r.fechaEvento).toISOString().split('T')[0];
      return reservaDate === dateStr;
    });
    
    return { eventos: eventosDelDia, reservas: reservasDelDia };
  };

  // Navegación de meses
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('es', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Modal de detalle del día
  const DayDetailModal = ({ date, onClose }) => {
    if (!date) return null;
    
    const { eventos: eventosDelDia, reservas: reservasDelDia } = getItemsForDay(date);
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 border-b border-purple-500/30 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Eventos */}
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Eventos ({eventosDelDia.length})
              </h4>
              {eventosDelDia.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay eventos programados</p>
              ) : (
                <div className="space-y-3">
                  {eventosDelDia.map(evento => (
                    <div key={evento._id} className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{evento.nombreEvento}</h5>
                          <p className="text-sm text-gray-400 mt-1">{evento.tipoEvento}</p>
                          <p className="text-sm text-gray-400">{evento.direccion}</p>
                          <p className="text-sm text-gray-400">Cliente: {evento.nombreCliente}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                          evento.estado === "confirmada" ? "bg-green-600/30 text-green-400" :
                          evento.estado === "pendiente" ? "bg-yellow-600/30 text-yellow-400" :
                          evento.estado === "cancelada" ? "bg-red-600/30 text-red-400" :
                          "bg-blue-600/30 text-blue-400"
                        }`}>
                          {evento.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reservas */}
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reservas ({reservasDelDia.length})
              </h4>
              {reservasDelDia.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay reservas programadas</p>
              ) : (
                <div className="space-y-3">
                  {reservasDelDia.map(reserva => (
                    <div key={reserva._id} className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{reserva.nombreEvento}</h5>
                          <p className="text-sm text-gray-400 mt-1">Cliente: {reserva.nombreCliente}</p>
                          {reserva.email && <p className="text-sm text-gray-400">{reserva.email}</p>}
                          {reserva.telefono && <p className="text-sm text-gray-400">{reserva.telefono}</p>}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                          reserva.estado === "confirmada" ? "bg-green-600/30 text-green-400" :
                          reserva.estado === "pendiente" ? "bg-yellow-600/30 text-yellow-400" :
                          reserva.estado === "cancelada" ? "bg-red-600/30 text-red-400" :
                          "bg-blue-600/30 text-blue-400"
                        }`}>
                          {reserva.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white">Calendario de Eventos y Reservas</h2>
        
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Hoy
          </button>
          
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            
            <span className="px-4 text-white font-semibold capitalize min-w-[200px] text-center">
              {monthName}
            </span>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600/40 rounded"></div>
          <span className="text-gray-300">Eventos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600/40 rounded"></div>
          <span className="text-gray-300">Reservas</span>
        </div>
      </div>

      {/* Calendario */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando calendario...</div>
      ) : (
        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl overflow-hidden">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 bg-purple-600/20 border-b border-purple-500/30">
            {weekDays.map(day => (
              <div key={day} className="px-2 py-3 text-center text-sm font-semibold text-purple-300">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid de días */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="border border-purple-500/10 p-2 bg-gray-800/30 min-h-[120px]"></div>;
              }
              
              const { eventos: eventosDelDia, reservas: reservasDelDia } = getItemsForDay(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const hasItems = eventosDelDia.length > 0 || reservasDelDia.length > 0;
              
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => hasItems && setSelectedDay(day)}
                  className={`border border-purple-500/10 p-2 min-h-[120px] transition-all ${
                    hasItems ? 'cursor-pointer hover:bg-purple-600/10' : ''
                  } ${isToday ? 'bg-purple-600/20' : ''}`}
                >
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday ? 'text-purple-400' : 'text-gray-300'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {/* Mostrar indicadores de eventos */}
                    {eventosDelDia.slice(0, 2).map(evento => (
                      <div key={evento._id} className="bg-purple-600/40 rounded px-2 py-1 text-xs text-white truncate">
                        {evento.nombreEvento}
                      </div>
                    ))}
                    
                    {/* Mostrar indicadores de reservas */}
                    {reservasDelDia.slice(0, 2).map(reserva => (
                      <div key={reserva._id} className="bg-blue-600/40 rounded px-2 py-1 text-xs text-white truncate">
                        {reserva.nombreEvento}
                      </div>
                    ))}
                    
                    {/* Indicador de más items */}
                    {(eventosDelDia.length + reservasDelDia.length) > 2 && (
                      <div className="text-xs text-gray-400 px-2">
                        +{eventosDelDia.length + reservasDelDia.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      {selectedDay && (
        <DayDetailModal date={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
};

export default CalendarioContent;