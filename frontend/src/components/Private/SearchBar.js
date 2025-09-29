// SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';  // Usando react-native-vector-icons/Feather

const SearchBar = ({ searchText, setSearchText, handleAgregarProducto }) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        {/* Usando el icono de búsqueda de Feather */}
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
      </View>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAgregarProducto}
        activeOpacity={0.8}
      >
        {/* Usando el icono de más de Feather */}
        <Feather name="plus" size={16} color="white" />
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
  },

  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  searchIcon: {
    marginLeft: 10,
  },

  addButton: {
    backgroundColor: '#36A360',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 6,
  },

  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchBar;
