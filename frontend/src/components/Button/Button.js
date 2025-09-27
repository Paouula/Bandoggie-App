import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const ButtonComponent = ({
  title,
  children,
  style = {},
  textStyle = {},
  onPress,
  loading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        style,
        disabled && styles.disabledButton,
      ]}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>
          {children || title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#365A7D',
    padding: width < 600 ? 10 : 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  text: {
    color: 'white',
    fontSize: width < 600 ? 16 : 18,
    fontFamily: 'Raleway', 
  },
});

export default ButtonComponent;