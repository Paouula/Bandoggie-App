import { toast } from 'react-hot-toast';
//Importamos la funcion API_FETCH_JSON
import { API_FETCH_JSON } from '../../config';

//Hook para manejar la recuperación de contraseña
const useFetchPasswordRecovery = () => {
    //Declaro el endpoint

    const endpoint = 'passwordRecovery';

    //Función para manejar la solicitud de código de recuperación
    const handleRequest = async (email) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/requestCode`, {
                method: 'POST',
                body: { email },
            });

            toast.success('Se ha enviado el código correctamente');
            return data;

        } catch (error) {
            throw error;
        }
    }

    //Función para verificar el código de recuperación
    const handleVerify = async (code) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/verifyCode`, {
                method: 'POST',
                body: { code },
            });

            return data;

        } catch (error) {
            toast.error(error.message || 'Error during email verification');
        }
    }

    //Función para manejar la actualización de la contraseña
    const handleNewPass = async (newPassword) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/newPassword`, {
                method: 'POST',
                body: { newPassword },
            });

            return data;

        } catch (error) {
            toast.error(error.message || 'Error al actualizar la contraseña');
        }
    }
    return { handleRequest, handleVerify, handleNewPass }
}

export default useFetchPasswordRecovery;