import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";

// Importar componentes personalizados
import ButtonComponent from "../components/ButtonComponent";
import VerificationCodeInput from "../components/VerificationCodeInput";
import useFetchRegister from "../hooks/Register/useFetchRegister";
import useFetchResend from "../hooks/Register/useFetchResendVerifyCode";
import { useAuth } from "../context/AuthContext";

const VerificationCodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, role } = route.params || {};
  
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const { verifyEmail } = useFetchRegister();
  const { resendVerifyEmail } = useFetchResend();
  const { setPendingVerification, verificationInfo } = useAuth();

  // Usar verificationInfo del contexto si no se pasan por parámetros
  const currentEmail = email || verificationInfo?.email;
  const currentRole = role || verificationInfo?.role;

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { token: "" },
  });

  // Verificar que se hayan enviado los datos necesarios
  useEffect(() => {
    if (!currentEmail || !currentRole) {
      Alert.alert(
        "Error",
        "Faltan datos de verificación. Intenta registrarte nuevamente.",
        [{ text: "OK", onPress: () => navigation.navigate("ChooseAccount") }]
      );
    }
  }, [currentEmail, currentRole, navigation]);

  // Temporizador para el reenvío
  useEffect(() => {
    if (!isResending) return;
    
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isResending]);

  const handleResendCode = async () => {
    if (!currentEmail || !currentRole) {
      Alert.alert("Error", "No se puede reenviar el código: faltan datos de verificación.");
      return;
    }

    if (isResending) return;
    
    setIsResending(true);
    setResendCountdown(30);

    try {
      await resendVerifyEmail({ email: currentEmail, role: currentRole });
      Alert.alert("Éxito", "Código reenviado a tu correo.");
    } catch (error) {
      Alert.alert("Error", error.message || "Error al reenviar el código.");
    } finally {
      // Bloquear el botón por 30 segundos
      setTimeout(() => setIsResending(false), 30000);
    }
  };

  const onSubmit = async (data) => {
    if (!data.token || data.token.length < 6) {
      Alert.alert("Error", "Debes ingresar un código válido");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await verifyEmail(data.token);
      if (response) {
        Alert.alert("Éxito", "Código verificado con éxito.");
        reset();
        
        // Actualizar estado global
        setPendingVerification(false);
        
        // Navegar al login
        navigation.navigate("Login");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Error al verificar el código.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (code) => {
    setVerificationCode(code);
    setValue("token", code);
  };

  // Si no tenemos los datos necesarios, mostrar pantalla de error
  if (!currentEmail || !currentRole) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/LogoBandoggie.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.separator} />

            <Text style={styles.title}>Error de Verificación</Text>
            
            <Text style={styles.errorMessage}>
              No se encontraron los datos necesarios para la verificación.
            </Text>
            
            <Text style={styles.errorSubMessage}>
              Por favor, intenta registrarte nuevamente.
            </Text>

            <ButtonComponent
              title="Cerrar"
              onPress={() => navigation.navigate("ChooseAccount")}
              style={styles.submitButton}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/LogoBandoggie.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.separator} />

          <Text style={styles.title}>Verifique su código</Text>

          {/* Información del email */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Ingrese el código que se le ha enviado a:{" "}
              <Text style={styles.emailText}>{currentEmail}</Text>
            </Text>
            <Text style={styles.roleText}>
              Tipo de cuenta: {currentRole === "client" ? "Usuario Normal" : "Veterinaria"}
            </Text>
          </View>

          {/* Input del código de verificación */}
          <View style={styles.codeContainer}>
            <VerificationCodeInput
              onChange={handleCodeChange}
              value={verificationCode}
            />
          </View>

          {/* Botón de envío */}
          <ButtonComponent
            title={isSubmitting ? "Enviando..." : "Verificar"}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting || verificationCode.length < 6}
            style={styles.submitButton}
          />

          {/* Link para reenviar código */}
          <TouchableOpacity
            onPress={!isResending ? handleResendCode : undefined}
            disabled={isResending}
            style={[styles.resendContainer, isResending && styles.disabledResend]}
          >
            <Text style={[styles.resendText, isResending && styles.disabledText]}>
              {isResending
                ? `Espera ${resendCountdown} segundos para reenviar`
                : "Reenviar código"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 80,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  infoContainer: {
    marginBottom: 40,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
    marginBottom: 10,
  },
  emailText: {
    fontWeight: "bold",
    color: "#333",
  },
  roleText: {
    fontSize: 12,
    textAlign: "center",
    color: "#999",
  },
  codeContainer: {
    marginBottom: 40,
  },
  submitButton: {
    marginBottom: 30,
  },
  resendContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  resendText: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  disabledResend: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
    textDecorationLine: "none",
  },
  errorMessage: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 15,
  },
  errorSubMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
});

export default VerificationCodeScreen;