import Toast from 'react-native-toast-message';
import { API_FETCH_FORM, API_FETCH_JSON } from '../../config';

const useFetchRegister = () => {
  const endpoint = 'register';

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

      const data = await API_FETCH_FORM(endpoint, formData, {
        method: 'POST',
      });

      Toast.show({
        type: 'success',
        text1: 'Registro exitoso',
        text2: 'Verifica tu correo electrónico',
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error en el registro',
        text2: error.message || 'Intenta nuevamente',
      });

      throw error;
    }
  };

  const verifyEmail = async (verificationCode) => {
    try {
      const data = await API_FETCH_JSON(`${endpoint}/verifyCodeEmail`, {
        method: 'POST',
        body: { verificationCode },
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al verificar el correo',
        text2: error.message || 'Intenta nuevamente',
      });
    }
  };

  return { handleRegister, verifyEmail };
};

export default useFetchRegister;
