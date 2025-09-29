import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { API_FETCH_JSON } from '../../config.js';

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

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const data = await API_FETCH_JSON('login/auth/me', {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });

            console.log('User data received:', data);

            if (data.user) {
                setUserInfo(prevState => ({
                    ...prevState,
                    name: data.user.name || '',
                    email: data.user.email || '',
                    userType: data.user.userType || null,
                    birthDate: data.user.birthDate || prevState.birthDate,
                    phone: data.user.phone || prevState.phone
                }));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsAuthenticated(false);
            if (error.message && !error.message.includes('401') && !error.message.includes('No autenticado')) {
                Toast.show({
                    type: 'error',
                    text1: 'Error al cargar datos del usuario'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserData = async (updatedData) => {
        try {
            const endpoint = `users/${userInfo.userType}/${userInfo.id}`;
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
                Toast.show({
                    type: 'success',
                    text1: 'Datos actualizados correctamente'
                });
                return true;
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            Toast.show({
                type: 'error',
                text1: 'Error al actualizar los datos'
            });
            return false;
        }
    };

    const handleInputChange = (field, value) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    useEffect(() => {
        fetchUserData();
    }, []);

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