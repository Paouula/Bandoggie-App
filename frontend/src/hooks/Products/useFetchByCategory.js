import Toast from 'react-native-toast-message';
import { API_FETCH_JSON } from '../../config';

// Hook reutilizable para obtener productos por categoría
const useFetchProductsByCategory = () => {
    const endpoint = 'products';

    // Obtiene productos por categoría específica
    const handleGetProductsByCategory = async (categoryId) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/category/${categoryId}`);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener los productos de esta categoría'
            });
            throw error;
        }
    };

    // Obtiene productos por festividad específica
    const handleGetProductsByHoliday = async (holidayId) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/holiday/${holidayId}`);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener los productos de esta festividad'
            });
            throw error;
        }
    };

    // Obtiene un producto específico por ID
    const handleGetProductById = async (productId) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/${productId}`);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener el producto'
            });
            throw error;
        }
    };

    return { 
        handleGetProductsByCategory, 
        handleGetProductsByHoliday, 
        handleGetProductById 
    };
};

export default useFetchProductsByCategory;