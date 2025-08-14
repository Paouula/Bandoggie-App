import React, { useEffect, useState, useCallback } from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, BalooBhaijaan2_400Regular, BalooBhaijaan2_700Bold } from '@expo-google-fonts/baloo-bhaijaan-2';

import DrawerNavigation from './src/navigation/DrawerNavigation';
import BandoggieSplashScreen from './src/components/SplashScreen';

// Evita que se oculte automáticamente el Splash de Expo
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Cargar fuentes
  const [fontsLoaded] = useFonts({
    BalooBhaijaan2_400Regular,
    BalooBhaijaan2_700Bold,
  });

  useEffect(() => {
    async function prepareApp() {
      // Simulación de carga (puedes quitar el timeout si no lo necesitas)
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    prepareApp();
  }, []);

  const handleSplashFinish = () => {
    setTimeout(() => setShowSplash(false), 100);
  };

  // Ocultar Splash de Expo cuando todo esté listo
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !showSplash) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, showSplash]);

  if (!fontsLoaded) {
    // No mostramos nada hasta que las fuentes estén cargadas
    return null;
  }

  if (showSplash) {
    return <BandoggieSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <DrawerNavigation />
      </NavigationContainer>
    </View>
  );
}
