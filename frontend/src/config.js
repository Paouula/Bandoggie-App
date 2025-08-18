const API_URL = "http://localhost:4000/api/"; // Base URL para todas las peticiones 

// Función para realizar peticiones JSON
export const API_FETCH_JSON = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : null,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Función para realizar peticiones con FormData
export const API_FETCH_FORM = async (endpoint, formData, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

