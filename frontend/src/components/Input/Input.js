import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const InputComponent = ({
  type = 'default',
  placeholder,
  error,
  style = {},
  ...props
}) => {
  return (
    <View style={styles.inputGroup}>
      <TextInput
        placeholder={placeholder}
        style={[
          styles.customInput,
          error && styles.inputError,
          style,
        ]}
        keyboardType={type}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    width: '100%',
  },
  customInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#b4ceec',
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fafdff',
    color: '#365A7D',
  },
  inputError: {
    borderColor: 'red',
  },
  inputLogin: {
    paddingRight: 45,
  },
});

export default InputComponent;
