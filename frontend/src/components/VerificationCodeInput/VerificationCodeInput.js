import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const VerificationCodeInput = ({ length = 6, onChange }) => {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleInput = (text, idx) => {
    const clean = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 1);
    const newValues = [...values];
    newValues[idx] = clean;
    setValues(newValues);
    if (onChange) onChange(newValues.join(''));

    if (clean && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, idx) => {
    if (nativeEvent.key === 'Backspace') {
      if (values[idx]) {
        const newValues = [...values];
        newValues[idx] = '';
        setValues(newValues);
        if (onChange) onChange(newValues.join(''));
      } else if (idx > 0) {
        inputs.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = async (event) => {
    const paste = await navigator.clipboard.readText(); // solo funciona en web
    const clean = paste.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, length);
    const newValues = clean.split('').concat(Array(length).fill('')).slice(0, length);
    setValues(newValues);
    if (onChange) onChange(newValues.join(''));
    const nextIdx = clean.length >= length ? length - 1 : clean.length;
    inputs.current[nextIdx]?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Código</Text>
      <View style={styles.inputs}>
        {Array.from({ length }).map((_, idx) => (
          <View style={styles.box} key={idx}>
            <TextInput
              ref={(ref) => (inputs.current[idx] = ref)}
              style={styles.input}
              value={values[idx]}
              onChangeText={(text) => handleInput(text, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              maxLength={1}
              autoFocus={idx === 0}
              keyboardType="default"
              textContentType="oneTimeCode"
              returnKeyType="next"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#789',
    marginBottom: 40,
  },
  inputs: {
    flexDirection: 'row',
    gap: 18, // solo funciona en web; en móvil usa marginRight
    justifyContent: 'center',
    marginTop: 10,
  },
  box: {
    backgroundColor: '#e3f0ff',
    borderRadius: 10,
    width: 48,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#b3c6e0',
    shadowColor: '#b3c6e0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    color: '#222',
    fontSize: 32,
    textAlign: 'center',
    borderWidth: 0,
    outlineStyle: 'none',
    padding: 0,
  },
});


export default VerificationCodeInput;
