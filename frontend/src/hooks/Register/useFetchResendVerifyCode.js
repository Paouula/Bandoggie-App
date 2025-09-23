import Toast from 'react-native-toast-message';
import { API_FETCH_JSON } from '../../config';

const useFetchResend = () => {
  const endpoint = 'resend-code';

  const resendVerifyEmail = async (resendVerificationCode) => {
    try {
      const data = await API_FETCH_JSON(endpoint, {
        method: 'POST',
        body: resendVerificationCode,
      });

      Toast.show({
        type: 'success',
        text1: 'Código reenviado',
        text2: 'Revisa tu correo electrónico',
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al reenviar',
        text2: error.message || 'Intenta nuevamente',
      });
      throw error;
    }
  };

  return { resendVerifyEmail };
};

export default useFetchResend;
