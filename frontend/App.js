import React, { useEffect, useState, useCallback } from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, BalooBhaijaan2_400Regular, BalooBhaijaan2_700Bold } from '@expo-google-fonts/baloo-bhaijaan-2';

import DrawerNavigation from './src/navigation/DrawerNavigation';
import BandoggieSplashScreen from './src/components/SplashScreen';

import LoginScreen from './src/screens/Login/Login';
import ChooseScreen from './src/screens/Register/Choose';
import RegisterScreen from './src/screens/Register/Register';
import RegisterVetScreen from './src/screens/Register/RegisterVet';
import VerificationCodeScreen from './src/screens/Register/VerificationCode';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar el AuthProvider
import { AuthProvider, useAuth } from './src/context/AuthContext';

SplashScreen.preventAutoHideAsync();

const AuthStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Choose" component={ChooseScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="RegisterVet" component={RegisterVetScreen} />
      <AuthStack.Screen 
        name="VerificationCode" 
        component={VerificationCodeScreen}
        options={{ 
          gestureEnabled: false,
          headerBackVisible: false 
        }}
      />
    </AuthStack.Navigator>
  );
}

// Componente interno que usa el contexto de autenticación
function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, loadingUser, pendingVerification, loadingVerification } = useAuth();

  const [fontsLoaded] = useFonts({
    BalooBhaijaan2_400Regular,
    BalooBhaijaan2_700Bold,
  });

  useEffect(() => {
    async function prepareApp() {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    prepareApp();
  }, []);

  const handleSplashFinish = () => {
    setTimeout(() => setShowSplash(false), 100);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !showSplash) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, showSplash]);

  if (!fontsLoaded || loadingUser || loadingVerification) {
    return null;
  }

  if (showSplash) {
    return <BandoggieSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {user && !pendingVerification ? (
          <DrawerNavigation />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
      <Toast />
    </View>
  );
}

// Componente principal que envuelve todo con AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}