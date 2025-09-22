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
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/ButtonComponent";
import PasswordInput from "../components/PasswordInput";
import DatePickerInput from "../components/DatePickerInput";
import ImageLoader from "../components/ImageLoader";
import useFetchRegister from "../hooks/Register/useFetchRegister";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRegister } = useFetchRegister();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.popToTop()}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/LogoBandoggie.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.separator} />

          <Text style={styles.title}>REGISTRO</Text>

          {/* Link de login */}
          <TouchableOpacity onPress={handleLogin}>
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
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo electrónico inválido",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputComponent
                  placeholder="Correo Electrónico"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
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
                  value: 8,
                  message: "Debe tener al menos 8 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "Debe tener un máximo de 30 caracteres",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  placeholder="Ingresa tu contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            {/* Link olvidé contraseña */}
            <TouchableOpacity onPress={() => navigation.navigate("RequestCode")}>
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Botón de registro */}
            <ButtonComponent
              title={isSubmitting ? "Enviando..." : "Siguiente"}
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
  },
  closeButton: {
    padding: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  logo: {
    width: 100,
    height: 60,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  loginLink: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
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
    marginBottom: 5,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "right",
    marginTop: 15,
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  submitButton: {
    marginTop: 20,
  },
});

export default RegisterScreen;