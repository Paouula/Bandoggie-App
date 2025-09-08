import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = ({ title }) => {
  return (
    <View style={styles.titleSection}>
      <LinearGradient
        colors={['#F9E8F4', '#FFD8DC']}
        style={styles.titleGradientBackground}
      >
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

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
});

export default Header;