import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Navigation from './src/navigation/TabNavigation.js';
import BandoggieSplashScreen from './src/components/SplashScreen.js';

// Mantener el splash screen nativo visible mientras carga la app
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Simular tiempo de preparación 
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (e) {
        console.warn('Error durante la preparación de la app:', e);
      }
    }

    prepareApp();
  }, []);

  const handleSplashFinish = () => {
    // Pequeña pausa antes de mostrar la app 
    setTimeout(() => {
      setShowSplash(false);
    }, 100);
  };

  // Mostrar splash screen hasta que termine la animación
  if (showSplash) {
    return <BandoggieSplashScreen onFinish={handleSplashFinish} />;
  }

  // Renderizar la app principal
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}