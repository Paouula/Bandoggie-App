import { toast } from 'react-hot-toast';
//Importo las funciones globales para realizar el fetch

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

//Constante que contendra los metodos

const useFetchProducts = () => {
    //Declaro el endpoint

    const endpoint = 'products';

    //Obtiene todos los productos
    const handleGetProducts = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            toast.error('Error al obtener los productos');
            throw error;
        }
    };

    //Crea un nuevo producto
    const handlePostProducts = async (productData) => {
        try {
            const formData = buildFormData(productData);
            const data = await API_FETCH_FORM(endpoint, formData, {
                method: 'POST',
            });

            toast.success('Producto creado correctamente');
            return data;

        } catch (error) {
            toast.error('Error al crear el producto');
            throw error;
        }
    };

    //Actualiza un producto ya existente
    const handlePutProducts = async (id, productData) => {
        try {
            const formData = buildFormData(productData);
            const data = await API_FETCH_FORM(`${endpoint}/${id}`, formData, {
                method: 'PUT',
            });

            toast.success('Producto actualizado correctamente');
            return data;
        } catch (error) {
            toast.error('Error al actualizar el producto');
            throw error;
        }
    };

    //Elimina un producto
    const handleDeleteProducts = async (id) => {
        try {
            await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'DELETE',
            });
            toast.success('Producto eliminado correctamente');
        } catch (error) {
            toast.error('Error al eliminar el producto');
            throw error;
        }
    };

    return { handlePostProducts, handleGetProducts, handlePutProducts, handleDeleteProducts };
};

export default useFetchProducts;
