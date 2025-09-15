import { toast } from 'react-native-toast-message';
//Importo la funcion global para realizar el fetch

import { API_FETCH_JSON } from '../../config';

//Creo una constante que contendra los metodos
const useFetchHolidays = () => {
    //Declaro el endpoint
    const endpoint = 'holiday';

    //Obtener todas las festividades
    const handleGetHolidays = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            toast.error('Error al obtener las festividades');
            console.error(error);
        }
    };

    // Crear una nueva festividad

    const handlePostHoliday = async (holidayData) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body: holidayData,
            });

            toast.success('Festividad creada exitosamente');
            return data;

        } catch (error) {
            toast.error('Error al crear la festividad');
            console.error(error);
        }
    };
    return { handleGetHolidays, handlePostHoliday };
};

export default useFetchHolidays;
