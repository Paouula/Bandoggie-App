import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ChooseAccountScreen = () => {
  const navigation = useNavigation();

  const handleUserRegister = () => {
    navigation.navigate("Register");
  };

  const handleVetRegister = () => {
    navigation.navigate("RegisterVet");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header de la pantalla junto con botón de cerrar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
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

      <Text style={styles.title}>¿Qué tipo de cuenta deseas crear?</Text>

      {/* Opciones de cuenta */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.card} onPress={handleUserRegister}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={40} color="#007AFF" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Usuario Normal</Text>
              <Text style={styles.cardDescription}>
                Compra productos personalizados a tu gusto
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleVetRegister}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="medical" size={40} color="#34C759" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Veterinaria</Text>
              <Text style={styles.cardDescription}>
                Compra productos al por mayor para tu negocio
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginLink}>
            ¿Ya tienes una cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
  },
  closeButton: {
    padding: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  footer: {
    paddingBottom: 30,
    alignItems: "center",
  },
  loginLink: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});

export default ChooseAccountScreen;