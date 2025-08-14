import React from 'react';
import 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';

const FestivitiesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pantalla de Festividades
              </Text>
      <Text style={styles.descripcion}>
        Página para comprobar funcionalidad, cambienla según sea necesario a las que están en figma.
      </Text>
    </View>
  );
};

export default FestivitiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 30,
  },
});
