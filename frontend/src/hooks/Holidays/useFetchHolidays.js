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
            console.log('Festividades obtenidas:', data);
            return data;
        } catch (error) {
            console.error('Error detallado al obtener festividades:', error);
            toast.show({
                type: 'error',
                text1: 'Error al obtener las festividades',
                text2: 'Verifica tu conexión a internet'
            });
            return [];
        }
    };

    // Crear una nueva festividad
    const handlePostHoliday = async (holidayData) => {
        try {
            console.log('Enviando datos de festividad:', holidayData);
            
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body: JSON.stringify(holidayData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Festividad creada:', data);
            toast.show({
                type: 'success',
                text1: 'Festividad creada exitosamente'
            });
            return data;

        } catch (error) {
            console.error('Error detallado al crear festividad:', error);
            toast.show({
                type: 'error',
                text1: 'Error al crear la festividad',
                text2: 'Revisa los datos e intenta nuevamente'
            });
            return null;
        }
    };

    // Obtener una festividad por ID
    const handleGetHolidayById = async (holidayId) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/${holidayId}`);
            console.log('Festividad obtenida por ID:', data);
            return data;
        } catch (error) {
            console.error('Error al obtener festividad por ID:', error);
            toast.show({
                type: 'error',
                text1: 'Error al obtener la festividad'
            });
            return null;
        }
    };

    return { 
        handleGetHolidays, 
        handlePostHoliday, 
        handleGetHolidayById 
    };
};

export default useFetchHolidays;