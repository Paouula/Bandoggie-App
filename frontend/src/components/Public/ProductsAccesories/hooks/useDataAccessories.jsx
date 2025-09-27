import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

const useDataAccessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://bandoggie-production.up.railway.app/api";
  const ACCESSORIES_CATEGORY_ID = "68a1476c6b65e3a7962662a5";

  const fetchAccessories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Iniciando fetch de accesorios...");
      
      const url = `${API_BASE_URL}/products/category/${ACCESSORIES_CATEGORY_ID}`;
      console.log("URL:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorMessage = `Error en la respuesta de la API: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Data recibida:", data);

      // Procesamiento de diferentes estructuras de respuesta
      let accessoriesArray = [];
      
      // Verificación de las diferentes estructuras posibles de la respuesta
      if (Array.isArray(data)) {
        accessoriesArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        accessoriesArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        accessoriesArray = data.data;
      } else if (data.result && Array.isArray(data.result)) {
        accessoriesArray = data.result;
      } else {
        console.error("Estructura de datos inesperada:", data);
      }

      console.log("Accesorios procesados:", accessoriesArray.length);
      console.log("Accesorios: test \n" , accessoriesArray)
      setAccessories(accessoriesArray);

    } catch (err) {
      console.error("Error completo:", err);
      const errorMessage = err.message || 'Error al cargar accesorios';
      setError(errorMessage);
      setAccessories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  return {
    accessories,
    loading,
    error,
    retry,
    refetch: fetchAccessories,
  };
};

export default useDataAccessories;
