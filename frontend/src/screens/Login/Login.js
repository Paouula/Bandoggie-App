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

// AHORA RECIBE onLogin POR PROPS
const LoginScreen = (props) => {
  const navigation = useNavigation();
  const { Login, loadingUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading || loadingUser) {
      return;
    }

    const { email, password } = formData;

    if (!email?.trim() || !password?.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Login(email.trim(), password);

      if (response.success) {
        reset();
        // LLAMA A LA PROP onLogin PARA AVISAR QUE EL USUARIO ESTÁ AUTENTICADO
        if (props.onLogin) {
          props.onLogin();
        }
        // Si quieres mostrar un mensaje, puedes hacerlo aquí
        // Alert.alert("¡Bienvenido!", "Sesión iniciada correctamente");
      } else {
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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleGoBack}
              disabled={isLoading}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/LogoBandoggie.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.separator} />

          <Text style={styles.title}>Iniciar Sesión</Text>

          <TouchableOpacity
            onPress={handleGoToRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerLink}>
              ¿No tienes una cuenta aún? Regístrate
            </Text>
          </TouchableOpacity>

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

            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

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
    backgroundColor: "#fff", // Cambiado de rgba(0, 0, 0, 0.5)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
  },
  keyboardView: {
    flex: 1, // Removido maxWidth y constrains de ancho
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20, // Cambiado de 30
    paddingTop: 20,
    paddingBottom: 30,
    // ELIMINADO: borderRadius: 20,
    // ELIMINADO: shadowColor: "#000",
    // ELIMINADO: shadowOffset, shadowOpacity, shadowRadius, elevation
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    // ELIMINADO: position: "absolute", top: -10, right: -15, zIndex: 1001
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20, // Aumentado de 10
  },
  logo: {
    width: 130,
    height: 50,
    maxWidth: 130,
  },
  separator: {
    height: 2,
    backgroundColor: "#b4ceec",
    marginHorizontal: 0, // Cambiado de -30
    marginVertical: 20, // Aumentado de 10
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
    fontSize: 14, // Aumentado de 12
    color: "#ff9900",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  form: {
    alignItems: "stretch",
    marginBottom: 40, // Reducido de 60
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
    fontSize: 14, // Aumentado de 12
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
    overflow: "hidden",
    // ELIMINADO: borderBottomLeftRadius y borderBottomRightRadius
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