// useDataBandanas.js - CORRECCIÓN
import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

const useDataBandanas = () => {
  const [bandanas, setBandanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://bandoggie-production.up.railway.app/api";
  
  // Opción 1: ID específico de categoría bandanas (si existe)
  const BANDANAS_CATEGORY_ID = "68a1475a6b65e3a7962662a1"; 
  
  // pción 2: Si no tienes categorías específicas, usar endpoint general
  // const FETCH_ALL_PRODUCTS = true; -- Flag para obtener todos los productos

  const fetchBandanas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Iniciando fetch de bandanas...");
      
      let url = `${API_BASE_URL}/products/category/${BANDANAS_CATEGORY_ID}`;
      
      
      console.log("URL:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        //Si falla la categoría específica, intentar con todos los productos
        console.log("Error con categoría específica, intentando con todos los productos...");
        
        const fallbackUrl = `${API_BASE_URL}/products`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!fallbackResponse.ok) {
          throw new Error(`Error en la API: ${fallbackResponse.status} - ${fallbackResponse.statusText}`);
        }

        const allProducts = await fallbackResponse.json();
        console.log("Todos los productos:", allProducts);
        
        //Filtrar productos que contengan "bandana" en el nombre
        const bandanasFiltered = allProducts.filter(product => 
          product.nameProduct?.toLowerCase().includes('bandana') ||
          product.name?.toLowerCase().includes('bandana') ||
          product.category?.toLowerCase().includes('bandana')
        );

        console.log("Bandanas filtradas:", bandanasFiltered);
        setBandanas(bandanasFiltered || []);
        return;
      }

      const data = await response.json();
      console.log("Data recibida:", data);

      // Procesar diferentes estructuras de respuesta
      let bandanasArray = [];
      
      if (Array.isArray(data)) {
        bandanasArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        bandanasArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        bandanasArray = data.data;
      } else if (data.result && Array.isArray(data.result)) {
        bandanasArray = data.result;
      } else {
        console.error("Estructura de datos inesperada:", data);
        bandanasArray = [];
      }

      console.log("Bandanas procesadas:", bandanasArray.length);
      setBandanas(bandanasArray);

    } catch (err) {
      console.error("Error completo:", err);
      const errorMessage = err.message || 'Error al cargar bandanas';
      setError(errorMessage);
      setBandanas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    fetchBandanas();
  }, [fetchBandanas]);

  useEffect(() => {
    fetchBandanas();
  }, [fetchBandanas]);

  return {
    Bandanas: bandanas,
    bandanas,
    loading,
    error,
    retry,
    refetch: fetchBandanas,
    hasData: bandanas.length > 0,
    isEmpty: !loading && bandanas.length === 0 && !error,
  };
};

export default useDataBandanas;