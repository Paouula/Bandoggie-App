import Toast from 'react-native-toast-message';
import { API_FETCH_JSON } from '../../config';

const useFetchEmployees = () => {
    const endpoint = 'employees';

    const handleGetEmployees = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al obtener empleados'
            });
            console.error(error);
        }
    };

    const handlePostEmployee = async (employeeData) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body: employeeData,
            });

            Toast.show({
                type: 'success',
                text1: 'Empleado registrado correctamente'
            });
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al registrar empleado'
            });
            console.error(error);
        }
    };

    const handlePutEmployee = async (id, employeeData) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'PUT',
                body: employeeData,
            });

            Toast.show({
                type: 'success',
                text1: 'Empleado actualizado correctamente'
            });
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al actualizar empleado'
            });
            console.error(error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'DELETE',
            });

            Toast.show({
                type: 'success',
                text1: 'Empleado eliminado correctamente'
            });
            return data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al eliminar empleado'
            });
            console.error(error);
        }
    };

    return {
        handleGetEmployees,
        handlePostEmployee,
        handlePutEmployee,
        handleDeleteEmployee,
    };
};

export default useFetchEmployees;