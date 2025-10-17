import { useState, useEffect, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_FETCH_JSON } from '../../config.js';

const useFetchUser = () => {
  const [userInfo, setUserInfo] = useState({
    _id: '',
    userType: null,
    email: '',
    password: '', 
    image: '',
    name: '',
    nameVet: '',
    nameEmployees: '',
    phone: '',
    phoneEmployees: '',
    address: '',
    addressEmployees: '',
    birthday: '',
    dateOfBirth: '',
    hireDateEmployee: '',
    duiEmployees: '',
    locationVet: '',   
    nitVet: ''         
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Endpoints
  const endpointProfile = 'auth/me';
  const endpointUpdate = 'auth/me/update';
  const endpointLogout = 'auth/logout';

  const getAuthToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }, []);

  const clearAuthData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
    
    setIsAuthenticated(false);
    setUserInfo({
      _id: '',
      userType: null,
      email: '',
      password: '',
      image: '',
      name: '',
      nameVet: '',
      nameEmployees: '',
      phone: '',
      phoneEmployees: '',
      address: '',
      addressEmployees: '',
      birthday: '',
      dateOfBirth: '',
      hireDateEmployee: '',
      duiEmployees: '',
      locationVet: '',
      nitVet: ''
    });
    setError(null);
  }, []);

  const mapUserData = useCallback((userData) => {
    if (!userData) return null;

    const base = {
      _id: userData._id || userData.id || '',
      userType: userData.userType || null,
      email: userData.email || '',
      password: '',
      image: userData.image || '',
      name: userData.name || '',
      nameVet: userData.nameVet || '',
      nameEmployees: userData.nameEmployees || '',
      phone: userData.phone || '',
      phoneEmployees: userData.phoneEmployees || '',
      address: userData.address || '',
      addressEmployees: userData.addressEmployees || '',
      birthday: userData.birthday || '',
      dateOfBirth: userData.dateOfBirth || '',
      hireDateEmployee: userData.hireDateEmployee || '',
      duiEmployees: userData.duiEmployees || '',
      locationVet: userData.locationVet || '',
      nitVet: userData.nitVet || ''
    };

    // Asegurarse de que el nombre principal esté disponible
    if (userData.userType === "client") {
      base.name = userData.name || '';
    } else if (userData.userType === "vet") {
      base.name = userData.nameVet || userData.name || '';
    } else if (userData.userType === "employee") {
      base.name = userData.nameEmployees || userData.name || '';
    }

    return base;
  }, []);

  const fetchUserData = useCallback(async () => {
    const token = await getAuthToken();
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);

    try {
      const response = await API_FETCH_JSON(endpointProfile, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = response.user || response;
      
      if (userData && (userData._id || userData.id)) {
        const mappedUserData = mapUserData(userData);
        setUserInfo(mappedUserData);
        setIsAuthenticated(true);
        return mappedUserData;
      } else {
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
        await clearAuthData();
      }
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken, mapUserData, clearAuthData]);

  const filterDataForUpdate = useCallback((data) => {
    const filteredData = {};

    // Campos comunes
    if (data.email && data.email.trim()) filteredData.email = data.email.trim();

    if (data.userType === "client") {
      if (data.name && data.name.trim()) filteredData.name = data.name.trim();
      if (data.phone && data.phone.trim()) filteredData.phone = data.phone.trim();
      if (data.address && data.address.trim()) filteredData.address = data.address.trim();
      if (data.birthday) filteredData.birthday = data.birthday;
    } else if (data.userType === "vet") {
      if (data.name && data.name.trim()) {
        filteredData.nameVet = data.name.trim();
      }
      if (data.locationVet && data.locationVet.trim()) filteredData.locationVet = data.locationVet.trim();
      if (data.nitVet && data.nitVet.trim()) filteredData.nitVet = data.nitVet.trim();
    } else if (data.userType === "employee") {
      if (data.name && data.name.trim()) {
        filteredData.nameEmployees = data.name.trim();
      }
      if (data.phoneEmployees && data.phoneEmployees.trim()) filteredData.phoneEmployees = data.phoneEmployees.trim();
      if (data.addressEmployees && data.addressEmployees.trim()) filteredData.addressEmployees = data.addressEmployees.trim();
      if (data.duiEmployees && data.duiEmployees.trim()) filteredData.duiEmployees = data.duiEmployees.trim();
    }

    // Eliminar campos vacíos
    Object.keys(filteredData).forEach(key => {
      if (filteredData[key] === undefined || filteredData[key] === null || filteredData[key] === '') {
        delete filteredData[key];
      }
    });

    return filteredData;
  }, []);

  const updateUserData = useCallback(async (updatedData) => {
    const token = await getAuthToken();
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Debes iniciar sesión primero'
      });
      return false;
    }

    try {
      const dataToSend = filterDataForUpdate(updatedData);

      if (Object.keys(dataToSend).length === 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No hay cambios para guardar'
        });
        return false;
      }

      const response = await API_FETCH_JSON(endpointUpdate, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: dataToSend
      });

      if (response && (
        response.message?.includes('actualizado') ||
        response.message?.includes('éxito') ||
        response.message?.includes('correctamente') ||
        response.success
      )) {
        // Recargar datos del servidor
        await fetchUserData();
        
        Toast.show({
          type: 'success',
          text1: 'Éxito',
          text2: 'Datos actualizados correctamente'
        });
        return true;
      } else {
        const errorMsg = response.message || 'Error al actualizar los datos';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg
        });
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al actualizar los datos'
      });
      return false;
    }
  }, [getAuthToken, filterDataForUpdate, fetchUserData]);

  const logout = useCallback(async () => {
    const token = await getAuthToken();
    
    try {
      setIsLoading(true);
      
      if (token) {
        try {
          await API_FETCH_JSON(endpointLogout, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (logoutError) {
          console.log('Error en logout del servidor (ignorado)');
        }
      }
      
      await clearAuthData();
      
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Sesión cerrada correctamente'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken, clearAuthData]);

  const handleInputChange = useCallback((field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const refreshUserData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Cargar datos automáticamente cuando hay token
  useEffect(() => {
    const loadInitialData = async () => {
      const token = await getAuthToken();
      if (token) {
        setIsAuthenticated(true);
        await fetchUserData();
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [getAuthToken, fetchUserData]);

  return {
    userInfo,
    isLoading,
    isAuthenticated,
    error,
    logout,
    handleInputChange,
    updateUserData,
    refreshUserData,
    clearAuthData,
    getAuthToken,
    fetchUserData
  };
};

export default useFetchUser;