import { Alert } from 'react-native';
import { API_FETCH_JSON } from '../../config';

const endpoint = 'employees';

const employeeService = {
    getEmployees: async () => {
        try {
            const data = await API_FETCH_JSON(endpoint);
            console.log('Datos del backend:', JSON.stringify(data, null, 2));
            return data.map(emp => ({
                ...emp,
                nombreUsuario: emp.usuario || emp.nombre || ''
            }));
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            throw error;
        }
    },

    createEmployee: async (employeeData) => {
        try {
            console.log('Enviando datos para crear empleado:', employeeData);
            const data = await API_FETCH_JSON(endpoint, {
                method: 'POST',
                body: employeeData,
            });
            console.log('Empleado creado exitosamente:', data);
            return data;
        } catch (error) {
            console.error('Error al crear empleado:', error);
            console.error('Detalles del error:', error.response?.data || error.message);
            throw error;
        }
    },

    updateEmployee: async (id, employeeData) => {
        try {
            if (!id) {
                throw new Error('ID de empleado no válido');
            }
            console.log('Actualizando empleado ID:', id);
            console.log('Datos a enviar:', JSON.stringify(employeeData, null, 2));
            const data = await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'PUT',
                body: employeeData,
            });
            console.log('Empleado actualizado exitosamente:', data);
            return data;
        } catch (error) {
            console.error('Error al actualizar empleado ID:', id);
            console.error('Datos que se intentaron enviar:', JSON.stringify(employeeData, null, 2));
            console.error('Error completo:', error);
            console.error('Respuesta del servidor:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error ||
                               error.message || 
                               'Error desconocido al actualizar empleado';
            const detailedError = new Error(errorMessage);
            detailedError.response = error.response;
            detailedError.originalError = error;
            throw detailedError;
        }
    },

    deleteEmployee: async (id) => {
        try {
            if (!id) {
                throw new Error('ID de empleado no válido');
            }
            console.log('Eliminando empleado ID:', id);
            const data = await API_FETCH_JSON(`${endpoint}/${id}`, {
                method: 'DELETE',
            });
            console.log('Empleado eliminado exitosamente');
            return data;
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            console.error('Detalles del error:', error.response?.data || error.message);
            throw error;
        }
    },

    searchEmployees: async (searchTerm) => {
        try {
            const data = await API_FETCH_JSON(`${endpoint}/search?q=${encodeURIComponent(searchTerm)}`);
            return data.map(emp => ({
                ...emp,
                nombreUsuario: emp.usuario || emp.nombre || ''
            }));
        } catch (error) {
            console.error('Error al buscar empleados:', error);
            throw error;
        }
    }
};

export default employeeService;
