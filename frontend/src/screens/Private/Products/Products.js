import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, ActivityIndicator, Alert, View } from 'react-native';
import Header from '../../../components/Private/Product/ProductHeader.js';
import SearchBar from '../../../components/Private/Product/SearchBar.js';
import ProductCard from '../../../components/Private/Product/ProductCard.js';
import useFetchProducts from '../../../hooks/Products/useFetchProducts.js';

const ProductosScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);

  const { handleGetProducts } = useFetchProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await handleGetProducts();
      setProductos(data || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(productos)
    ? productos.filter(producto =>
        producto.nameProduct?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4a90a4" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          columnWrapperStyle={filteredProducts.length > 0 ? styles.row : null}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Header />
              <SearchBar searchText={searchText} setSearchText={setSearchText} />
              <View style={styles.productsStartBackground} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Fondo blanco/neutral para toda la pantalla
  },
  headerContainer: {
    backgroundColor: '#f8f9fa', // Fondo blanco para header y search
  },
  productsStartBackground: {
    height: 10,
    backgroundColor: '#ffe6f0', // Aquí empieza el fondo rosa
  },
  listContent: {
    backgroundColor: '#ffe6f0', // Fondo rosa para el área de productos
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default ProductosScreen;