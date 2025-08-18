import { toast } from 'react-hot-toast';
//Importo las funciones globales para realizar el fetch
import { API_FETCH_FORM, API_FETCH_JSON } from '../../config';


// Funcion reutilizable para construir el FormData

const buildFormData = (reviewData) => {
  const {
    qualification,
    comment,
    designImages,
    idClient,
    idProduct
  } = reviewData

  const formData = new FormData();
  formData.append('qualification', qualification)
  formData.append('comment', comment)

  if (Array.isArray(designImages)) {
    designImages.forEach((file, index) => {
      formData.append('designImages', file)
    });
  }

  formData.append('idClient', idClient)
  formData.append('idProduct', idProduct)

  for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
  }

  return formData;

};

//Constante que contendra los metodos
const useFetchReviews = () => {
  //Declaro el endpoint
  const endpoint = 'reviews';

  // Obtener todas las reviews
  const handleGetReviews = async () => {
    try {
      const data = await API_FETCH_JSON(endpoint);
      return data;
    } catch (error) {
      toast.error('Error al obtener las reviews');
      throw error;
    }
  };

  // Crea una nueva review
  const handlePostReviews = async (reviewData) => {
    try {
      const formData = buildFormData(reviewData);
      const data = await API_FETCH_FORM(endpoint, formData, {
        method: 'POST',
      });

      toast.success('Review creada correctamente');
      return data;

    } catch (error) {
      toast.error('Error al crear la review');
      throw error;
    }
  };

  //Actualiza un review ya existente
  const handlePutReviews = async (id, reviewData) => {
    try {
      const formData = buildFormData(reviewData);
      const data = await API_FETCH_FORM(`${endpoint}/${id}`, formData, {
        method: 'PUT',
      })

      toast.success('Review actualizada correctamente');
      return data;

    } catch (error) {
      toast.error('Error al actualizar la review');
      throw error;
    }
  };

  //Elimina un review
  const handleDeleteReviews = async (id) => {
    try {
      await API_FETCH_JSON(`${endpoint}/${id}`, {
        method: 'DELETE',
      })

      toast.success('Review eliminada correctamente');

    } catch (error) {
      toast.error('Error al eliminar la review');
      throw error;
    }
  };

  return { handlePostReviews, handleGetReviews, handlePutReviews, handleDeleteReviews };
};

export default useFetchReviews;
