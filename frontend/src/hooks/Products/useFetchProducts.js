import Toast from 'react-native-toast-message';
import { API_FETCH_FORM, API_FETCH_JSON } from '../../config';

// Función reutilizable para construir el FormData
const buildFormData = (productData) => {
    const {
        nameProduct,
        price,
        description,
        image,
        designImages,
        idHolidayProduct,
        idCategory
    } = productData;

    const formData = new FormData();
    formData.append('nameProduct', nameProduct);
    formData.append('price', price);
    formData.append('description', description);

    if (image) {
        formData.append('image', image);
    }

    if (Array.isArray(designImages)) {
        designImages.forEach((file, index) => {
            formData.append('designImages', file);
        });
    }

    formData.append('idHolidayProduct', idHolidayProduct);
    formData.append('idCategory', idCategory);

    for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }

    return formData;
};

// Constante que contendrá los métodos
const useFetchProducts = () => {
    const endpoint = 'products';

    // Obtiene todos los productos
    const handleGetProducts = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener los productos'
            });
            throw error;
        }
    };

    // Crea un nuevo producto
    const handlePostProducts = async (productData) => {
        try {
            const formData = buildFormData(productData);
            const data = await API_FETCH_FORM(endpoint, formData, {
                method: 'POST',
            });

            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Producto creado correctamente'
            });
            return data;

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al crear el producto'
            });
            throw error;
        }
    };

    // Actualiza un producto ya existente
    const handlePutProducts = async (id, productData) => {
        try {
            const formData = buildFormData(productData);
            const data = await API_FETCH_FORM(`${endpoint}/${id}`, formData, {
                method: 'PUT',
            });

            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Producto actualizado correctamente'
            });
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al actualizar el producto'
            });
            throw error;
        }
    };

    // Elimina un producto
    const handleDeleteProducts = async (id) => {
        try {
            await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'DELETE',
            });
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Producto eliminado correctamente'
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al eliminar el producto'
            });
            throw error;
        }
    };

    return { handlePostProducts, handleGetProducts, handlePutProducts, handleDeleteProducts };
};

export default useFetchProducts;