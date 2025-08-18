import { toast } from 'react-hot-toast';
//Importo la funcion global para realizar el fetch
import { API_FETCH_JSON } from '../../config';

//Creo una constante que contendra los metodos
const useFetchEmployees = () => {
    //Declaro el endpoint
    const endpoint = 'employees';

    // Obtener todos los empleados
    const handleGetEmployees = async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            return data;
        } catch (error) {
            toast.error('Error al obtener empleados');
            console.error(error);
        }
    };

    // Crear un nuevo empleado
    const handlePostEmployee = async (employeeData) => {
        try {
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body: employeeData,
            });

            toast.success('Empleado registrado correctamente');
            return data;
        } catch (error) {
            toast.error('Error al registrar empleado');
            console.error(error);
        }
    };

    // Actualizar un empleado existente
    const handlePutEmployee = async (id, employeeData) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'PUT',
                body: employeeData,
            });

            toast.success('Empleado actualizado correctamente');
            return data;
        } catch (error) {
            toast.error('Error al actualizar empleado');
            console.error(error);
        }
    };

    // Eliminar un empleado
    const handleDeleteEmployee = async (id) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'DELETE',
            });

            toast.success('Empleado eliminado correctamente');
            return data;
        } catch (error) {
            toast.error('Error al eliminar empleado');
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
