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

  const Login = async (email, password) => {
    try {
      const data = await handleLogin(email, password);

      const userData = {
        id: data.user?.id,
        email: data.user?.email || email,
        userType: data.userType,
        name: data.user?.name,
      };

      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      clearVerificationInfo();

      return {
        success: true,
        message: data.message || "Sesión iniciada correctamente",
        userType: userData.userType,
        user: userData,
      };
    } catch (error) {
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

      if (response.user) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          userType: response.user.userType,
          name: response.user.name,
        };

        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        const storedVerificationInfo = await AsyncStorage.getItem("verificationInfo");
        if (storedVerificationInfo) {
          await clearVerificationInfo();
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking auth status:', error);
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

        // 4. Verificar estado en el servidor
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