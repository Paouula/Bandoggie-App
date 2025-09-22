import { toast } from 'react-hot-toast'

//Importo la funcion para realizar el fetch
import { API_FETCH_JSON } from '../../config';

// Hook para manejar las conexiones a la API relacionadas con al reenvio del codigo
const useFetchResend = () => {
    //Declaro el endpoind
    const endpoint = 'resend-code';


    // Esta función se usa para reenviar el codigo de verificacion del correo
    const resendVerifyEmail = async (resendVerificationCode) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body:  resendVerificationCode ,
            });

            toast.success('Código de verificación reenviado al correo');
            return data;

        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    return { resendVerifyEmail };
}

export default useFetchResend;