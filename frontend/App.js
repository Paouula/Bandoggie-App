import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import BandoggieSplashScreen from './src/components/SplashScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepareApp() {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    prepareApp();
  }, []);

  const handleSplashFinish = () => {
    setTimeout(() => setShowSplash(false), 100);
  };

  if (showSplash) {
    return <BandoggieSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <DrawerNavigation />
      </NavigationContainer>
    </View>
  );
}
