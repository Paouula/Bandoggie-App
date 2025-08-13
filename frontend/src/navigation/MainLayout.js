import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './TabNavigation';
import SettingsScreen from '../screens/Public/SettingsScreen';
import HelpScreen from '../screens/Public/HelpScreen';
import AboutScreen from '../screens/Public/AboutScreen';

const Stack = createNativeStackNavigator();

export default function MainLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Cambiamos "Tabs" por "BottomTabs" para evitar el warning */}
      <Stack.Screen name="BottomTabs" component={MyTabs} />
      <Stack.Screen name="Configuración" component={SettingsScreen} />
      <Stack.Screen name="Ayuda" component={HelpScreen} />
      <Stack.Screen name="AcercaDe" component={AboutScreen} />
    </Stack.Navigator>
  );
}
