import Toast from 'react-native-toast-message';
import { API_URL } from '../../config';

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

// Función mejorada para construir el FormData
const buildFormData = (productData) => {
    console.log('🔨 [BUILD] Construyendo FormData...');
    
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
    
    // Agregar campos de texto
    formData.append('nameProduct', nameProduct);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('idHolidayProduct', idHolidayProduct);
    formData.append('idCategory', idCategory);
    
    console.log('✅ [BUILD] Campos de texto agregados');

    // Función auxiliar para validar y corregir el tipo MIME
    const getValidMimeType = (type, filename) => {
        if (type && type.startsWith('image/')) {
            return type;
        }
        
        // Extraer del nombre del archivo
        const ext = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'bmp': 'image/bmp'
        };
        
        return mimeTypes[ext] || 'image/jpeg';
    };

    // Agregar imagen principal
    if (image) {
        const validType = getValidMimeType(image.type, image.name);
        
        console.log('🖼️ [BUILD] Imagen principal:', {
            uri: image.uri?.substring(0, 50) + '...',
            name: image.name,
            typeOriginal: image.type,
            typeValidado: validType
        });
        
        formData.append('image', {
            uri: image.uri,
            name: image.name,
            type: validType
        });
    }

    // Agregar imágenes de diseño
    if (Array.isArray(designImages) && designImages.length > 0) {
        console.log(`🎨 [BUILD] Agregando ${designImages.length} imágenes de diseño`);
        
        designImages.forEach((file, index) => {
            const validType = getValidMimeType(file.type, file.name);
            
            console.log(`  → Imagen ${index + 1}:`, {
                uri: file.uri?.substring(0, 50) + '...',
                name: file.name,
                typeOriginal: file.type,
                typeValidado: validType
            });
            
            formData.append('designImages', {
                uri: file.uri,
                name: file.name,
                type: validType
            });
        });
    }

    console.log('✅ [BUILD] FormData construido completamente');
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
        console.log('📝 [HOOK] Datos recibidos:', {
            nameProduct: productData.nameProduct,
            price: productData.price,
            hasImage: !!productData.image,
            designImagesCount: productData.designImages?.length || 0
        });
        
        try {
            const formData = buildFormData(productData);
            const fullUrl = `${API_URL}${endpoint}`;
            
            console.log(`🚀 [HOOK] Enviando POST a: ${fullUrl}`);
            
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // IMPORTANTE: NO incluir Content-Type para FormData
                    // El navegador/RN lo establecerá automáticamente con el boundary correcto
                },
                body: formData,
            });
            
            console.log(`📡 [HOOK] Response status: ${response.status}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ [HOOK] Error response: ${errorText}`);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ [HOOK] Producto creado exitosamente:', data);
            
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Producto creado correctamente',
                visibilityTime: 3000
            });
            
            return data;

        } catch (error) {
            console.error('💥 [HOOK] Error al crear producto:', error);
            console.error('💥 [HOOK] Error stack:', error.stack);
            
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Error al crear el producto',
                visibilityTime: 4000
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