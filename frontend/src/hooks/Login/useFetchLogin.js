import Toast from 'react-native-toast-message';
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
            console.log("Login response:", data);
            Toast.show({
                type: 'success',
                text1: 'Sesión iniciada correctamente'
            });
            return data;
        } catch (error) {
            console.error('Login error in hook:', error);
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

// CAMBIO IMPORTANTE: Exportación como named export
export { useFetchLogin };
export default useFetchLogin;