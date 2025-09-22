import Toast from 'react-native-toast-message';
import { API_URL } from '../../config'; // Solo importamos la URL, no API_FETCH_JSON

// Función de fetch directo que funciona
const directFetch = async (endpoint, options = {}) => {
    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`🔗 [DIRECT] ${options.method || 'GET'} ${fullUrl}`);
    
    try {
        const response = await fetch(fullUrl, {
            method: options.method || 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: options.body && options.method !== 'GET' ? JSON.stringify(options.body) : undefined,
        });
        
        console.log(`✅ [DIRECT] Response: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ [DIRECT] Error response: ${errorText}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`📦 [DIRECT] Data received:`, Array.isArray(data) ? `Array[${data.length}]` : typeof data);
        return data;
        
    } catch (error) {
        console.error(`💥 [DIRECT] Error:`, error.message);
        throw error;
    }
};

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

    return formData;
};

const useFetchProducts = () => {
    const endpoint = 'products';

    // Función principal usando fetch directo
    const handleGetProducts = async () => {
        console.log('🔗 [HOOK] Iniciando handleGetProducts con fetch directo...');
        
        try {
            const data = await directFetch(endpoint);
            console.log('✅ [HOOK] Productos obtenidos exitosamente:', data?.length || 0);
            
            if (Array.isArray(data) && data.length > 0) {
                console.log('🔍 [HOOK] Primer producto:', {
                    id: data[0]._id,
                    name: data[0].nameProduct,
                    keys: Object.keys(data[0])
                });
            }
            
            return data;
            
        } catch (error) {
            console.error('💥 [HOOK] Error en handleGetProducts:', error);
            
            // Toast de error
            Toast.show({
                type: 'error',
                text1: 'Error de Conexión',
                text2: error.message,
                visibilityTime: 4000
            });
            
            throw error;
        }
    };

    // Crear producto con FormData directo
    const handlePostProducts = async (productData) => {
        console.log('📝 [HOOK] Creando producto...');
        
        try {
            const formData = buildFormData(productData);
            const fullUrl = `${API_URL}${endpoint}`;
            
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // No poner Content-Type para FormData
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Producto creado correctamente'
            });
            
            return data;

        } catch (error) {
            console.error('💥 [HOOK] Error al crear producto:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Error al crear el producto'
            });
            throw error;
        }
    };

    // Actualizar producto
    const handlePutProducts = async (id, productData) => {
        console.log('✏️ [HOOK] Actualizando producto:', id);
        
        try {
            const formData = buildFormData(productData);
            const fullUrl = `${API_URL}${endpoint}/${id}`;
            
            const response = await fetch(fullUrl, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Producto actualizado correctamente'
            });
            
            return data;
        } catch (error) {
            console.error('💥 [HOOK] Error al actualizar producto:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Error al actualizar el producto'
            });
            throw error;
        }
    };

    // Eliminar producto
    const handleDeleteProducts = async (id) => {
        console.log('🗑️ [HOOK] Eliminando producto:', id);
        
        try {
            const data = await directFetch(`${endpoint}/${id}`, {
                method: 'DELETE',
            });
            
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Producto eliminado correctamente'
            });
            
            return data;
        } catch (error) {
            console.error('💥 [HOOK] Error al eliminar producto:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Error al eliminar el producto'
            });
            throw error;
        }
    };

    return { 
        handleGetProducts,
        handlePostProducts, 
        handlePutProducts, 
        handleDeleteProducts
    };
};

export default useFetchProducts;