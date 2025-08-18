import { toast } from 'react-hot-toast';
//Importo la funcion para realizar el fetch
import { API_FETCH_JSON } from '../../config';

// Hook para manejar las conexiones a la API relacionadas con las categorías
const useFetchCategory = () => {
    //Declaro el endpoind
    const endpoint = 'categories';

    // Función para obtener las categorías
    const handleGetCategories = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            toast.error('Error al obtener las categorías');
            throw error;
        }
    };

    // Función para crear una nueva categoría
    const handlePostCategory = async ( categoryData ) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body:  categoryData ,
            });

            toast.success('Categoría creada exitosamente');
            return data;

        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    return { handleGetCategories, handlePostCategory };
}

export default useFetchCategory;