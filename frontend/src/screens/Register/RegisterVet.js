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

// Importar componentes personalizados
import InputComponent from "../../components/Input/Input.js";
import ButtonComponent from "../../components/Button/Button.js";
import PasswordInput from "../../components/InputPassword/InputPassword.js";
import ImageLoader from "../../components/ImageLoader/ImageLoader.js";
import useFetchRegisterVet from "../../hooks/Register/useFetchRegisterVet";
import { useAuth } from "../../context/AuthContext";

const RegisterVetScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRegister } = useFetchRegisterVet();
  const { updateVerificationInfo, setPendingVerification } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleNitChange = (value) => {
    // Formato NIT: 0614-290523-102-1
    let formattedValue = value.replace(/\D/g, "");
    
    if (formattedValue.length > 4) {
      formattedValue = formattedValue.slice(0, 4) + "-" + formattedValue.slice(4);
    }
    if (formattedValue.length > 11) {
      formattedValue = formattedValue.slice(0, 11) + "-" + formattedValue.slice(11);
    }
    if (formattedValue.length > 15) {
      formattedValue = formattedValue.slice(0, 15) + "-" + formattedValue.slice(15, 16);
    }
    if (formattedValue.length > 17) {
      formattedValue = formattedValue.slice(0, 17);
    }
    
    setValue("nitVet", formattedValue);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    if (!profileImage) {
      Alert.alert("Error", "Por favor, sube una imagen de perfil.");
      return;
    }

    setIsSubmitting(true);
    Alert.alert("Enviando", "Enviando información...");

    try {
      const response = await handleRegister(
        data.nameVet,
        data.email,
        data.password,
        data.locationVet,
        data.nitVet,
        profileImage
      );

      if (response) {
        // Actualizar información de verificación en el contexto
        await updateVerificationInfo({
          email: data.email,
          role: "vet"
        });
        setPendingVerification(true);
        
        reset();
        setProfileImage(null);
        
        // Navegar a verificación de código
        navigation.navigate("VerificationCode", {
          email: data.email,
          role: "vet"
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Registro fallido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate("Login")}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

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

          <Text style={styles.title}>REGISTRO DE VETERINARIA</Text>

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
            {/* Nombre de la veterinaria */}
            <Text style={styles.label}>Nombre de la veterinaria</Text>
            <Controller
              control={control}
              name="nameVet"
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
                  leftIcon="storefront-outline"
                />
              )}
            />
            {errors.nameVet && (
              <Text style={styles.errorText}>{errors.nameVet.message}</Text>
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

            {/* Ubicación */}
            <Text style={[styles.label, styles.labelSpacing]}>Ubicación</Text>
            <Controller
              control={control}
              name="locationVet"
              rules={{
                required: "La ubicación es obligatoria",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputComponent
                  placeholder="Ubicación de la veterinaria"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  leftIcon="location-outline"
                />
              )}
            />
            {errors.locationVet && (
              <Text style={styles.errorText}>{errors.locationVet.message}</Text>
            )}

            {/* NIT */}
            <Text style={[styles.label, styles.labelSpacing]}>NIT</Text>
            <Controller
              control={control}
              name="nitVet"
              rules={{
                required: "El NIT es obligatorio",
                pattern: {
                  value: /^\d{4}-\d{6}-\d{3}-\d{1}$/,
                  message: "El formato debe ser 0111-110111-101-1",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputComponent
                  placeholder="0614-290523-102-1"
                  value={value}
                  onChangeText={handleNitChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  maxLength={17}
                  leftIcon="document-text-outline"
                />
              )}
            />
            {errors.nitVet && (
              <Text style={styles.errorText}>{errors.nitVet.message}</Text>
            )}

            {/* Link olvidé contraseña */}
            <TouchableOpacity onPress={() => Alert.alert("Función no disponible", "Esta función estará disponible próximamente.")}>
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Botón de registro */}
            <ButtonComponent
              title={isSubmitting ? "Enviando..." : "Registrarse"}
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
    marginHorizontal: 0, // Changed from 20
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
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
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
});


export default RegisterVetScreen;