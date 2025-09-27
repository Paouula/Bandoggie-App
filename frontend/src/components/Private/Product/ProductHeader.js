import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = () => (
  <View style={styles.titleSection}>
    <LinearGradient
      colors={['#DFEFF6', '#E8E9F9', '#F6EDFE']}
      style={styles.titleGradientBackground}
    >
      <Text style={styles.title}>Productos</Text>
      <View style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <Image
            source={require('../../../../assets/Products/ProductsHeader.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  titleSection: {
    paddingHorizontal: -30,
    marginBottom: 20,
  },
  titleGradientBackground: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 35,
    fontFamily: 'BalooBhaijaan2_700Bold',
    color: '#000',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 160,
    height: 160,
    marginTop: 15,
    marginBottom: -100,
    borderRadius: 80,
    backgroundColor: '#FDF7DF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
});

export default Header;
