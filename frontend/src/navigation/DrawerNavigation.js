import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MainLayout from './MainLayout.js';
import { useAuth } from '../context/AuthContext.jsx';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffffff' },
        headerTintColor: '#000000ff',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Main"
        component={MainLayout}
        options={{
          title: 'Bandoggie',
          headerTitleStyle: {
            fontFamily: 'BalooBhaijaan2_700Bold', // 👈 fuente personalizada
            fontSize: 20,
          },
        }}
      />
    </Drawer.Navigator>
  );
}

const getDrawerItemsByRole = (userType) => {
  const publicRoutes = [
    { label: 'Inicio', screen: 'Inicio' },
    { label: 'Bandanas', screen: 'Bandanas' },
    { label: 'Collares', screen: 'Collares' },
    { label: 'Accesorios', screen: 'Accesorios' },
    { label: 'Festividades', screen: 'FestivitiesScreen' },
  ];

  const privateRoutes = {
    admin: [
      { label: 'Productos', screen: 'ProductsScreen' },
      { label: 'Empleados', screen: 'EmployeesScreen' },
      { label: 'Clientes', screen: 'ClientsScreen' },
    ],
    employee: [
      { label: 'Productos', screen: 'ProductsScreen' },
      { label: 'Empleados', screen: 'EmployeesScreen' },
      { label: 'Clientes', screen: 'ClientsScreen' },
    ],
    client: [],
    vet: [],
  };

  return [...publicRoutes, ...(privateRoutes[userType] || [])];
};

function CustomDrawerContent({ navigation }) {
  const { user } = useAuth;

  const drawerItems = getDrawerItemsByRole(user?.userType);

  const navigateTo = (screen) => {
    navigation.navigate('Main', {
      screen: screen === 'Inicio' ? 'BottomTabs' : screen,
    });
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/TabNavigation/navigation-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.drawerContent}>
        {drawerItems.map(({ label, screen }) => (
          <DrawerItem key={label} label={label} onPress={() => navigateTo(screen)} />
        ))}
      </View>
    </View>
  );
}

function DrawerItem({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Text style={styles.drawerLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  drawerHeader: {
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: -10,
  },
  appName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
   drawerLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'BalooBhaijaan2_700Bold',
  },
});
