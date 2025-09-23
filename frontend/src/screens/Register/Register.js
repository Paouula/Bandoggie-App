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
import * as ImagePicker from "expo-image-picker";

// Importar componentes personalizados
import InputComponent from "../../components/Input/Input.js";
import ButtonComponent from "../../components/Button/Button.js";
import PasswordInput from "../../components/InputPassword/InputPassword.js";
import DatePickerInput from "../../components/InputDataPicker/InputDataPicker.js";
import ImageLoader from "../../components/ImageLoader/ImageLoader.js";
import useFetchRegister from "../../hooks/Register/useFetchRegister";
import { useAuth } from "../../context/AuthContext";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRegister } = useFetchRegister();
  const { updateVerificationInfo, setPendingVerification } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const phoneValue = watch("phone", "");

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handlePhoneChange = (value) => {
    let formattedValue = value.replace(/\D/g, "");
    if (formattedValue.length > 4) {
      formattedValue = formattedValue.slice(0, 4) + "-" + formattedValue.slice(4, 8);
    }
    if (formattedValue.length > 9) {
      formattedValue = formattedValue.slice(0, 9);
    }
    setValue("phone", formattedValue);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    if (!profileImage) {
      Alert.alert("Error", "Por favor, sube una imagen de perfil.");
      return;
    }

    setIsSubmitting(true);
    Alert.alert("Enviando", "La información se ha enviado. Por favor, espera...");

    try {
      const response = await handleRegister(
        data.name,
        data.email,
        data.phone,
        data.birthday,
        data.password,
        profileImage
      );
      
      if (response) {
        // Actualizar información de verificación en el contexto
        await updateVerificationInfo({
          email: data.email,
          role: "client"
        });
        setPendingVerification(true);
        
        reset();
        setProfileImage(null);
        
        // Navegar a verificación de código
        navigation.navigate("VerificationCode", {
          email: data.email,
          role: "client"
        });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Registro fallido. Verifica tus datos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleLogin}>
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

          <Text style={styles.title}>Registro</Text>

          {/* Link de login */}
          <TouchableOpacity onPress={handleLogin} disabled={isSubmitting}>
            <Text style={styles.loginLink}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>

          {/* Imagen de perfil */}
          <View style={styles.profileImageContainer}>
            <ImageLoader
              onImageChange={setProfileImage}
              currentImage={profileImage}
            />
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Nombre */}
            <Text style={styles.label}>Nombre</Text>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "El nombre es obligatorio",
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: "Solo se permiten letras y espacios",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputComponent
                  placeholder="Nombre"
                  value={value}
                  onChangeText={(text) => {
                    const onlyLetters = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                    onChange(onlyLetters);
                  }}
                  onBlur={onBlur}
                  leftIcon="person-outline"
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}

            {/* Email */}
            <Text style={[styles.label, styles.labelSpacing]}>
              Correo Electrónico
            </Text>
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
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            {/* Fecha de nacimiento y teléfono */}
            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Text style={[styles.label, styles.labelSpacing]}>
                  Fecha de nacimiento
                </Text>
                <Controller
                  control={control}
                  name="birthday"
                  rules={{
                    required: "La fecha de nacimiento es obligatoria",
                    validate: (value) => {
                      if (!value) return "La fecha de nacimiento es obligatoria";
                      const age = calculateAge(value);
                      return age >= 18 ? true : "Debes ser mayor de edad";
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <DatePickerInput
                      value={value}
                      onChange={onChange}
                      placeholder="Seleccionar fecha"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.birthday && (
                  <Text style={styles.errorText}>{errors.birthday.message}</Text>
                )}
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.label, styles.labelSpacing]}>
                  Teléfono
                </Text>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^\d{4}-\d{4}$/,
                      message: "Formato: 1111-1111",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputComponent
                      placeholder="1111-1111"
                      value={phoneValue}
                      onChangeText={handlePhoneChange}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      maxLength={9}
                      leftIcon="call-outline"
                      editable={!isSubmitting}
                    />
                  )}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}
              </View>
            </View>

            {/* Contraseña */}
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
                  editable={!isSubmitting}
                  autoComplete="password"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            {/* Link olvidé contraseña */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("RequestCode")}
              disabled={isSubmitting}
            >
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Botón de registro */}
            <ButtonComponent
              title="Siguiente"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting || !isValid}
              style={[
                styles.submitButton,
                (!isValid || isSubmitting) && styles.disabledButton,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  closeButton: {
    padding: 10,
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
  loginLink: {
    fontSize: 14,
    color: "#ff9900",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  form: {
    alignItems: "stretch",
    marginBottom: 40,
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "left",
  },
  forgotPassword: {
    fontSize: 14,
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

export default RegisterScreen;