// config.js
import { Platform } from 'react-native';

const getAPIUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return "https://bandoggie.onrender.com/api/";
    } else if (Platform.OS === 'ios') {
      return "http://localhost:4000/api/";
    }
  } else {
    return "https://bandoggie.onrender.com/api/";
  }
};

const API_URL = getAPIUrl();
console.log('🌍 API_URL configurada:', API_URL); // <- Este log es importante

export { API_URL };

export const API_FETCH_JSON = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`🚀 Haciendo fetch a: ${url}`);

    const fetchConfig = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers,
      },
      body: (options.body && !['GET', 'HEAD'].includes(options.method || 'GET'))
        ? JSON.stringify(options.body)
        : null,
    };

    let response;
    try {
      response = await fetch(url, fetchConfig);
      console.log(`📡 Respuesta recibida del servidor`);
    } catch (netError) {
      console.error("❗ Error de red al hacer fetch:", netError);
      throw netError;
    }

    console.log('🔍 Verificando status');
    console.log(`📡 Status de respuesta: ${response.status}`);

    let text;
    try {
      text = await response.text();
      console.log('📄 Respuesta cruda del servidor:', text);
    } catch (textError) {
      console.error("❗ No se pudo leer texto de respuesta:", textError);
      throw textError;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn('⚠️ La respuesta no es JSON válido:', parseError.message);
      throw new Error('Respuesta del servidor no es JSON válido');
    }

    return data;

  } catch (error) {
    console.error("🔥 Error completo en API_FETCH_JSON:", error);
    throw error;
  }
};
