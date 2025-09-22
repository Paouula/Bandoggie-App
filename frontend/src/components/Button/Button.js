import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

//Componente global para el boton y sus usos en toda la app
const ButtonComponent = ({ type = "button", children, style = {}, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]} 
      activeOpacity={0.8} // Efecto visual al presionar
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

//Estilos del boton
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#365A7D',
    padding: width < 600 ? 10 : 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: width < 600 ? 16 : 18,
    fontFamily: 'Raleway', 
  },
});

export default ButtonComponent;
