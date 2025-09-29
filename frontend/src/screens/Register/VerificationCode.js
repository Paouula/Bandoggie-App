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
  BackHandler,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useForm } from "react-hook-form";

// Importar componentes personalizados
import ButtonComponent from "../../components/Button/Button";
import VerificationCodeInput from "../../components/VerificationCodeInput/VerificationCodeInput";
import useFetchRegister from "../../hooks/Register/useFetchRegister";
import useFetchResend from "../../hooks/Register/useFetchResendVerifyCode";
import { useAuth } from "../../context/AuthContext";

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
  const { setPendingVerification, verificationInfo, clearVerificationInfo } = useAuth();

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

  // Prevenir que el usuario salga de esta pantalla usando el botón atrás
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Verificación requerida",
          "Debes completar la verificación de tu correo electrónico antes de continuar.",
          [
            {
              text: "Cancelar registro",
              style: "destructive",
              onPress: () => {
                clearVerificationInfo();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              },
            },
            {
              text: "Continuar verificación",
              style: "cancel",
            },
          ]
        );
        return true; // Previene el comportamiento por defecto
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [navigation, clearVerificationInfo])
  );

  // Verificar que se hayan enviado los datos necesarios
  useEffect(() => {
    if (!currentEmail || !currentRole) {
      Alert.alert(
        "Error",
        "Faltan datos de verificación. Intenta registrarte nuevamente.",
        [{ text: "OK", onPress: () => navigation.reset({
          index: 0,
          routes: [{ name: "Choose" }],
        }) }]
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
        Alert.alert(
          "Éxito", 
          "Código verificado con éxito. ¡Bienvenido a Bandoggie!",
          [
            {
              text: "Continuar",
              onPress: () => {
                reset();
                clearVerificationInfo();
                setPendingVerification(false);
                
                // Navegar al login
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }
            }
          ]
        );
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

  const handleCancelRegistration = () => {
    Alert.alert(
      "Cancelar registro",
      "¿Estás seguro que deseas cancelar el registro? Tendrás que volver a registrarte desde el inicio.",
      [
        {
          text: "No, continuar verificación",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => {
            clearVerificationInfo();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  // Si no tenemos los datos necesarios, mostrar pantalla de error
  if (!currentEmail || !currentRole) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/LogoBandoggie.png")}
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
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: "Choose" }],
              })}
              style={styles.submitButton}
            />

            <View style={styles.decorationContainer}>
              <View style={styles.decorationGradient}>
                <View style={styles.gradientSection1} />
                <View style={styles.gradientSection2} />
                <View style={styles.gradientSection3} />
              </View>
            </View>
          </ScrollView>
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/LogoBandoggie.png")}
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

          {/* Formulario */}
          <View style={styles.form}>
            {/* Botón de envío */}
            <ButtonComponent
              title={isSubmitting ? "Verificando..." : "Verificar"}
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

            {/* Botón para cancelar registro */}
            <TouchableOpacity
              onPress={handleCancelRegistration}
              style={styles.cancelContainer}
            >
              <Text style={styles.cancelText}>
                Cancelar registro
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.decorationContainer}>
            <View style={styles.decorationGradient}>
              <View style={styles.gradientSection1} />
              <View style={styles.gradientSection2} />
              <View style={styles.gradientSection3} />
            </View>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 130,
    height: 50,
    maxWidth: 130,
  },
  separator: {
    height: 2,
    backgroundColor: "#b4ceec",
    marginHorizontal: 0,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: "#365a7d",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  infoContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  emailText: {
    fontWeight: "bold",
    color: "#365a7d",
  },
  roleText: {
    fontSize: 12,
    textAlign: "center",
    color: "#999",
  },
  codeContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  form: {
    alignItems: "stretch",
    marginBottom: 40,
  },
  submitButton: {
    marginTop: 15,
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  resendText: {
    fontSize: 14,
    color: "#ff9900",
    textDecorationLine: "underline",
  },
  disabledResend: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
    textDecorationLine: "none",
  },
  cancelContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 14,
    color: "#FF3B30",
    textDecorationLine: "underline",
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
  decorationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    overflow: "hidden",
  },
  decorationGradient: {
    flex: 1,
    flexDirection: "row",
  },
  gradientSection1: {
    flex: 1,
    backgroundColor: "#f7c7de",
  },
  gradientSection2: {
    flex: 1,
    backgroundColor: "#d9f4ff",
  },
  gradientSection3: {
    flex: 1,
    backgroundColor: "#b4ceec",
  },
});

export default VerificationCodeScreen;