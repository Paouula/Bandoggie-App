import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './TabNavigation';
import BandanasScreen from '../screens/Public/BandanasScreen.js';
import CollarsScreen from '../screens/Public/CollarsScreen';
import ProductsScreen from '../screens/Private/Products/Products.js';
import EmployeesScreen from '../screens/Private/Employees/Employee.js';
import AccesoriesScreen from '../screens/Public/AccesoriesScreen';
import FestivitiesScreen from '../screens/Public/FestivitiesScreen';
import ClientsScreen from '../screens/Private/Clients/Clients.js';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function MainLayout() {
  const { user, isEmployee, isClient, isVet } = useAuth();

  // Define la pantalla inicial según el tipo de usuario
  const getInitialRoute = () => {
    if (!user) return 'BottomTabs';

    // Usuarios privados (admin/employee) van a Productos
    if (isEmployee()) {
      return 'ProductsScreen';
    }

    // Usuarios públicos (client/vet) van al inicio
    if (isClient() || isVet()) {
      return 'BottomTabs';
    }

    return 'BottomTabs';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false }}
    >
      {/* Rutas públicas - disponibles para todos */}
      {(isClient() || isVet() ) && (
        <>
          <Stack.Screen name="BottomTabs" component={MyTabs} />
          <Stack.Screen name="Bandanas" component={BandanasScreen} />
          <Stack.Screen name="Collares" component={CollarsScreen} />
          <Stack.Screen name="Accesorios" component={AccesoriesScreen} />
          <Stack.Screen name="FestivitiesScreen" component={FestivitiesScreen} />
        </>
      )}

      {/* Rutas privadas - solo para admin/employee */}
      {(isEmployee()) && (
        <>
          <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
          <Stack.Screen name="EmployeesScreen" component={EmployeesScreen} />
          <Stack.Screen name="ClientsScreen" component={ClientsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}