import { Platform } from 'react-native';

/**
 * Determina la URL base de la API según la plataforma y entorno
 * @returns {string} URL base de la API
 */
const getAPIUrl = () => {
  if (__DEV__) {
    // En entorno de desarrollo
    if (Platform.OS === 'android') {
      // Para emulador Android: 10.0.2.2 mapea al localhost de la máquina host
      // Para dispositivo físico Android: usa tu IP local (ej: 192.168.1.100)
      return "http://10.0.2.2:4000/api/";
      // Si usas dispositivo físico, cambia por: "http://TU_IP_LOCAL:4000/api/"
    } else if (Platform.OS === 'ios') {
      // Para iOS simulator: localhost funciona correctamente
      return "http://localhost:4000/api/";
    }
  } else {
    // En entorno de producción
    return "https://tu-servidor-produccion.com/api/";
  }
};

// URL base para todas las peticiones API
const API_URL = getAPIUrl();

// Log para debugging - te ayuda a ver qué URL se está usando
console.log('API URL configurada:', API_URL);

/**
 * Función para realizar peticiones JSON con manejo robusto de errores
 * @param {string} endpoint - El endpoint específico (ej: 'products', 'categories')
 * @param {Object} options - Opciones de la petición (method, headers, body, etc.)
 * @returns {Promise<Object>} - Respuesta JSON de la API
 */
export const API_FETCH_JSON = async (endpoint, options = {}) => {
  try {
    // Log para debugging - te ayuda a rastrear las peticiones
    console.log(`Realizando petición ${options.method || 'GET'} a:`, `${API_URL}${endpoint}`);
    
    // Configuración por defecto de la petición
    const fetchConfig = {
      method: options.method || "GET",
      // ELIMINADO: credentials: "include" - No compatible con React Native por defecto
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Añadido: especifica que esperamos JSON
        ...options.headers, // Permite sobrescribir headers
      },
      // Solo incluye body si existe y no es GET/HEAD
      body: (options.body && !['GET', 'HEAD'].includes(options.method || 'GET')) 
        ? JSON.stringify(options.body) 
        : null,
      // Añadido: timeout para evitar peticiones colgadas
      timeout: 10000, // 10 segundos
    };

    // Realizamos la petición
    const response = await fetch(`${API_URL}${endpoint}`, fetchConfig);
    
    // Log del status de respuesta
    console.log(`Respuesta recibida - Status: ${response.status} (${response.statusText})`);
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
      
      try {
        // Intentamos obtener el mensaje de error del servidor
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // Si no podemos parsear el error, usamos el mensaje por defecto
        console.warn('No se pudo parsear el error del servidor:', parseError);
      }
      
      throw new Error(errorMessage);
    }
    
    // Parseamos y retornamos la respuesta JSON
    const data = await response.json();
    console.log('Datos recibidos exitosamente:', data ? 'OK' : 'NULL');
    return data;
    
  } catch (error) {
    // Manejo detallado de errores
    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      console.error('Error de red - Verifica la conexión y la URL de la API');
      throw new Error('Error de conexión. Verifica tu conexión a internet y que el servidor esté ejecutándose.');
    } else if (error.name === 'AbortError') {
      console.error('Petición cancelada por timeout');
      throw new Error('La petición tardó demasiado tiempo. Intenta nuevamente.');
    } else {
      console.error("Error en petición JSON:", error);
      throw error; // Re-lanzamos el error original
    }
  }
};

/**
 * Función para realizar peticiones con FormData (archivos, imágenes, etc.)
 * @param {string} endpoint - El endpoint específico
 * @param {FormData} formData - Datos del formulario con archivos
 * @param {Object} options - Opciones adicionales de la petición
 * @returns {Promise<Object>} - Respuesta JSON de la API
 */
export const API_FETCH_FORM = async (endpoint, formData, options = {}) => {
  try {
    // Log para debugging
    console.log(`Realizando petición FormData ${options.method || 'POST'} a:`, `${API_URL}${endpoint}`);
    
    // Configuración de la petición FormData
    const fetchConfig = {
      method: options.method || "POST",
      // ELIMINADO: credentials: "include" - 
      headers: {
        // NO incluir Content-Type para FormData
        // React Native lo establecerá automáticamente con el boundary correcto
        "Accept": "application/json",
        ...options.headers,
      },
      body: formData,
      // Timeout más largo para uploads de archivos
      timeout: 30000, // 30 segundos
    };

    // Realizamos la petición
    const response = await fetch(`${API_URL}${endpoint}`, fetchConfig);
    
    // Log del status de respuesta
    console.log(`Respuesta FormData recibida - Status: ${response.status} (${response.statusText})`);
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        console.warn('No se pudo parsear el error del servidor en FormData:', parseError);
      }
      
      throw new Error(errorMessage);
    }
    
    // Parseamos y retornamos la respuesta
    const data = await response.json();
    console.log('Datos FormData recibidos exitosamente');
    return data;
    
  } catch (error) {
    // Manejo de errores específico para FormData
    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      console.error('Error de red en FormData - Verifica la conexión');
      throw new Error('Error de conexión al subir archivos. Verifica tu conexión a internet.');
    } else if (error.name === 'AbortError') {
      console.error('Upload cancelado por timeout');
      throw new Error('La subida de archivos tardó demasiado tiempo. Intenta con archivos más pequeños.');
    } else {
      console.error("Error en petición FormData:", error);
      throw error;
    }
  }
};

/**
 * Función de utilidad para probar la conectividad con la API
 * Útil para debugging y verificación de conexión
 */
export const testAPIConnection = async () => {
  try {
    console.log('Probando conexión con la API...');
    
    // Intenta hacer una petición simple a un endpoint de salud
    // Ajusta el endpoint según tu API
    const response = await fetch(`${API_URL}health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 5000,
    });
    
    if (response.ok) {
      console.log('✅ API conectada correctamente');
      return true;
    } else {
      console.log('❌ API respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ No se pudo conectar con la API:', error.message);
    return false;
  }
};

// Exportamos también la URL para uso directo si es necesario
export { API_URL };