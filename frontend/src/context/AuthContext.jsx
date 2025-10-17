import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import useFetchLogin from '../hooks/Login/useFetchLogin'; 
import { API_FETCH_JSON } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(true);
  const [verificationInfo, setVerificationInfo] = useState({ email: "", role: "" });

  const { handleLogin } = useFetchLogin();

  // Función para cargar el perfil completo del usuario
  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        console.warn('⚠️ No hay token, no se puede cargar perfil');
        return null;
      }

      console.log('📡 Cargando perfil desde: auth/me');

      const response = await API_FETCH_JSON('auth/me', {
        method: 'GET',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log('🔍 Respuesta completa del servidor:', JSON.stringify(response, null, 2));

      if (response && (response.user || response._id || response.id)) {
        // La respuesta puede venir como { user: {...} } o directamente {...}
        const userData = response.user || response;
        
        const fullUserData = {
          id: userData._id || userData.id,
          userType: userData.userType,
          email: userData.email,
          image: userData.image,
          
          // Campos de cliente
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
          birthday: userData.birthday || '',
          
          // Campos de veterinario
          nameVet: userData.nameVet || '',
          locationVet: userData.locationVet || '',
          nitVet: userData.nitVet || '',
          
          // Campos de empleado
          nameEmployees: userData.nameEmployees || '',
          phoneEmployees: userData.phoneEmployees || '',
          addressEmployees: userData.addressEmployees || '',
          duiEmployees: userData.duiEmployees || '',
          hireDateEmployee: userData.hireDateEmployee || '',
          dateOfBirth: userData.dateOfBirth || '',
        };
        
        console.log('✅ Usuario completo a guardar:', JSON.stringify(fullUserData, null, 2));
        
        setUser(fullUserData);
        await AsyncStorage.setItem("user", JSON.stringify(fullUserData));
        
        return fullUserData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      Toast.show({ 
        type: "error", 
        text1: "Error al cargar perfil",
        text2: error.message 
      });
      return null;
    }
  };

  const Login = async (email, password) => {
    try {
      const data = await handleLogin(email, password);

      console.log('📝 Datos COMPLETOS del login:', JSON.stringify(data, null, 2));

      // Construir userData con TODOS los campos que vienen del servidor
      const userData = {
        id: data.user?._id || data.user?.id,
        email: data.user?.email || email,
        userType: data.userType || data.user?.userType,
        image: data.user?.image || '',
        
        // Campos de cliente
        name: data.user?.name || '',
        phone: data.user?.phone || '',
        address: data.user?.address || '',
        birthday: data.user?.birthday || '',
        
        // Campos de veterinario
        nameVet: data.user?.nameVet || '',
        locationVet: data.user?.locationVet || '',
        nitVet: data.user?.nitVet || '',
        
        // Campos de empleado
        nameEmployees: data.user?.nameEmployees || '',
        phoneEmployees: data.user?.phoneEmployees || '',
        addressEmployees: data.user?.addressEmployees || '',
        duiEmployees: data.user?.duiEmployees || '',
        hireDateEmployee: data.user?.hireDateEmployee || '',
        dateOfBirth: data.user?.dateOfBirth || '',
      };

      console.log('👤 userData FINAL construido:', JSON.stringify(userData, null, 2));

      // Guardar inmediatamente en el estado
      setUser(userData);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      
      // Verificar que se guardó
      const verificar = await AsyncStorage.getItem("user");
      console.log('💾 Verificación - Usuario en AsyncStorage:', verificar);
      
      await clearVerificationInfo();

      // Cargar perfil completo desde auth/me para asegurar datos actualizados
      await loadUserProfile();

      console.log('✅ Login completado');

      return {
        success: true,
        message: data.message || "Sesión iniciada correctamente",
        userType: userData.userType,
        user: userData,
      };
    } catch (error) {
      console.error('❌ Error en Login:', error);
      return {
        success: false,
        message: error.message || "Error al iniciar sesión",
      };
    }
  };

  const logout = async () => {
    try {
      // Obtener token para logout
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        try {
          await API_FETCH_JSON("auth/logout", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          });
        } catch (logoutError) {
          console.log('Error en logout del servidor (ignorado)');
        }
      }

      Toast.show({ type: "success", text1: "Sesión cerrada correctamente" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error al cerrar sesión" });
    } finally {
      // Limpia todo el estado local
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("rememberMe");
      await AsyncStorage.removeItem("verificationInfo");
      setUser(null);
      setVerificationInfo({ email: "", role: "" });
      setPendingVerification(false);
    }
  };

  const updateVerificationInfo = async (info) => {
    setVerificationInfo(info);
    await AsyncStorage.setItem("verificationInfo", JSON.stringify(info));
  };

  const clearVerificationInfo = async () => {
    setVerificationInfo({ email: "", role: "" });
    await AsyncStorage.removeItem("verificationInfo");
    setPendingVerification(false);
  };

  const checkAuthStatus = async () => {
    try {
      // Verificar si hay token antes de hacer la petición
      const token = await AsyncStorage.getItem('authToken');
      
      console.log('🔐 checkAuthStatus - Token:', token ? 'Existe' : 'No existe');
      
      if (!token) {
        setUser(null);
        return false;
      }

      const response = await API_FETCH_JSON("auth/me", {
        method: 'GET',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log('📱 Respuesta de auth/me:', response);

      if (response.user) {
        const userData = {
          id: response.user._id || response.user.id,
          email: response.user.email,
          userType: response.user.userType,
          name: response.user.name || response.user.nameVet || response.user.nameEmployees,
          phone: response.user.phone || response.user.phoneEmployees,
          address: response.user.address || response.user.addressEmployees,
          birthday: response.user.birthday || response.user.dateOfBirth,
          image: response.user.image,
        };

        console.log('✅ Usuario autenticado:', userData);

        // Guardar datos básicos
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // Cargar perfil completo
        await loadUserProfile();

        const storedVerificationInfo = await AsyncStorage.getItem("verificationInfo");
        if (storedVerificationInfo) {
          await clearVerificationInfo();
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      // Si falla la autenticación, limpiar datos
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("authToken");
      setUser(null);
      return false;
    }
  };

  const checkPendingVerification = async () => {
    try {
      // Verificar si hay token antes de hacer la petición
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        setPendingVerification(false);
        return false;
      }

      const response = await API_FETCH_JSON("auth/pending-verification", {
        method: 'GET',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const hasPendingVerification = response.pending || false;
      setPendingVerification(hasPendingVerification);

      const storedVerificationInfo = await AsyncStorage.getItem("verificationInfo");

      if (!hasPendingVerification && storedVerificationInfo) {
        await clearVerificationInfo();
      }

      if (hasPendingVerification && !storedVerificationInfo) {
        Toast.show({ type: "error", text1: "No se han encontrado los datos de verificación necesarios" });
      }

      return hasPendingVerification;
    } catch (error) {
      console.error('Error checking pending verification:', error);
      setPendingVerification(false);
      return false;
    }
  };

  // Función para actualizar el perfil del usuario
  const updateProfile = async (updatedData) => {
    try {
      if (!user || !user.id) {
        throw new Error("No hay usuario autenticado");
      }

      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Filtrar datos vacíos
      const dataToSend = {};
      Object.keys(updatedData).forEach((key) => {
        if (
          updatedData[key] !== "" &&
          updatedData[key] !== null &&
          updatedData[key] !== undefined
        ) {
          dataToSend[key] = updatedData[key];
        }
      });

      if (Object.keys(dataToSend).length === 0) {
        Toast.show({
          type: 'error',
          text1: 'No hay cambios para guardar'
        });
        return { success: false };
      }

      console.log('📤 Actualizando perfil con:', JSON.stringify(dataToSend, null, 2));

      const response = await API_FETCH_JSON('auth/me/update', {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('📥 Respuesta de actualización:', JSON.stringify(response, null, 2));

      if (response) {
        // Recargar el perfil completo desde el servidor para asegurar sincronización
        const updatedProfile = await loadUserProfile();
        
        Toast.show({ 
          type: "success", 
          text1: "Perfil actualizado correctamente" 
        });
        
        return { success: true, data: updatedProfile };
      } else {
        Toast.show({ 
          type: "error", 
          text1: "No se pudo actualizar el perfil" 
        });
        return { success: false };
      }
    } catch (error) {
      console.error("❌ Error al actualizar el perfil:", error);
      Toast.show({ 
        type: "error", 
        text1: "Error al actualizar el perfil",
        text2: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  // Función para refrescar el perfil del usuario actual
  const refreshUserProfile = async () => {
    return await loadUserProfile();
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Verificar si hay token
        const token = await AsyncStorage.getItem('authToken');
        
        if (!token) {
          // No hay token, no hacer peticiones
          setUser(null);
          setPendingVerification(false);
          setLoadingUser(false);
          setLoadingVerification(false);
          return;
        }

        // 2. Si hay token, cargar usuario almacenado
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            await AsyncStorage.removeItem("user");
          }
        }

        // 3. Verificar información de verificación
        const storedVerificationInfo = await AsyncStorage.getItem("verificationInfo");
        if (storedVerificationInfo) {
          try {
            setVerificationInfo(JSON.parse(storedVerificationInfo));
          } catch {
            await AsyncStorage.removeItem("verificationInfo");
          }
        }

        // 4. Verificar estado en el servidor (esto también carga el perfil completo)
        await checkAuthStatus();
        setLoadingUser(false);

        await checkPendingVerification();
        setLoadingVerification(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoadingUser(false);
        setLoadingVerification(false);
      }
    };

    initializeAuth();
  }, []);

  const contextValue = {
    user,
    loadingUser,
    pendingVerification,
    loadingVerification,
    verificationInfo,
    Login,
    logout,
    checkAuthStatus,
    setPendingVerification,
    setLoadingVerification,
    setVerificationInfo,
    updateVerificationInfo,
    clearVerificationInfo,
    checkPendingVerification,
    loadUserProfile,
    updateProfile,
    refreshUserProfile,
    isEmployee: () => user?.userType === "employee" || user?.userType === "admin",
    isVet: () => user?.userType === "vet",
    isClient: () => user?.userType === "client",
    isPublicUser: () => ["vet", "client"].includes(user?.userType),
    isAuthenticated: () => !!user,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe ser usado dentro de AuthProvider");
  return context;
};