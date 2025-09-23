import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
              onPress={() => navigation.goBack()}
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

          <Text style={styles.title}>¿Qué tipo de cuenta deseas crear?</Text>

          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>

          {/* Opciones de cuenta */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.card} onPress={handleUserRegister}>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={40} color="#365a7d" />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Usuario Normal</Text>
                  <Text style={styles.cardDescription}>
                    Compra productos personalizados a tu gusto
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#b4ceec" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={handleVetRegister}>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="medical" size={40} color="#365a7d" />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Veterinaria</Text>
                  <Text style={styles.cardDescription}>
                    Compra productos al por mayor para tu negocio
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#b4ceec" />
              </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
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
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    marginBottom: 40,
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
    borderWidth: 1,
    borderColor: "#b4ceec",
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
    borderWidth: 2,
    borderColor: "#b4ceec",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#365a7d",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
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

export default ChooseAccountScreen;