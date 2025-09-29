import Toast from 'react-native-toast-message';
//Importo la funcion para realizar el fetch
import { API_FETCH_JSON } from '../../config';

// Hook para manejar las conexiones a la API relacionadas con las categorías
const useFetchCategory = () => {
    //Declaro el endpoint
    const endpoint = 'categories';

    // Función para obtener las categorías
    const handleGetCategories = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al obtener las categorías'
            });
            throw error;
        }
    };

    // Función para crear una nueva categoría
    const handlePostCategory = async (categoryData) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body: categoryData,
            });

            Toast.show({
                type: 'success',
                text1: 'Categoría creada exitosamente'
            });
            return data;

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error.message || 'Error al crear la categoría'
            });
            throw error;
        }
    };

    return { handleGetCategories, handlePostCategory };
}

export default useFetchCategory;