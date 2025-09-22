import { toast } from 'react-hot-toast';
// Importa la función API_FETCH_FORM desde el archivo config
/*API_FETCH_FORM y API_FETCH_JSON son funciones que manejan las solicitudes HTTP de manera global del proyecto
En su interior, configura la URL base y los encabezados necesarios para las solicitudes en formato FormData y Json.*/
import { API_FETCH_FORM, API_FETCH_JSON } from '../../config';

//Hook para registro de usuarios
const useFetchRegister = () => {
    //Declaro el endpoint

    const endpoint = 'register';

    // Función para registrar usuarios
    const handleRegister = async (name, email, phone, birthday, password, image) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('birthday', birthday);
            formData.append('password', password);
            if (image) {
                formData.append('image', image);
            }
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }
            const data = await API_FETCH_FORM(endpoint, formData, {
                method: 'POST',
            });

            toast.success('Se ha registrado correctamente. Por favor, verifica tu correo electrónico.');
            return data;

        } catch (error) {
            toast.error(error.message || 'Error during registration');
            throw error;
        }
    }

    //Función para verificar el correo electrónico
    // Esta función se usa para verificar el correo electrónico después del registro
    const verifyEmail = async (verificationCode) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/verifyCodeEmail`, {
                method: 'POST',
                body: { verificationCode },
            });

            return data;

        } catch (error) {
            toast.error(error.message || 'Error during email verification');
        }
    }

    // Retorna las funciones para ser usadas en los componentes
    return { handleRegister, verifyEmail };
}

export default useFetchRegister;
