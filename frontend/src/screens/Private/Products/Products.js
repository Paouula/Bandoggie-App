import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, ActivityIndicator, Alert, View } from 'react-native';
import Header from '../../../components/Private/Product/ProductHeader.js';
import ActionButtons from '../../../components/Private/Product/ActionButton.js'
import SearchBar from '../../../components/Private/SearchBar.js';
import ProductCard from '../../../components/Private/Product/ProductCard.js';
import useFetchProducts from '../../../hooks/Products/useFetchProducts.js';
import CreateProductModal from '../../../components/Private/Product/CreateProductModal.js';

const ProductosScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // 👈 nuevo estado

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

  // 👇 abrir modal al presionar "Agregar"
  const handleAgregarProducto = () => {
    setModalVisible(true);
  };

  // 👇 cerrar modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // 👇 acción cuando se crea un producto
  const handleCreateProduct = async (productData) => {
    console.log('Producto creado:', productData);
    // Aquí podrías llamar a tu API para guardar el producto
    // Luego recargar productos:
    await loadProducts();
  };

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
              <SearchBar 
                searchText={searchText} 
                setSearchText={setSearchText} 
                handleAgregarProducto={handleAgregarProducto} // 👈 se pasa aquí
              />
              <ActionButtons />
              <View style={styles.productsStartBackground} />
            </View>
          )}
        />
      )}

      {/* Modal de creación */}
      <CreateProductModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onCreateProduct={handleCreateProduct}
        categories={['Collares', 'Ropa', 'Accesorios']}
        festivities={['Navidad', 'Halloween', 'Cumpleaños']}
        loading={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: '#f8f9fa',
  },
  productsStartBackground: {
    height: 10,
    backgroundColor: '#ffe6f0',
  },
  listContent: {
    backgroundColor: '#ffe6f0',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default ProductosScreen;
