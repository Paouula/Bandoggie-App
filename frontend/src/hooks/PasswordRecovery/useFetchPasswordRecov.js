import Toast from 'react-native-toast-message';
import { API_FETCH_JSON } from '../../config';

const useFetchPasswordRecovery = () => {
  const endpoint = 'passwordRecovery';

  const handleRequest = async (email) => {
    try {
      const data = await API_FETCH_JSON(`${endpoint}/requestCode`, {
        method: 'POST',
        body: { email },
      });

      Toast.show({
        type: 'success',
        text1: 'Código enviado',
        text2: 'Revisa tu correo electrónico',
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al solicitar código',
        text2: error.message || 'Intenta nuevamente',
      });
      throw error;
    }
  };

  const handleVerify = async (code) => {
    try {
      const data = await API_FETCH_JSON(`${endpoint}/verifyCode`, {
        method: 'POST',
        body: { code },
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al verificar código',
        text2: error.message || 'Código inválido o expirado',
      });
    }
  };

  const handleNewPass = async (newPassword) => {
    try {
      const data = await API_FETCH_JSON(`${endpoint}/newPassword`, {
        method: 'POST',
        body: { newPassword },
      });

      Toast.show({
        type: 'success',
        text1: 'Contraseña actualizada',
        text2: 'Ya puedes iniciar sesión',
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar contraseña',
        text2: error.message || 'Intenta nuevamente',
      });
    }
  };

  return { handleRequest, handleVerify, handleNewPass };
};

export default useFetchPasswordRecovery;
