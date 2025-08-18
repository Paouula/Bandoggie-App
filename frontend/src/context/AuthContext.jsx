import React, { createContext, useContext, useState, useEffect } from "react";
import useFetchLogin from "../hooks/Login/useFetchLogin.js";
import { API_FETCH_JSON } from "../config.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(true);
  const [verificationInfo, setVerificationInfo] = useState({
    email: "",
    role: "",
  });

  // Usar el hook personalizado para login
  const { handleLogin } = useFetchLogin();

  const Login = async (email, password) => {
    try {
      // Usar handleLogin del hook personalizado
      const data = await handleLogin(email, password);

      // Procesar respuesta exitosa
      const userData = {
        id: data.user?.id,
        email: data.user?.email || email,
        userType: data.userType,
        name: data.user?.name,
        // Agregar otros campos que vengan del backend
      };

      // Guardar usuario en estado y localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Limpiar información de verificación al hacer login exitoso
      clearVerificationInfo();

      return {
        success: true,
        message: data.message || "Sesión iniciada correctamente",
        userType: userData.userType,
        user: userData
      };
    } catch (error) {
      console.error("Error en Login (AuthContext):", error);
      
      // El toast ya se maneja en useFetchLogin, solo devolvemos el error
      return { 
        success: false, 
        message: error.message || "Error al iniciar sesión" 
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
      
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error en logout:", error);
      toast.error("Error al cerrar sesión");
    } finally {
      // Limpiar estado y localStorage independientemente del resultado
      localStorage.removeItem("user");
      localStorage.removeItem("verificationInfo");
      setUser(null);
      setVerificationInfo({ email: "", role: "" });
      setPendingVerification(false);
    }
  };

  // Función para actualizar verificationInfo de forma persistente
  const updateVerificationInfo = (info) => {
    setVerificationInfo(info);
    localStorage.setItem("verificationInfo", JSON.stringify(info));
  };

  // Función para limpiar verificationInfo
  const clearVerificationInfo = () => {
    setVerificationInfo({ email: "", role: "" });
    localStorage.removeItem("verificationInfo");
    setPendingVerification(false);
  };

  // Función para verificar autenticación
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
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Si el usuario está autenticado, limpiar verificationInfo
        const storedVerificationInfo = localStorage.getItem("verificationInfo");
        if (storedVerificationInfo) {
          clearVerificationInfo();
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      return false;
    }
  };

  // Función para verificar estado de verificación pendiente
  const checkPendingVerification = async () => {
    try {
      const response = await API_FETCH_JSON("auth/pending-verification", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const hasPendingVerification = response.pending || false;
      setPendingVerification(hasPendingVerification);

      const storedVerificationInfo = localStorage.getItem("verificationInfo");
      
      if (!hasPendingVerification && storedVerificationInfo) {
        clearVerificationInfo();
      }

      if (hasPendingVerification && !storedVerificationInfo) {
        console.warn("No se han encontrado los datos de verificación necesarios");
        toast.error("No se han encontrado los datos de verificación necesarios");
      }

      return hasPendingVerification;
    } catch (error) {
      console.error("Error al obtener estado de verificación:", error);
      setPendingVerification(false);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Recuperar usuario del localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error("Error al parsear usuario del localStorage:", error);
          localStorage.removeItem("user");
        }
      }

      // Recuperar verificationInfo del localStorage
      const storedVerificationInfo = localStorage.getItem("verificationInfo");
      if (storedVerificationInfo) {
        try {
          const verificationData = JSON.parse(storedVerificationInfo);
          setVerificationInfo(verificationData);
        } catch (error) {
          console.error("Error al parsear verificationInfo del localStorage:", error);
          localStorage.removeItem("verificationInfo");
        }
      }

      // Verificar autenticación con el backend
      await checkAuthStatus();
      setLoadingUser(false);

      // Verificar estado de verificación pendiente
      await checkPendingVerification();
      setLoadingVerification(false);
    };

    initializeAuth();
  }, []);

  // Funciones de utilidad para verificar roles
  const isEmployee = () => user?.userType === "employee";
  const isVet = () => user?.userType === "vet";
  const isClient = () => user?.userType === "client";
  const isPublicUser = () => isVet() || isClient();
  const isAuthenticated = () => !!user;

  const contextValue = {
    // Estado
    user,
    loadingUser,
    pendingVerification,
    loadingVerification,
    verificationInfo,
    
    // Funciones de autenticación
    Login,
    logout,
    checkAuthStatus,
    
    // Funciones de verificación
    setPendingVerification,
    setLoadingVerification,
    setVerificationInfo,
    updateVerificationInfo,
    clearVerificationInfo,
    checkPendingVerification,
    
    // Funciones de utilidad
    isEmployee,
    isVet,
    isClient,
    isPublicUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};