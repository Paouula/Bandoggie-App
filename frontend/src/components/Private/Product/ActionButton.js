import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

const ActionButtons = ({ handleNuevaCategoria, handleNuevaFestividad }) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.categoryButton} onPress={handleNuevaCategoria}>
      <Plus size={16} color="white" />
      <Text style={styles.categoryButtonText}>Nueva Categoría</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.festividadButton} onPress={handleNuevaFestividad}>
      <Plus size={16} color="white" />
      <Text style={styles.festividadButtonText}>Nueva Festividad</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#FAA543',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 20,
    gap: 6,
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'InriaSans-Bold',
    fontWeight: '500',
  },
  festividadButton: {
    flex: 1,
    backgroundColor: '#CB8E45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 20,
    gap: 6,
  },
  festividadButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'InriaSans-Bold',
    fontWeight: '500',
  },
});

export default ActionButtons;
