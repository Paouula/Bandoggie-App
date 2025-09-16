import React, { useState } from 'react';
import { View, Alert, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../../components/Private/Product/ProductHeader.js';
import SearchBar from '../../../components/Private/Product/SearchBar.js';  // Ahora importamos SearchBar
import ActionButtons from '../../../components/Private/Product/ActionButton.js';
import ProductList from '../../../components/Private/Product/ProductList.js';

const ProductosScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [productos] = useState([
    {
      id: 1,
      nombre: 'Bandana con bordado',
      precio: 7.50,
      imagen: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 2,
      nombre: 'Bandana de calaberas reversi...',
      precio: 10.50,
      imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&crop=center',
    },
    // Más productos...
  ]);

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAgregarProducto = () => {
    Alert.alert('Agregar Producto', 'Agregar nuevo producto');
  };

  const handleNuevaCategoria = () => {
    Alert.alert('Nueva Categoría', 'Crear nueva categoría');
  };

  const handleNuevaFestividad = () => {
    Alert.alert('Nueva Festividad', 'Crear nueva festividad');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Header />
        <SearchBar 
          searchText={searchText} 
          setSearchText={setSearchText} 
          handleAgregarProducto={handleAgregarProducto}  // Pasamos la función aquí
        />
        <ActionButtons
          handleNuevaCategoria={handleNuevaCategoria}
          handleNuevaFestividad={handleNuevaFestividad}
        />
        <ProductList filteredProducts={filteredProducts} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
});

export default ProductosScreen;
