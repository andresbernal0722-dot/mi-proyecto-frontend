import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook personalizado para manejar paginación
 * @param {Function} fetchFunction - Función para obtener datos paginados
 * @param {Object} initialFilters - Filtros iniciales
 * @param {number} initialLimit - Número inicial de elementos por página
 */
const usePagination = (fetchFunction, initialFilters = {}, initialLimit = 10) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: initialLimit,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  
  // Referencias para evitar dependencias circulares
  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);
  
  // Actualizar referencias cuando cambien los estados
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  // Función para cargar datos
  const loadData = useCallback(async (page = 1, newFilters = null, limit = null) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = newFilters !== null ? { ...filtersRef.current, ...newFilters } : filtersRef.current;
      const currentLimit = limit !== null ? limit : paginationRef.current.itemsPerPage;

      const params = {
        page,
        limit: currentLimit,
        ...currentFilters
      };

      const response = await fetchFunction(params);
      
      // Asumimos que la respuesta tiene el formato { data: [...], pagination: {...} }
      // o directamente { [dataKey]: [...], pagination: {...} }
      let responseData, responsePagination;
      
      if (response.usuarios) {
        responseData = response.usuarios;
        responsePagination = response.pagination;
      } else if (response.categorias) {
        responseData = response.categorias;
        responsePagination = response.pagination;
      } else if (response.proveedores) {
        responseData = response.proveedores;
        responsePagination = response.pagination;
      } else if (response.colaboradores) {
        responseData = response.colaboradores;
        responsePagination = response.pagination;
      } else if (response.reservas) {
        responseData = response.reservas;
        responsePagination = response.pagination;
      } else if (response.eventos) {
        responseData = response.eventos;
        responsePagination = response.pagination;
      } else if (response.contactos) {
        responseData = response.contactos;
        responsePagination = response.pagination;
      } else {
        // Formato genérico: si la respuesta es un objeto que contiene
        // alguna propiedad cuyo valor sea un array, usamos ese array.
        const arrayProp = Object.keys(response).find(k => Array.isArray(response[k]));
        if (arrayProp) {
          responseData = response[arrayProp];
          responsePagination = response.pagination;
        } else {
          // Formato por defecto
          responseData = response.data || response;
          responsePagination = response.pagination;
        }
      }

      setData(responseData);
      if (responsePagination) {
        setPagination(responsePagination);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
      console.error('Error en usePagination:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // Ir a página específica
  const goToPage = useCallback((page) => {
    const currentPagination = paginationRef.current;
    if (page >= 1 && page <= currentPagination.totalPages && page !== currentPagination.currentPage) {
      loadData(page);
    }
  }, [loadData]);

  // Ir a primera página
  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  // Ir a última página
  const goToLastPage = useCallback(() => {
    goToPage(paginationRef.current.totalPages);
  }, [goToPage]);

  // Ir a página siguiente
  const goToNextPage = useCallback(() => {
    const currentPagination = paginationRef.current;
    if (currentPagination.hasNextPage) {
      goToPage(currentPagination.nextPage);
    }
  }, [goToPage]);

  // Ir a página anterior
  const goToPrevPage = useCallback(() => {
    const currentPagination = paginationRef.current;
    if (currentPagination.hasPrevPage) {
      goToPage(currentPagination.prevPage);
    }
  }, [goToPage]);

  // Cambiar número de elementos por página
  const changeItemsPerPage = useCallback((newLimit) => {
    setPagination(prev => ({ ...prev, itemsPerPage: newLimit }));
    loadData(1, null, newLimit);
  }, [loadData]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    loadData(1, newFilters);
  }, [loadData]);

  // Resetear filtros
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    loadData(1, initialFilters);
  }, [loadData, initialFilters]);

  // Recargar datos actuales
  const refresh = useCallback(() => {
    loadData(paginationRef.current.currentPage);
  }, [loadData]);

  // Cargar datos iniciales - SOLO una vez al montar el componente
  const hasLoadedInitialData = useRef(false);
  useEffect(() => {
    if (!hasLoadedInitialData.current) {
      hasLoadedInitialData.current = true;
      loadData(1).catch(err => {
        console.error('Error en carga inicial:', err);
        setError(err.message || 'Error al cargar datos iniciales');
        setLoading(false);
      });
    }
  }, [loadData]);

  return {
    // Datos
    data,
    pagination,
    loading,
    error,
    filters,
    
    // Funciones de navegación
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    changeItemsPerPage,
    
    // Funciones de filtrado
    applyFilters,
    resetFilters,
    
    // Utilidades
    refresh,
    loadData
  };
};

export default usePagination;