import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, ActivityIndicator, Alert, View } from 'react-native';
import Header from '../../../components/Private/Product/ProductHeader.js';
import ActionButtons from '../../../components/Private/Product/ActionButton.js';
import SearchBar from '../../../components/Private/SearchBar.js';
import ProductCard from '../../../components/Private/Product/ProductCard.js';
import CreateProductModal from '../../../components/Private/Product/CreateProductModal.js';
import useFetchProducts from '../../../hooks/Products/useFetchProducts.js';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../../config';

const ProductosScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [holidays, setHolidays] = useState([]);

  // Hook de productos
  const { handleGetProducts, handlePostProducts } = useFetchProducts();

  useEffect(() => {
    loadInitialData();
  }, []);

  // Función para obtener categorías
  const getCategories = async () => {
    try {
      const response = await fetch(`${API_URL}categories`);
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading categories:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar las categorías'
      });
      return [];
    }
  };

  // Función para obtener festividades
  const getHolidays = async () => {
    try {
      const response = await fetch(`${API_URL}holiday`);
      if (!response.ok) {
        throw new Error('Error al cargar festividades');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading holidays:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar las festividades'
      });
      return [];
    }
  };

  // Cargar productos, categorías y festividades al iniciar
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, holidaysData] = await Promise.all([
        handleGetProducts(),
        getCategories(),
        getHolidays()
      ]);
      
      setProductos(productsData || []);
      setCategories(categoriesData || []);
      setHolidays(holidaysData || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar los datos'
      });
    } finally {
      setLoading(false);
    }
  };

  // Recargar solo productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await handleGetProducts();
      setProductos(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar los productos'
      });
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos según búsqueda
  const filteredProducts = Array.isArray(productos)
    ? productos.filter(producto =>
        producto.nameProduct?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  // Abrir modal de creación
  const handleAgregarProducto = () => {
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Crear producto
  const handleCreateProduct = async (productData) => {
    try {
      setLoading(true);
      
      console.log('📝 [SCREEN] Recibiendo datos del modal...');
      console.log('📝 [SCREEN] Datos recibidos:', {
        nameProduct: productData.nameProduct,
        price: productData.price,
        descriptionLength: productData.description.length,
        hasImage: !!productData.image,
        designImagesCount: productData.designImages?.length || 0,
        idCategory: productData.idCategory,
        idHolidayProduct: productData.idHolidayProduct
      });
      
      // El modal ya prepara los datos correctamente
      // El hook handlePostProducts construirá el FormData
      await handlePostProducts(productData);
      
      console.log('✅ [SCREEN] Producto creado exitosamente');
      
      // Cerrar modal y recargar productos
      handleCloseModal();
      await loadProducts();
      
    } catch (error) {
      console.error('💥 [SCREEN] Error creating product:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo crear el producto'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90a4" />
        </View>
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
                handleAgregarProducto={handleAgregarProducto}
              />
              <ActionButtons />
              <View style={styles.productsStartBackground} />
            </View>
          )}
        />
      )}

      {/* Modal de creación de producto */}
      <CreateProductModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onCreateProduct={handleCreateProduct}
        categories={categories}
        festivities={holidays}
        loading={loading}
      />
      
      {/* Toast para notificaciones */}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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