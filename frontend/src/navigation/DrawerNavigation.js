import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MainLayout from './MainLayout';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#365A7D' },
        headerTintColor: '#fff',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Main"
        component={MainLayout}
        options={{ title: 'Bandoggie' }}
      />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const navigateTo = (screen) => {
    navigation.navigate('Main', {
      screen: screen === 'Inicio' ? 'BottomTabs' : screen,
    });
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/SplashScreen/bandoggie-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.drawerContent}>
        <DrawerItem label="Inicio" onPress={() => navigateTo('Inicio')} />
        <DrawerItem label="Bandanas" onPress={() => navigateTo('Bandanas')} />
        <DrawerItem label="Collares" onPress={() => navigateTo('Collares')} />
        <DrawerItem label="Accesorios" onPress={() => navigateTo('Accesorios')} />
        <DrawerItem label="Festividades" onPress={() => navigateTo('FestivitiesScreen')} />
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
    backgroundColor: '#365A7D',
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
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});