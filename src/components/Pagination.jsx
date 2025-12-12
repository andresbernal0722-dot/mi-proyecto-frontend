import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Componente de paginación reutilizable
 * @param {Object} pagination - Información de paginación del hook usePagination
 * @param {Function} onPageChange - Función para cambiar de página
 * @param {Function} onItemsPerPageChange - Función para cambiar elementos por página
 * @param {Array} itemsPerPageOptions - Opciones de elementos por página
 * @param {boolean} showItemsPerPage - Mostrar selector de elementos por página
 * @param {string} className - Clases CSS adicionales
 */
const Pagination = ({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showItemsPerPage = true,
  className = ''
}) => {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage
  } = pagination;

  // Generar números de página para mostrar
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica más compleja para muchas páginas
      const halfRange = Math.floor(maxPagesToShow / 2);
      let start = Math.max(1, currentPage - halfRange);
      let end = Math.min(totalPages, currentPage + halfRange);
      
      // Ajustar el rango si está muy cerca del inicio o final
      if (end - start + 1 < maxPagesToShow) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxPagesToShow - 1);
        } else {
          start = Math.max(1, end - maxPagesToShow + 1);
        }
      }
      
      // Agregar primera página y "..." si es necesario
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }
      
      // Agregar páginas del rango
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Agregar "..." y última página si es necesario
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // Calcular rango de elementos mostrados
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null; // No mostrar paginación si solo hay una página
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 py-4 ${className}`}>
      {/* Información de elementos */}
      <div className="text-sm text-gray-400">
        Mostrando {startItem} a {endItem} de {totalItems} elementos
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón ir al inicio */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className={`p-2 rounded-lg border border-purple-500/30 ${
            hasPrevPage
              ? 'text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
              : 'text-gray-600 cursor-not-allowed'
          }`}
          title="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Botón página anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={`p-2 rounded-lg border border-purple-500/30 ${
            hasPrevPage
              ? 'text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
              : 'text-gray-600 cursor-not-allowed'
          }`}
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  pageNum === currentPage
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-purple-500/30 text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
                }`}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        {/* Botón página siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`p-2 rounded-lg border border-purple-500/30 ${
            hasNextPage
              ? 'text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
              : 'text-gray-600 cursor-not-allowed'
          }`}
          title="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Botón ir al final */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className={`p-2 rounded-lg border border-purple-500/30 ${
            hasNextPage
              ? 'text-purple-400 hover:bg-purple-600/20 hover:border-purple-400'
              : 'text-gray-600 cursor-not-allowed'
          }`}
          title="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      {/* Selector de elementos por página */}
      {showItemsPerPage && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Elementos por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;