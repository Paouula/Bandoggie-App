import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

const useDataCollars = () => {
  // Estados principales
  const [collars, setCollars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Configuración de la API
  const API_BASE_URL = "https://bandoggie-production.up.railway.app/api";
  const COLLARS_CATEGORY_ID = "68a147616b65e3a7962662a3";
  const TIMEOUT_DURATION = 10000; 

  // Función para mostrar alertas nativas
  const showAlert = useCallback((title, message, onPress = null) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "OK",
          onPress: onPress,
        },
      ],
      { cancelable: false }
    );
  }, []);

  // Función fetch con timeout y mejor manejo de errores
  const fetchWithTimeout = async (url, options = {}, timeout = TIMEOUT_DURATION) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Error HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado tiempo. Verifica tu conexión.');
      }
      
      throw error;
    }
  };

  // Función principal para obtener collares
  const fetchCollars = useCallback(async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      setError(null);

      console.log("Iniciando fetch de collares...");
      
      // Intentar con categoría específica primero
      let url = `${API_BASE_URL}/products/category/${COLLARS_CATEGORY_ID}`;
      console.log("URL:", url);

      try {
        const data = await fetchWithTimeout(url);
        console.log("Data recibida (categoría específica):", data);

        // Procesar diferentes estructuras de respuesta
        let collarsArray = [];
        
        if (Array.isArray(data)) {
          collarsArray = data;
        } else if (data.products && Array.isArray(data.products)) {
          collarsArray = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          collarsArray = data.data;
        } else if (data.result && Array.isArray(data.result)) {
          collarsArray = data.result;
        } else {
          console.error("Estructura de datos inesperada:", data);
          collarsArray = [];
        }

        console.log("Collares procesados:", collarsArray.length);
        setCollars(collarsArray);
        return collarsArray;

      } catch (categoryError) {
        console.warn("Error con categoría específica, intentando con todos los productos...", categoryError.message);
        
        // Fallback: obtener todos los productos y filtrar
        const fallbackUrl = `${API_BASE_URL}/products`;
        const allProducts = await fetchWithTimeout(fallbackUrl);
        
        console.log("Todos los productos obtenidos:", allProducts?.length || 0);
        
        // Filtrar productos que contengan "collar" en el nombre o descripción
        const collarsFiltered = allProducts.filter(product => 
          product.nameProduct?.toLowerCase().includes('collar') ||
          product.name?.toLowerCase().includes('collar') ||
          product.description?.toLowerCase().includes('collar') ||
          product.category?.toLowerCase().includes('collar')
        );

        console.log("Collares filtrados:", collarsFiltered.length);
        setCollars(collarsFiltered || []);
        return collarsFiltered;
      }

    } catch (err) {
      console.error("Error completo:", err);
      const errorMessage = err.message || 'Error desconocido al cargar collares';
      
      setError(errorMessage);
      
      // Mostrar diferentes tipos de error
      if (err.message.includes('tiempo')) {
        showAlert(
          "Tiempo agotado", 
          "La carga está tardando más de lo normal. ¿Deseas reintentar?"
        );
      } else if (err.message.includes('HTTP')) {
        showAlert("Error del servidor", `Error al cargar collares: ${errorMessage}`);
      } else {
        showAlert("Error", `Error al cargar collares: ${errorMessage}`);
      }
      
      // En caso de error, mantener datos existentes si los hay
      setCollars(prevCollars => prevCollars);
      
      throw err;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showAlert]);

  // Función para refresh (pull-to-refresh)
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchCollars(false); // No mostrar loading spinner durante refresh
    } catch (error) {
      // El error ya se maneja en fetchCollars
      console.log("Error during refresh:", error.message);
    }
  }, [fetchCollars]);

  // Función para reintentar manualmente
  const retry = useCallback(() => {
    fetchCollars(true);
  }, [fetchCollars]);

  // Función para filtrar collares por nombre
  const searchCollars = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return collars;
    }
    
    return collars.filter(collar =>
      collar.nameProduct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collar.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collars]);

  // Función para obtener collares por rango de precio
  const getCollarsByPriceRange = useCallback((minPrice, maxPrice) => {
    return collars.filter(collar => {
      const price = parseFloat(collar.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });
  }, [collars]);

  // Función para obtener estadísticas de collares
  const getCollarsStats = useCallback(() => {
    if (collars.length === 0) {
      return {
        total: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
      };
    }

    const prices = collars.map(item => parseFloat(item.price) || 0);
    const total = collars.length;
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / total;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      total,
      averagePrice: Math.round(averagePrice * 100) / 100,
      minPrice,
      maxPrice,
    };
  }, [collars]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchCollars(true);
  }, [fetchCollars]);

  return {
    // Datos principales - Manteniendo compatibilidad con ambos nombres
    Collars: collars, // Nombre original que esperas
    collars, // También devuelvo lowercase por compatibilidad
    setCollars,
    
    // Estados
    loading,
    error,
    refreshing,
    
    // Funciones principales
    fetchCollars,
    onRefresh,
    retry,
    refetch: fetchCollars, // Alias para compatibilidad
    
    // Funciones de utilidad
    searchCollars,
    getCollarsByPriceRange,
    getCollarsStats,
    
    // Configuración
    API_BASE_URL,
    COLLARS_CATEGORY_ID,
    
    // Información adicional
    hasData: collars.length > 0,
    isEmpty: !loading && collars.length === 0 && !error,
  };
};

export default useDataCollars;