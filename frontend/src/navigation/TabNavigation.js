import React from 'react';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Image, View } from 'react-native';
//import de screens
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return ( 
    <Tab.Navigator
    // configuración del navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#365A7D', //color de fondo 
          height: 70,
          paddingBottom: -20,
          paddingTop: 10,
          borderTopWidth: 0,
          borderTopLeftRadius: 23, //redondeo del fondo del navigator (izquierdo)
          borderTopRightRadius: 23, //redondeo del fondo del navigator (derecho)
          elevation: 8, 
          shadowOffset: { width: 0, height: -2 }, 
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#ffffff', 
        tabBarInactiveTintColor: '#ffffff', 
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
      //configuración del componente de perfil
        name="Perfil" 
        component={ProfileScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 25,
              padding: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                source={
                  focused 
                    ? require('../../assets/TabNavigation/profile-active.png') 
                    : require('../../assets/TabNavigation/profile-inactive.png') 
                }
                style={{
                  width: 43,
                  height: 60,
                 
                }}
                resizeMode="contain"
                
              />
            </View>
          ),
        }}
      />
      <Tab.Screen 
      // configuracion del componente de incio
        name="Inicio" 
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 25,
              padding: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                source={
                  focused 
                    ? require('../../assets/TabNavigation/home-active.png') 
                    : require('../../assets/TabNavigation/home-inactive.png') 
                }
                style={{
                  width: 31,
                  height: 50,
                 
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen 
      // configuracion del componente de carrito
        name="Carrito" 
        component={CartScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 25,
              padding: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                source={
                  focused 
                    ? require('../../assets/TabNavigation/cart-active.png') 
                    : require('../../assets/TabNavigation/cart-inactive.png') 
                }
                style={{
                  width: 31,
                  height: 47,
                  
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}