import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './TabNavigation';
import BandanasScreen from '../screens/Public/BandanasScreen.js';
import CollarsScreen from '../screens/Public/CollarsScreen';
import ProductsScreen from '../screens/Private/Products/Products.js';
import EmployeesScreen from '../screens/Private/Employees/Employee.js';
import AccesoriesScreen from '../screens/Public/AccesoriesScreen';
import FestivitiesScreen from '../screens/Public/FestivitiesScreen';
import LoginScreen from '../screens/Login/Login.js';
import ChooseScreen from '../screens/Register/Choose';
import RegisterScreen from '../screens/Register/Register';
import RegisterVetScreen from '../screens/Register/RegisterVet';
import VerificationCodeScreen from '../screens/Register/VerificationCode.js';
import ClientsScreen from '../screens/Private/Clients/Clients.js';
import { useAuth } from '../context/AuthContext';
 
 
const Stack = createNativeStackNavigator();
 
export default function MainLayout() {
  const { user } = useAuth()

  const getInitialRouter = () => {
    if (!user) return 'Login';
 
    switch (user.userType) {
      case 'admin':
      case 'employee':
        return 'ProductsScreen';
      case 'client':
      case 'vet':
        return 'BottomTabs';
      default:
        return 'Login';
    }
  }
 
  return (
    <Stack.Navigator
    initialRouteName={getInitialRouter()}
    screenOptions={{ headerShown: false }}
  >
    {/* Pantallas de autenticación */}
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ChooseAccount" component={ChooseScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="RegisterVet" component={RegisterVetScreen} />
    <Stack.Screen
      name="VerificationCode"
      component={VerificationCodeScreen}
      options={{ gestureEnabled: false, headerBackVisible: false }}
    />

    {/* Rutas públicas */}
    <Stack.Screen name="BottomTabs" component={MyTabs} />
    <Stack.Screen name="Bandanas" component={BandanasScreen} />
    <Stack.Screen name="Collares" component={CollarsScreen} />
    <Stack.Screen name="Accesorios" component={AccesoriesScreen} />
    <Stack.Screen name="FestivitiesScreen" component={FestivitiesScreen} />

    {/* Rutas privadas */}
    <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
    <Stack.Screen name="EmployeesScreen" component={EmployeesScreen} />
    <Stack.Screen name="ClientsScreen" component={ClientsScreen} />
  </Stack.Navigator>
  );
}