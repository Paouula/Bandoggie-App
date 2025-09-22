import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const PasswordInput = ({
  value,
  onChangeText,
  error,
  style = {},
  ...props
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (text) => {
    const limited = text.slice(0, 30); // Limita a 30 caracteres
    onChangeText?.(limited);
  };

  return (
    <View style={[styles.inputGroup, style]}>
      <View style={styles.inputPassGroup}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          secureTextEntry={!show}
          style={[styles.input, error && styles.inputError]}
          placeholder="Contraseña"
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeToggleBtn}
          onPress={() => setShow((prev) => !prev)}
          accessibilityLabel={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <Icon
            name={show ? 'eye-off' : 'eye'}
            size={22}
            color="#365A7D"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.formError}>{error}</Text>}
    </View>
  );
};

//Estilos del input para input de contraseña
const styles = StyleSheet.create({
  inputGroup: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  inputPassGroup: {
    position: 'relative',
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: '#b4ceec',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'Raleway',
    color: '#365A7D',
    backgroundColor: '#fafdff',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  eyeToggleBtn: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'transparent',
    borderRadius: 60,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: 22,
    height: 22,
  },
  formError: {
    marginTop: 4,
    fontSize: 12,
    color: '#ff4d4d',
    fontFamily: 'Raleway',
  },
});

export default PasswordInput;
