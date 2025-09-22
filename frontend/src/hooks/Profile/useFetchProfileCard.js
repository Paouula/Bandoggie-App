import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { API_FETCH_JSON } from '../../config.js';

// Hook para obtener y manejar los datos del usuario autenticado
const useFetchUser = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        birthDate: '',
        phone: '',
        password: '',
        userType: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Función para obtener los datos del usuario autenticado
    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            // Endpoint corregido según tu estructura de rutas
            const data = await API_FETCH_JSON('login/auth/me', {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
                credentials: 'include' // Importante para enviar las cookies
            });

            console.log('User data received:', data); // Para debugging

            if (data.user) {
                setUserInfo(prevState => ({
                    ...prevState,
                    name: data.user.name || '',
                    email: data.user.email || '',
                    userType: data.user.userType || null,
                    // Mantener campos adicionales si existen
                    birthDate: data.user.birthDate || prevState.birthDate,
                    phone: data.user.phone || prevState.phone
                }));
                setIsAuthenticated(true);
            } else {
                // Si no hay datos de usuario, no está autenticado
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsAuthenticated(false);
            
            // Solo mostrar error si no es un problema de autenticación
            if (error.message && !error.message.includes('401') && !error.message.includes('No autenticado')) {
                toast.error('Error al cargar datos del usuario');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Función para actualizar datos del usuario
    const updateUserData = async (updatedData) => {
        try {
            const endpoint = `users/${userInfo.userType}/${userInfo.id}`; // Ajustar según tu API
            const data = await API_FETCH_JSON(endpoint, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: updatedData
            });

            if (data.success) {
                setUserInfo(prevState => ({
                    ...prevState,
                    ...updatedData
                }));
                toast.success('Datos actualizados correctamente');
                return true;
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            toast.error('Error al actualizar los datos');
            return false;
        }
    };

    // Función para manejar cambios en los campos del formulario
    const handleInputChange = (field, value) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        fetchUserData();
    }, []);

    // Función para refrescar los datos (útil después del login)
    const refreshUserData = () => {
        fetchUserData();
    };

    return {
        userInfo,
        isLoading,
        isAuthenticated,
        handleInputChange,
        updateUserData,
        refreshUserData
    };
};

export default useFetchUser;