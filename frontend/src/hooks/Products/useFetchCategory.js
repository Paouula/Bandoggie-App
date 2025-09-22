import Toast from 'react-native-toast-message';
import { API_FETCH_JSON } from '../../config';

// Hook para manejar las operaciones de categorías
const useFetchCategory = () => {
    const endpoint = 'categories';

    // Obtiene todas las categorías
    const handleGetCategories = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener las categorías'
            });
            throw error;
        }
    };

    // Obtiene una categoría específica por ID
    const handleGetCategoryById = async (categoryId) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/${categoryId}`);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener la categoría'
            });
            throw error;
        }
    };

    // Función helper para encontrar el ID de una categoría por nombre
    const findCategoryIdByName = async (categoryName) => {
        try {
            const categories = await handleGetCategories();
            const category = categories.find(cat => 
                cat.nameCategory.toLowerCase() === categoryName.toLowerCase()
            );
            return category ? category._id : null;
        } catch (error) {
            console.error('Error finding category by name:', error);
            return null;
        }
    };

    return { 
        handleGetCategories, 
        handleGetCategoryById, 
        findCategoryIdByName 
    };
};

export default useFetchCategory;