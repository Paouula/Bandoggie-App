import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Navigation from './src/navigation/TabNavigation.js';

// Mantener el splash screen visible mientras carga la app
SplashScreen.preventAutoHideAsync();


export default function App() {
  useEffect(() => {
    // Oculta el splash screen cuando la app está lista
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}
