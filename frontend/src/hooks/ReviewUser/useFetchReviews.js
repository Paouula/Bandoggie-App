import Toast from 'react-native-toast-message';
import { API_FETCH_FORM, API_FETCH_JSON } from '../../config';

// Función reutilizable para construir el FormData
const buildFormData = (reviewData) => {
  const {
    qualification,
    comment,
    designImages,
    idClient,
    idProduct
  } = reviewData;

  const formData = new FormData();
  formData.append('qualification', qualification);
  formData.append('comment', comment);

  if (Array.isArray(designImages)) {
    designImages.forEach((file) => {
      formData.append('designImages', file);
    });
  }

  formData.append('idClient', idClient);
  formData.append('idProduct', idProduct);

  return formData;
};

// Constante que contendrá los métodos
const useFetchReviews = () => {
  const endpoint = 'reviews';

  const handleGetReviews = async () => {
    try {
      const data = await API_FETCH_JSON(endpoint);
      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener las reviews',
        text2: error.message || 'Intenta nuevamente',
      });
      throw error;
    }
  };

  const handlePostReviews = async (reviewData) => {
    try {
      const formData = buildFormData(reviewData);
      const data = await API_FETCH_FORM(endpoint, formData, {
        method: 'POST',
      });

      Toast.show({
        type: 'success',
        text1: 'Review creada correctamente',
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al crear la review',
        text2: error.message || 'Intenta nuevamente',
      });
      throw error;
    }
  };

  const handlePutReviews = async (id, reviewData) => {
    try {
      const formData = buildFormData(reviewData);
      const data = await API_FETCH_FORM(`${endpoint}/${id}`, formData, {
        method: 'PUT',
      });

      Toast.show({
        type: 'success',
        text1: 'Review actualizada correctamente',
      });

      return data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar la review',
        text2: error.message || 'Intenta nuevamente',
      });
      throw error;
    }
  };

  const handleDeleteReviews = async (id) => {
    try {
      await API_FETCH_JSON(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      Toast.show({
        type: 'success',
        text1: 'Review eliminada correctamente',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al eliminar la review',
        text2: error.message || 'Intenta nuevamente',
      });
      throw error;
    }
  };

  return {
    handlePostReviews,
    handleGetReviews,
    handlePutReviews,
    handleDeleteReviews,
  };
};

export default useFetchReviews;
