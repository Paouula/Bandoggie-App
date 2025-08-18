import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './TabNavigation';
import BandanasScreen from '../screens/Public/BandanasScreen';
import CollarsScreen from '../screens/Public/CollarsScreen';
import AccesoriesScreen from '../screens/Public/AccesoriesScreen';
//import ChristmasScreen from '../screens/Public/ChristmasScreen';
//import HalloweenScreen from '../screens/Public/HalloweenScreen';
//import ValentineScreen from '../screens/Public/ValentineScreen';
//import PatriosDayScreen from '../screens/Public/PatriosDayScreen';    
//import NewYearScreen from '../screens/Public/NewYearScreen';


const Stack = createNativeStackNavigator();

export default function MainLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={MyTabs} />
      <Stack.Screen name="Collars" component={CollarsScreen} />
      <Stack.Screen name="Bandanas" component={BandanasScreen} />
      <Stack.Screen name="Accessories" component={AccesoriesScreen} />
    </Stack.Navigator>
  );
}
