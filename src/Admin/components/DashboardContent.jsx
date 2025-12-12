import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader,
} from "lucide-react";

const DashboardGraficas = () => {
  const [timeRange, setTimeRange] = useState("mes");
  const [animateCharts, setAnimateCharts] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de tu API - ajusta según tu configuración
  const API_URL = "http://localhost:4000/api/graficas";

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  useEffect(() => {
    if (dashboardData) {
      setTimeout(() => setAnimateCharts(true), 100);
    }
  }, [dashboardData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/dashboard?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || 'Error al procesar los datos');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 text-center">Error al cargar datos</h3>
          <p className="text-gray-400 text-center mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { kpis, reservasPorEstado, ingresosMensuales, tiposEventos, estadoInventario, equiposStockBajo, usuariosNuevos } = dashboardData;

  const totalReservas = reservasPorEstado.reduce((sum, r) => sum + r.cantidad, 0);

  const iconMap = {
    Clock: Clock,
    CheckCircle: CheckCircle,
    TrendingUp: TrendingUp,
    XCircle: XCircle,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Analytics</h1>
            <p className="text-gray-400">Visualización en tiempo real del sistema de reservas</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="semana">Última Semana</option>
            <option value="mes">Último Mes</option>
            <option value="trimestre">Último Trimestre</option>
            <option value="año">Último Año</option>
          </select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-900/40 to-gray-800/40 border border-purple-500/30 rounded-xl p-5 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Reservas</p>
                <p className="text-3xl font-bold text-white mt-1">{kpis.totalReservas}</p>
                <p className={`text-sm mt-2 flex items-center ${kpis.cambioReservas >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" /> {Math.abs(kpis.cambioReservas)}% vs anterior
                </p>
              </div>
              <Calendar className="h-10 w-10 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-gray-800/40 border border-blue-500/30 rounded-xl p-5 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ingresos Totales</p>
                <p className="text-2xl font-bold text-white mt-1">{formatPrice(kpis.ingresosTotales)}</p>
                <p className={`text-sm mt-2 flex items-center ${kpis.cambioIngresos >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" /> {Math.abs(kpis.cambioIngresos)}% vs anterior
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-gray-800/40 border border-green-500/30 rounded-xl p-5 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Equipos Totales</p>
                <p className="text-3xl font-bold text-white mt-1">{kpis.equiposTotales}</p>
                <p className="text-yellow-400 text-sm mt-2">{kpis.equiposMantenimiento} en mantenimiento</p>
              </div>
              <Package className="h-10 w-10 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/40 to-gray-800/40 border border-red-500/30 rounded-xl p-5 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Alertas Stock</p>
                <p className="text-3xl font-bold text-white mt-1">{kpis.alertasStock}</p>
                <p className="text-red-400 text-sm mt-2">Requiere atención</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
          </div>
        </div>

        {/* Gráficas principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos Mensuales - Gráfica de Barras */}
          <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
              Ingresos Mensuales
            </h3>
            {ingresosMensuales.length > 0 ? (
              <div className="space-y-4">
                {ingresosMensuales.map((data, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium text-sm">{data.mes}</span>
                      <div className="text-right">
                        <span className="text-white font-bold text-sm">{formatPrice(data.ingresos)}</span>
                        <span className="text-gray-400 text-xs ml-2">({data.reservas} reservas)</span>
                      </div>
                    </div>
                    <div className="relative h-8 bg-gray-700/50 rounded-lg overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg transition-all duration-1000 ease-out ${
                          animateCharts ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          width: animateCharts ? `${data.altura}%` : "0%",
                        }}
                      >
                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No hay datos de ingresos disponibles</p>
            )}
          </div>

          {/* Reservas por Estado - Dona */}
          <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6">Distribución de Reservas</h3>
            {reservasPorEstado.length > 0 ? (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {reservasPorEstado.map((item, index) => {
                        const total = reservasPorEstado.reduce((sum, r) => sum + r.cantidad, 0);
                        const percentage = (item.cantidad / total) * 100;
                        const prevPercentage = reservasPorEstado
                          .slice(0, index)
                          .reduce((sum, r) => sum + (r.cantidad / total) * 100, 0);
                        const strokeDasharray = `${percentage} ${100 - percentage}`;
                        const strokeDashoffset = -prevPercentage;

                        return (
                          <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="12"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000"
                            style={{
                              opacity: animateCharts ? 1 : 0,
                            }}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold text-white">{totalReservas}</span>
                      <span className="text-xs text-gray-400">Reservas</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {reservasPorEstado.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 truncate">{item.estado}</p>
                        <p className="text-sm font-bold text-white">{item.cantidad}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">No hay datos de reservas disponibles</p>
            )}
          </div>
        </div>

        {/* Estado del Inventario */}
        {estadoInventario.length > 0 && (
          <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Package className="mr-2 h-5 w-5 text-green-400" />
              Estado del Inventario por Categoría
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {estadoInventario.map((cat, index) => (
                <div key={index} className="text-center">
                  <p className="text-gray-300 font-medium mb-3">{cat.categoria}</p>
                  <div className="relative h-40 bg-gray-700/50 rounded-lg overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full bg-green-500 transition-all duration-1000 delay-${index * 100}`}
                      style={{
                        height: animateCharts ? `${cat.disponible}%` : "0%",
                      }}
                    />
                    <div
                      className={`absolute bottom-0 w-full bg-yellow-500 transition-all duration-1000 delay-${index * 100 + 200}`}
                      style={{
                        height: animateCharts ? `${cat.disponible + cat.mantenimiento}%` : "0%",
                      }}
                    />
                    <div
                      className={`absolute bottom-0 w-full bg-red-500 transition-all duration-1000 delay-${index * 100 + 400}`}
                      style={{
                        height: animateCharts ? `${cat.disponible + cat.mantenimiento + cat.noDisponible}%` : "0%",
                      }}
                    />
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="text-green-400">✓ {cat.disponible}%</p>
                    <p className="text-yellow-400">⚠ {cat.mantenimiento}%</p>
                    <p className="text-red-400">✗ {cat.noDisponible}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tipos de Eventos y Stock Bajo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tipos de Eventos */}
          {tiposEventos.length > 0 && (
            <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur">
              <h3 className="text-xl font-bold text-white mb-6">Tipos de Eventos Más Populares</h3>
              <div className="space-y-4">
                {tiposEventos.map((evento, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium">{evento.tipo}</span>
                      <span className="text-white font-bold">{evento.cantidad}</span>
                    </div>
                    <div className="relative h-6 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full rounded-full transition-all duration-1000 ease-out ${
                          animateCharts ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          width: animateCharts ? `${evento.porcentaje}%` : "0%",
                          backgroundColor: evento.color,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                      </div>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                        {evento.porcentaje}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipos con Stock Bajo */}
          {equiposStockBajo.length > 0 && (
            <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
                Equipos con Stock Bajo
              </h3>
              <div className="space-y-3">
                {equiposStockBajo.map((equipo, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all hover:scale-102 ${
                      equipo.urgencia === "alta"
                        ? "bg-red-900/20 border-red-500/30 hover:border-red-500/50"
                        : equipo.urgencia === "media"
                        ? "bg-yellow-900/20 border-yellow-500/30 hover:border-yellow-500/50"
                        : "bg-blue-900/20 border-blue-500/30 hover:border-blue-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-white font-medium">{equipo.nombre}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          equipo.urgencia === "alta"
                            ? "bg-red-500 text-white"
                            : equipo.urgencia === "media"
                            ? "bg-yellow-500 text-gray-900"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {equipo.urgencia}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${
                              equipo.urgencia === "alta"
                                ? "bg-red-500"
                                : equipo.urgencia === "media"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }`}
                            style={{
                              width: animateCharts ? `${(equipo.stock / equipo.stockMinimo) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm whitespace-nowrap">
                        {equipo.stock} / {equipo.stockMinimo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Usuarios Nuevos */}
        {usuariosNuevos.length > 0 && (
          <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-400" />
              Nuevos Usuarios Registrados
            </h3>
            <div className="flex items-end justify-around h-64 px-4">
              {usuariosNuevos.map((data, index) => {
                const maxValue = Math.max(...usuariosNuevos.map(u => u.clientes + u.admins), 1);
                const totalHeight = ((data.clientes + data.admins) / maxValue) * 100;
                const clientesHeight = (data.clientes / (data.clientes + data.admins)) * totalHeight;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="relative w-full max-w-16 h-52 bg-gray-700/30 rounded-t-lg overflow-hidden">
                      <div
                        className={`absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 transition-all duration-1000 delay-${index * 100}`}
                        style={{
                          height: animateCharts ? `${totalHeight}%` : "0%",
                        }}
                      >
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400"
                          style={{
                            height: totalHeight > 0 ? `${(clientesHeight / totalHeight) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <div className="absolute top-2 left-0 right-0 text-center">
                        <p className="text-white text-xs font-bold">{data.clientes + data.admins}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">{data.mes}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-blue-400 rounded" />
                <span className="text-gray-300 text-sm">Clientes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-600 to-purple-400 rounded" />
                <span className="text-gray-300 text-sm">Admins</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardGraficas;