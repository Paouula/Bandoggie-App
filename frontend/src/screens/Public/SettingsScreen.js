// screens/Drawer/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Notificaciones</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Privacidad</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Idioma</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Tema</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// screens/Drawer/HelpScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ayuda</Text>
      <Text style={styles.content}>
        Aquí encontrarás información de ayuda y soporte para usar la aplicación.
      </Text>
      
      <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
      <Text style={styles.question}>¿Cómo puedo hacer un pedido?</Text>
      <Text style={styles.answer}>
        Para hacer un pedido, navega a la sección de productos y agrega los items a tu carrito.
      </Text>
      
      <Text style={styles.question}>¿Cómo contacto al soporte?</Text>
      <Text style={styles.answer}>
        Puedes contactarnos a través del email support@miapp.com
      </Text>
    </ScrollView>
  );
}

// screens/Drawer/AboutScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/bandoggie-logo.png')} // Cambia por tu logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Acerca de Mi App</Text>
        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>
      
      <Text style={styles.description}>
        Esta aplicación fue desarrollada para ofrecer la mejor experiencia de compra 
        y gestión de productos. Nuestro objetivo es proporcionar una interfaz intuitiva 
        y funcional para todos nuestros usuarios.
      </Text>
      
      <Text style={styles.sectionTitle}>Desarrollado por</Text>
      <Text style={styles.content}>Tu Empresa / Nombre</Text>
      
      <Text style={styles.sectionTitle}>Contacto</Text>
      <Text style={styles.content}>info@miapp.com</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#365A7D',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
  },
  option: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#365A7D',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#365A7D',
    marginTop: 20,
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
});