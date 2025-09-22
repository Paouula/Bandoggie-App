import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Header from '../../../components/Private/Product/ProductHeader.js';
import SearchBar from '../../../components/Private/Product/SearchBar.js';
import ProductCard from '../../../components/Private/Product/ProductCard.js';
import useFetchProducts from '../../../hooks/Products/useFetchProducts.js'; // <- tu hook

const ProductosScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);

  const { handleGetProducts } = useFetchProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await handleGetProducts();
      setProductos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos según búsqueda
  const filteredProducts = productos.filter(producto =>
    producto.nameProduct?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {loading ? (
        <ActivityIndicator size="large" color="#4a90a4" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id?.toString() || item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 16,
  },
});

export default ProductosScreen;
