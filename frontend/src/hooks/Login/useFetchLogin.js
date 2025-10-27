import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_FETCH_JSON } from '../../config.js';

const useFetchLogin = () => {
    const endpoint = 'login';

    const handleLogin = async (email, password) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: { email, password },
            });
            
            console.log("📝 Login response:", JSON.stringify(data, null, 2));

            // ⭐ GUARDAR EL TOKEN - Buscar en diferentes posibles ubicaciones
            const token = data.token || data.accessToken || data.authToken || data.data?.token;
            
            if (token) {
                await AsyncStorage.setItem('authToken', token);
                console.log('🔑 Token guardado exitosamente');
            } else {
                console.warn('⚠️ ADVERTENCIA: No se encontró token en la respuesta del login');
                console.warn('⚠️ Estructura de respuesta:', Object.keys(data));
                
                // Si NO hay token, el backend necesita ser modificado para devolverlo
                Toast.show({
                    type: 'info',
                    text1: 'Información',
                    text2: 'El servidor no devolvió token de autenticación'
                });
            }

            Toast.show({
                type: 'success',
                text1: 'Sesión iniciada correctamente'
            });
            
            return data;
        } catch (error) {
            console.error('❌ Login error in hook:', error);
            Toast.show({
                type: 'error',
                text1: 'Error al iniciar sesión',
                text2: error.message || 'Intenta nuevamente'
            });
            throw error;
        }
    }

    return { handleLogin };
}

export { useFetchLogin };
export default useFetchLogin;