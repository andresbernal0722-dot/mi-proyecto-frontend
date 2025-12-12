import React, { useState } from "react";
import { FileBarChart, Download, Loader, CheckCircle } from "lucide-react";

const ReportesContent = () => {
  const [downloading, setDownloading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("mes");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const API_URL = "http://localhost:4000/api/graficas";

  const descargarReportePDF = async () => {
    try {
      setDownloading(true);
      setDownloadSuccess(false);

      const response = await fetch(
        `${API_URL}/reporte-pdf?timeRange=${selectedTimeRange}`,
        {
          method: 'GET',
          headers: {
            // Agregar token de autenticación si es necesario
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }

      // Convertir la respuesta a blob
      const blob = await response.blob();
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-dashboard-${selectedTimeRange}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Mostrar éxito
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);

    } catch (error) {
      console.error('Error al descargar reporte:', error);
      alert('Error al descargar el reporte. Por favor, intenta nuevamente.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Reportes y Análisis</h2>
        {downloadSuccess && (
          <div className="flex items-center bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
            <span className="text-green-400 text-sm font-medium">
              Reporte descargado exitosamente
            </span>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/20 border border-purple-500/20 rounded-2xl p-8">
        <div className="flex items-start gap-6">
          <div className="bg-purple-500/10 p-4 rounded-xl">
            <FileBarChart className="h-12 w-12 text-purple-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-2 text-white">
              Reporte de Dashboard Completo
            </h3>
            <p className="text-gray-400 mb-6">
              Descarga un informe completo en PDF con todas las métricas, estadísticas y análisis del sistema de reservas.
            </p>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <h4 className="text-sm font-semibold text-white mb-4">El reporte incluye:</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Indicadores clave de rendimiento (KPIs)
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Distribución de reservas por estado
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Tipos de eventos más populares
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Estado del inventario por categoría
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Alertas de equipos con stock bajo
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Análisis de ingresos y reservas
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Período del reporte
                </label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  disabled={downloading}
                  className="w-full bg-gray-800 border border-purple-500/30 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="semana">Última Semana</option>
                  <option value="mes">Último Mes</option>
                  <option value="trimestre">Último Trimestre</option>
                  <option value="año">Último Año</option>
                </select>
              </div>

              <button
                onClick={descargarReportePDF}
                disabled={downloading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg flex items-center font-medium transition-colors mt-auto"
              >
                {downloading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Reporte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          Información del reporte
        </h4>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• El reporte se genera en formato PDF y se descarga automáticamente.</p>
          <p>• Los datos mostrados corresponden al período seleccionado.</p>
          <p>• El archivo incluye la fecha y hora de generación.</p>
          <p>• Puedes generar reportes ilimitados según tus necesidades.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportesContent;