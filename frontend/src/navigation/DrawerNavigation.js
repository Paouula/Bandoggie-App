import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, Text, StyleSheet } from 'react-native';
import MyTabs from './TabNavigation'; // Tu navegación de tabs existente

// Importa las screens adicionales para el drawer
import HomeScreen from '../screens/Public/HomeScreen';
import CartScreen from '../screens/Public/CartScreen';
import ProfileScreen from '../screens/Public/ProfileScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Componente personalizado para el contenido del drawer
function CustomDrawerContent({ navigation }) {
  return (
    <View style={styles.drawerContainer}>
      {/* Header del drawer */}
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/logo.png')} // Cambia por tu logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Mi App</Text>
      </View>
      
      {/* Contenido del drawer */}
      <View style={styles.drawerContent}>
        {/* Aquí puedes agregar elementos personalizados del drawer */}
      </View>
    </View>
  );
}

// Stack Navigator que contiene el Drawer y las pantallas sin tabs
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Screen con tabs */}
      <Stack.Screen name="DrawerTabs" component={DrawerWithTabs} />
      {/* Screens sin tabs */}
      <Stack.Screen name="Settings" component={SettingsScreen} 
        options={{
          headerShown: true,
          headerTitle: 'Configuración',
          headerStyle: { backgroundColor: '#365A7D' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen name="Help" component={HelpScreen}
        options={{
          headerShown: true,
          headerTitle: 'Ayuda',
          headerStyle: { backgroundColor: '#365A7D' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen name="About" component={AboutScreen}
        options={{
          headerShown: true,
          headerTitle: 'Acerca de',
          headerStyle: { backgroundColor: '#365A7D' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

// Drawer que solo contiene las páginas principales con tabs
function DrawerWithTabs() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#365A7D',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 280,
        },
        drawerActiveTintColor: '#365A7D',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      {/* Screen principal que contiene los tabs */}
      <Drawer.Screen 
        name="Principal" 
        component={MyTabs}
        options={{
          headerTitle: 'Mi App',
          drawerIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/DrawerIcons/home-icon.png')}
              style={[styles.drawerIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      
      {/* Screens adicionales del drawer que navegarán sin tabs */}
      <Drawer.Screen 
        name="ConfiguracionNav" 
        component={() => null} // Componente vacío
        options={{
          headerTitle: 'Configuración',
          drawerLabel: 'Configuración',
          drawerIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/DrawerIcons/settings-icon.png')}
              style={[styles.drawerIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.getParent().navigate('Settings');
          },
        })}
      />
      
      <Drawer.Screen 
        name="AyudaNav" 
        component={() => null}
        options={{
          headerTitle: 'Ayuda',
          drawerLabel: 'Ayuda',
          drawerIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/DrawerIcons/help-icon.png')}
              style={[styles.drawerIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.getParent().navigate('Help');
          },
        })}
      />
      
      <Drawer.Screen 
        name="AcercaNav" 
        component={() => null}
        options={{
          headerTitle: 'Acerca de',
          drawerLabel: 'Acerca de',
          drawerIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/DrawerIcons/about-icon.png')}
              style={[styles.drawerIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.getParent().navigate('About');
          },
        })}
      />
    </Drawer.Navigator>
  );
}

function DrawerNavigation() {
  return <MainStack />;
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  drawerHeader: {
    backgroundColor: '#365A7D',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
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
  drawerIcon: {
    width: 24,
    height: 24,
  },
});

export default DrawerNavigation;