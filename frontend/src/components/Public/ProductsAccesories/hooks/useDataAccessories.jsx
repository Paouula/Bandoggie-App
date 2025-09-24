import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import * as Network from 'expo-network';

const useDataAccessories = () => {
  // Estados principales
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Configuración de la API
  const API_BASE_URL = "https://bandoggie-production.up.railway.app/api";
  const ACCESSORIES_CATEGORY_ID = "68a1476c6b65e3a7962662a5";
  const TIMEOUT_DURATION = 10000; // 10 segundos

  // Función para verificar conectividad con expo-network
  const checkNetworkConnection = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setNetworkError(!networkState.isConnected);
      return networkState.isConnected;
    } catch (error) {
      console.warn("Error checking network:", error);
      return true; // Asumir que hay conexión si no se puede verificar
    }
  };

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

  // Función principal para obtener accesorios
  const fetchAccessories = useCallback(async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      setError(null);
      setNetworkError(false);

      // Verificar conectividad
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        throw new Error('No hay conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }

      const url = `${API_BASE_URL}/products/category/${ACCESSORIES_CATEGORY_ID}`;
      console.log("Fetching accessories from:", url);

      const data = await fetchWithTimeout(url);
      
      console.log("Productos de categoría Accesorios:", data);
      
      // Validar y procesar los datos
      const accessoriesArray = Array.isArray(data) ? data : [];
      
      if (accessoriesArray.length === 0) {
        console.warn("No se encontraron accesorios");
      }

      setAccessories(accessoriesArray);
      
      return accessoriesArray;

    } catch (err) {
      console.error("Error fetching accessories:", err);
      const errorMessage = err.message || 'Error desconocido al cargar accesorios';
      
      setError(errorMessage);
      
      // Mostrar diferentes tipos de error
      if (err.message.includes('conexión') || err.message.includes('internet')) {
        setNetworkError(true);
      } else if (err.message.includes('tiempo')) {
        showAlert(
          "Tiempo agotado", 
          "La carga está tardando más de lo normal. ¿Deseas reintentar?"
        );
      } else {
        showAlert("Error", `Error al cargar accesorios: ${errorMessage}`);
      }
      
      // En caso de error, mantener datos existentes si los hay
      setAccessories(prevAccessories => prevAccessories);
      
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
      await fetchAccessories(false); // No mostrar loading spinner durante refresh
    } catch (error) {
      // El error ya se maneja en fetchAccessories
      console.log("Error during refresh:", error.message);
    }
  }, [fetchAccessories]);

  // Función para reintentar manualmente
  const retry = useCallback(() => {
    fetchAccessories(true);
  }, [fetchAccessories]);

  // Función para filtrar accesorios por nombre
  const searchAccessories = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return accessories;
    }
    
    return accessories.filter(accessory =>
      accessory.nameProduct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accessories]);

  // Función para obtener accesorios por rango de precio
  const getAccessoriesByPriceRange = useCallback((minPrice, maxPrice) => {
    return accessories.filter(accessory => {
      const price = parseFloat(accessory.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });
  }, [accessories]);

  // Función para obtener estadísticas de accesorios
  const getAccessoriesStats = useCallback(() => {
    if (accessories.length === 0) {
      return {
        total: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
      };
    }

    const prices = accessories.map(item => parseFloat(item.price) || 0);
    const total = accessories.length;
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / total;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      total,
      averagePrice: Math.round(averagePrice * 100) / 100,
      minPrice,
      maxPrice,
    };
  }, [accessories]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchAccessories(true);
  }, [fetchAccessories]);

  // Listener para cambios de conectividad (simplificado para expo-network)
  useEffect(() => {
    let interval;
    
    if (networkError) {
      // Verificar conectividad cada 5 segundos si hay error de red
      interval = setInterval(async () => {
        const isConnected = await checkNetworkConnection();
        if (isConnected) {
          setNetworkError(false);
          fetchAccessories(true);
        }
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [networkError, fetchAccessories]);

  return {
    // Datos principales - NOMBRE CORREGIDO
    Accessories: accessories, // ✅ Mantengo el nombre que esperas en tu componente
    accessories, // También devuelvo la versión lowercase por compatibilidad
    setAccessories,
    
    // Estados
    loading,
    error,
    refreshing,
    networkError,
    
    // Funciones principales
    fetchAccessories,
    onRefresh,
    retry,
    
    // Funciones de utilidad
    searchAccessories,
    getAccessoriesByPriceRange,
    getAccessoriesStats,
    
    // Configuración
    API_BASE_URL,
    ACCESSORIES_CATEGORY_ID,
    
    // Información adicional
    hasData: accessories.length > 0,
    isEmpty: !loading && accessories.length === 0 && !error,
  };
};

export default useDataAccessories;