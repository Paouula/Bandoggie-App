import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const BandoggieSplashScreen = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [boneRotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const initApp = async () => {
      try {
        // Pequeña pausa para mostrar el splash
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Ocultar el splash nativo
        await SplashScreen.hideAsync();
        
        // Iniciar animaciones
        startAnimations();
      } catch (error) {
        console.warn('Error al ocultar splash screen:', error);
        // Si hay error, continúa igual
        startAnimations();
      }
    };

    initApp();
  }, []);

  const startAnimations = () => {
    // Animación de entrada suave
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua del hueso 
    Animated.loop(
      Animated.timing(boneRotateAnim, {
        toValue: 1,
        duration: 2000, 
        useNativeDriver: true,
      })
    ).start();

    // Finalizar splash después de 2.8 segundos 
    setTimeout(() => {
      finishSplash();
    }, 2800);
  };

  const finishSplash = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100, 
      useNativeDriver: true,
    }).start(() => {

      onFinish && onFinish();
    });
  };

  const boneRotate = boneRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#365a7d" />

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Logo BANDOGGIE */}
        <View style={styles.logoContainer}>

          <Image 
            source={require('../../assets/SplashScreen/bandoggie-logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Espacio entre logo y hueso */}
        <View style={styles.spacer} />

        {/* Hueso giratorio (indicador de carga) */}
        <Animated.View 
          style={[
            styles.boneContainer,
            { transform: [{ rotate: boneRotate }] }
          ]}
        >
          <Image 
            source={require('../../assets/SplashScreen/bone-icon.png')} 
            style={styles.boneImage}
            resizeMode="contain"
          />

        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#365a7d', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 370,
    height: 320,
  },
  placeholderText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    opacity: 0.7,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  // Espacio entre logo y hueso
  spacer: {
    height: 80, 
  },
  boneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boneImage: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
});

export default BandoggieSplashScreen;