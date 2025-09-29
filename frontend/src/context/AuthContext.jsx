import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useFetchLogin } from '../hooks/Login/useFetchLogin'; // Ajusta la ruta según tu estructura
import { API_FETCH_JSON } from '../config'; // Ajusta la ruta según tu estructura

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
      await API_FETCH_JSON("logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      Toast.show({ type: "success", text1: "Sesión cerrada correctamente" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error al cerrar sesión" });
    } finally {
      await AsyncStorage.removeItem("user");
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
      const response = await API_FETCH_JSON("auth/me", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      return false;
    }
  };

  const checkPendingVerification = async () => {
    try {
      const response = await API_FETCH_JSON("auth/pending-verification", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      setPendingVerification(false);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          await AsyncStorage.removeItem("user");
        }
      }

      const storedVerificationInfo = await AsyncStorage.getItem("verificationInfo");
      if (storedVerificationInfo) {
        try {
          setVerificationInfo(JSON.parse(storedVerificationInfo));
        } catch {
          await AsyncStorage.removeItem("verificationInfo");
        }
      }

      await checkAuthStatus();
      setLoadingUser(false);

      await checkPendingVerification();
      setLoadingVerification(false);
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
    isEmployee: () => user?.userType === "employee",
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