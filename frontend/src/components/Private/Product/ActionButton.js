import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Plus, Tags, Calendar } from 'lucide-react-native';

const ActionButtons = ({ onManageCategories, onManageHolidays }) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.categoryButton} onPress={onManageCategories}>
      <Tags size={16} color="white" />
      <Text style={styles.categoryButtonText}>Gestionar Categorías</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.festividadButton} onPress={onManageHolidays}>
      <Calendar size={16} color="white" />
      <Text style={styles.festividadButtonText}>Gestionar Festividades</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 15,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#f08819',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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
    backgroundColor: '#c78937',
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