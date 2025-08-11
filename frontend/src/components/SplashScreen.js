import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

// Prevenir que el splash nativo se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const CustomSplashScreen = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [logoRotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const initApp = async () => {
      try {
        // Simula la carga de recursos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Ocultar el splash nativo
        await SplashScreen.hideAsync();
        
        // Iniciar animaciones
        startAnimations();
      } catch (error) {
        console.warn(error);
      }
    };

    initApp();
  }, []);

  const startAnimations = () => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Finalizar splash después de 3 segundos
    setTimeout(() => {
      finishSplash();
    }, 3000);
  };

  const finishSplash = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish && onFinish();
    });
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Círculos decorativos */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />

      {/* Contenido principal */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Logo animado */}
        <Animated.View 
          style={[
            styles.logoContainer,
            { transform: [{ rotate: logoRotate }] }
          ]}
        >
          <Text style={styles.logo}>🚀</Text>
        </Animated.View>

        {/* Título */}
        <Text style={styles.title}>Mi App</Text>
        <Text style={styles.subtitle}>Bienvenido a tu aplicación</Text>

        {/* Indicador de carga */}
        <ActivityIndicator 
          size="large" 
          color="white"
          style={styles.loader}
        />
        
        <Text style={styles.loadingText}>Cargando...</Text>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Hecho con ❤️ en React Native</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: -width * 0.1,
    left: -width * 0.1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circle: {
    position: 'absolute',
    borderRadius: width * 0.4,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '300',
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});

export default CustomSplashScreen;