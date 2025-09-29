import { toast } from 'react-hot-toast';
// Importa la funciÃ³n API_FETCH_JSON desde tu configuraciÃ³n
/*API_FETCH_JSON es una funciÃ³n que maneja las solicitudes HTTP de manera global del proyecto
En su interior, configura la URL base y los encabezados necesarios para las solicitudes.*/
import { API_FETCH_JSON } from '../../config.js';

//Hook para el incio de sesiÃ³n de los usuarios
const useFetchLogin = () => {
    //Declaro el endpoint

    const endpoint = 'login';

    //Funcion para iniciar sesion
    const handleLogin = async (email, password) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: { email, password },
            });
            console.log("Login response:", data);
            toast.success('SesiÃ³n iniciada correctamente');
            return data;
        } catch (error) {
            console.error('Login error in hook:', error); // Para debugging
            throw error;
        }
    }

    return { handleLogin };
}

export default useFetchLogin;