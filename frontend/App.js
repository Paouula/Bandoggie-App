import React, { useEffect, useState, useCallback } from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts as useBalooFonts, BalooBhaijaan2_400Regular, BalooBhaijaan2_700Bold } from '@expo-google-fonts/baloo-bhaijaan-2';
import * as Font from 'expo-font';

import DrawerNavigation from './src/navigation/DrawerNavigation';
import BandoggieSplashScreen from './src/components/SplashScreen';

// Evita que se oculte automáticamente el Splash de Expo
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [inriaLoaded, setInriaLoaded] = useState(false);

  // Cargar fuentes desde Google Fonts
  const [balooLoaded] = useBalooFonts({
    BalooBhaijaan2_400Regular,
    BalooBhaijaan2_700Bold,
  });

  // Cargar fuentes locales (Inria Sans)
  useEffect(() => {
    async function loadLocalFonts() {
      await Font.loadAsync({
        'InriaSans-Regular': require('./assets/fonts/InriaSans/InriaSans-Regular.ttf'),
        'InriaSans-Bold': require('./assets/fonts/InriaSans/InriaSans-Bold.ttf'),
      });
      setInriaLoaded(true);
    }

    loadLocalFonts();
  }, []);

  useEffect(() => {
    async function prepareApp() {
      // Simulación de carga extra (puedes quitar el timeout si no lo necesitas)
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    prepareApp();
  }, []);

  const handleSplashFinish = () => {
    setTimeout(() => setShowSplash(false), 100);
  };

  // Ocultar Splash de Expo cuando todo esté listo
  const onLayoutRootView = useCallback(async () => {
    if (balooLoaded && inriaLoaded && !showSplash) {
      await SplashScreen.hideAsync();
    }
  }, [balooLoaded, inriaLoaded, showSplash]);

  if (!balooLoaded || !inriaLoaded) {
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
