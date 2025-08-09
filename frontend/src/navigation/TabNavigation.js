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
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#365A7D', 
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
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
        name="Perfil" 
        component={ProfileScreen}
        options={{
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
                    ? require('../../assets/TabNavigation/profile-active.png') 
                    : require('../../assets/TabNavigation/profile-inactive.png') 
                }
                style={{
                  width: 35,
                  height: 35,
                 
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
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
                  width: 32,
                  height: 32,
                 
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CartScreen}
        options={{
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
                  width: 32,
                  height: 32,
                  
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