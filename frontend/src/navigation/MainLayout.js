import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './TabNavigation';
import BandanasScreen from '../screens/Public/BandanasScreen';
import CollarsScreen from '../screens/Public/CollarsScreen';
import AccesoriesScreen from '../screens/Public/AccesoriesScreen';
import FestivitiesScreen from '../screens/Public/FestivitiesScreen';
//import EmpleadosScreen from '../screens/Private/Employees/Employee'

const Stack = createNativeStackNavigator();

export default function MainLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={MyTabs} />
      <Stack.Screen name="Bandanas" component={BandanasScreen} />
      <Stack.Screen name="Collares" component={CollarsScreen} />
      <Stack.Screen name="Accesorios" component={AccesoriesScreen} />
      <Stack.Screen name="Festividades" component={FestivitiesScreen} />
    </Stack.Navigator>
  );
}
