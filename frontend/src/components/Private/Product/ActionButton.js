import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Tags, Calendar } from 'lucide-react-native';

const ActionButtons = ({ onManageCategories, onManageHolidays }) => {
  const { width } = useWindowDimensions();

  // Escala ligera para tamaños de pantalla
  const isSmallScreen = width < 360;

  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={[styles.button, styles.categoryButton]} onPress={onManageCategories}>
        <Tags size={isSmallScreen ? 14 : 18} color="white" />
        <Text style={[styles.buttonText, isSmallScreen && styles.smallText]}>
          Gestionar Categorías
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.festividadButton]} onPress={onManageHolidays}>
        <Calendar size={isSmallScreen ? 14 : 18} color="white" />
        <Text style={[styles.buttonText, isSmallScreen && styles.smallText]}>
          Gestionar Festividades
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#f08819',
  },
  festividadButton: {
    backgroundColor: '#c78937',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'InriaSans-Bold',
    fontWeight: '600',
    marginLeft: 6,
  },
  smallText: {
    fontSize: 12,
  },
});

export default ActionButtons;
