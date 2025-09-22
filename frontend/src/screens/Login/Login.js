import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

// Importar componentes personalizados para toda la app
import InputComponent from "../../components/Input/Input.js";
import ButtonComponent from "../../components/Button/Button.js";
import PasswordInput from "../../components/InputPassword/InputPassword.js";
import { useAuth } from "../../context/AuthContext";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { Login, loadingUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // Valida los campos
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigateBasedOnUserType = (userType) => {
    const routes = {
      employee: "AdminProducts",
      vet: "MainPage",
      client: "MainPage",
    };

    const targetRoute = routes[userType];
    
    if (targetRoute) {
      // Usar replace para evitar que puedan volver atrás al login
      navigation.replace(targetRoute);
    } else {
      Alert.alert("Error", "Tipo de usuario no reconocido.");
    }
  };

  const onSubmit = async (formData) => {
    // Verificar que no hay carga en progreso
    if (isLoading || loadingUser) {
      return;
    }

    const { email, password } = formData;

    // Validación adicional (aunque react-hook-form ya valida)
    if (!email?.trim() || !password?.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      // Usar la función Login del AuthContext
      const response = await Login(email.trim(), password);

      if (response.success) {
        // Limpiar formulario
        reset();
        
        // Mostrar mensaje de éxito (opcional, ya que el toast lo maneja)
        Alert.alert(
          "¡Bienvenido!", 
          "Sesión iniciada correctamente", 
          [
            {
              text: "Continuar",
              onPress: () => navigateBasedOnUserType(response.userType),
            },
          ],
          { cancelable: false }
        );
      } else {
        // El error ya fue mostrado por el toast en el hook
        Alert.alert(
          "Error de autenticación", 
          response.message || "No se pudo iniciar sesión"
        );
      }
    } catch (error) {
      console.error("Error inesperado en onSubmit:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error inesperado. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("RequestCode");
  };

  const handleGoToRegister = () => {
    navigation.navigate("ChooseAccount");
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Si el contexto está cargando, mostrar loading
  if (loadingUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Verificando sesión...</Text>
        </View>
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
          {/* Header con botón de cerrar */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleGoBack}
              disabled={isLoading}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/LogoBandoggie.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.separator} />

          {/* Título */}
          <Text style={styles.title}>Iniciar Sesión</Text>

          {/* Link de registro */}
          <TouchableOpacity
            onPress={handleGoToRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerLink}>
              ¿No tienes una cuenta aún? Regístrate
            </Text>
          </TouchableOpacity>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un correo electrónico válido",
                },
                minLength: {
                  value: 5,
                  message: "El correo debe tener al menos 5 caracteres",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputComponent
                  placeholder="ejemplo@correo.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  rightIcon="📧"
                  editable={!isLoading}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            <Text style={[styles.label, styles.labelSpacing]}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  placeholder="Ingresa tu contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isLoading}
                  autoComplete="password"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            {/* Link de olvidé contraseña */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Botón de confirmación */}
            <ButtonComponent
              title="Iniciar Sesión"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading || !isValid}
              style={[
                styles.submitButton,
                (!isValid || isLoading) && styles.disabledButton,
              ]}
            />
          </View>

          {/* Decoración inferior */}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
  },
  keyboardView: {
    width: "100%",
    maxWidth: 450,
  },
  scrollContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  closeButton: {
    padding: 5,
    position: "absolute",
    top: -10,
    right: -15,
    zIndex: 1001,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 130,
    height: 50,
    maxWidth: 130,
  },
  separator: {
    height: 2,
    backgroundColor: "#b4ceec",
    marginHorizontal: -30,
    marginVertical: 10,
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
  registerLink: {
    fontSize: 12,
    color: "#ff9900",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  form: {
    alignItems: "stretch",
    marginBottom: 60,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#365a7d",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "left",
  },
  labelSpacing: {
    marginTop: 15,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "left",
  },
  forgotPassword: {
    fontSize: 12,
    color: "#ff9900",
    textAlign: "right",
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  decorationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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

export default LoginScreen;