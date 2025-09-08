import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = ({
  item,
  gradientColors = ['#FFB6C1', '#FFC0CB', '#F8BBD9'],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 }
}) => {
  // Validación segura del item
  if (!item || typeof item !== 'object') {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={gradientColors}
            start={gradientStart}
            end={gradientEnd}
            style={styles.gradientBackground}
          >
            <View style={styles.headerContent}>
              <Text style={styles.title}>Cargando...</Text>
            </View>
          </LinearGradient>
        </View>
      </>
    );
  }

  // Valores seguros con fallbacks
  const nombre = item.nombre || item.name || item.title || 'Usuario';

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={styles.gradientBackground}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Historial de{'\n'}Clientes
            </Text>
          </View>
          
          {/* Logo posicionado completamente al lado derecho */}
          <Image 
            source={require('../../../../assets/Clients/iconClients.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 0,
    marginBottom: 20,
    position: 'relative',
  },
  gradientBackground: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderTopRightRadius: 120,
    borderBottomRightRadius: 120,
    marginHorizontal: 0,
    minHeight: 180,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  headerContent: {
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    lineHeight: 40,
  },
  logoImage: {
    width: 160,
    height: 160,
    position: 'absolute',
    right: 10,
    bottom: 10,
    zIndex: 10,
  },
});

export default Header;