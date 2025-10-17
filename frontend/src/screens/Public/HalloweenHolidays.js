import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFetchProducts from '../../hooks/Products/useFetchProducts';

const { width } = Dimensions.get('window');

const HalloweenHolidays = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { handleGetProducts } = useFetchProducts();
  
  const holidayName = route?.params?.holidayName || 'Halloween';
  const holidayId = route?.params?.holidayId || null;
  const holidayColor = route?.params?.holidayColor || '#FF6B6B';

  useEffect(() => {
    loadHolidayProducts();
  }, [holidayId]);

  useEffect(() => {
    // Filtrar productos basado en la búsqueda
    if (searchText.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.nameProduct?.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        product.idCategory?.nameCategory?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchText, products]);

  const loadHolidayProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allProducts = await handleGetProducts();
      const holidayProducts = allProducts.filter(product => {
        const productHolidayId = 
          product.idHolidayProduct?._id || 
          product.idHolidayProduct;
        return productHolidayId === holidayId;
      });
      
      setProducts(holidayProducts);
      setFilteredProducts(holidayProducts);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
      console.error('Error loading holiday products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { 
      productId: product._id,
      product: product 
    });
  };

  const handleBackPress = () => {
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home');
  };

  const showErrorAlert = () => {
    Alert.alert('Error de conexión', error, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reintentar', onPress: loadHolidayProducts }
    ]);
  };

  const ProductCard = ({ product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.cardImageWrapper}>
        <Image
          source={{ uri: product.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {product.isNew && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Nuevo</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {product.nameProduct}
        </Text>
        <Text style={styles.cardPrice}>
          ${parseFloat(product.price || 0).toFixed(2)}
        </Text>
        {product.idCategory && (
          <Text style={styles.cardCategory} numberOfLines={1}>
            {product.idCategory.nameCategory}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const HeaderComponent = () => (
    <View>
      {/* Header con búsqueda */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {loading && filteredProducts.length > 0 && (
          <ActivityIndicator size="small" color="#FFA500" style={{ marginLeft: 10 }} />
        )}
      </View>

      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: holidayColor }]}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>{holidayName}</Text>
          <Text style={styles.bannerDesc}>
            Lindas prendas para tu mascota
          </Text>
          <Text style={styles.bannerCount}>
            {searchText.trim() ? filteredProducts.length : products.length} productos
          </Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1512546148165-e50d714a565a?w=150&h=150&fit=crop' }}
          style={styles.bannerImg}
        />
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={18} color="#D32F2F" />
          <Text style={styles.errorMsg}>{error}</Text>
          <TouchableOpacity onPress={showErrorAlert}>
            <Text style={styles.errorLink}>Ver</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Título */}
      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>
          {searchText.trim() ? 'Resultados' : `Productos de ${holidayName}`}
        </Text>
        {searchText.trim() && (
          <Text style={styles.count}>{filteredProducts.length}/{products.length}</Text>
        )}
      </View>
    </View>
  );

  const EmptyComponent = () => (
    <View style={styles.empty}>
      <Ionicons 
        name={searchText.trim() ? "search" : "sad-outline"} 
        size={50} 
        color="#ddd" 
      />
      <Text style={styles.emptyTitle}>
        {searchText.trim() ? 'Sin resultados' : 'No hay productos'}
      </Text>
      <Text style={styles.emptyText}>
        {searchText.trim()
          ? `No encontramos productos con "${searchText}"`
          : `No hay productos de ${holidayName}`
        }
      </Text>
      <TouchableOpacity 
        style={styles.emptyBtn}
        onPress={searchText.trim() ? handleClearSearch : loadHolidayProducts}
      >
        <Text style={styles.emptyBtnText}>
          {searchText.trim() ? 'Limpiar búsqueda' : 'Reintentar'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {loading && filteredProducts.length === 0 ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={<HeaderComponent />}
          ListEmptyComponent={<EmptyComponent />}
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadHolidayProducts}
              colors={['#FFA500']}
              tintColor="#FFA500"
            />
          }
        />
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="grid" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="bag" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  
  // Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  backBtn: {
    padding: 5,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  // Banner
  banner: {
    flexDirection: 'row',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  bannerText: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  bannerDesc: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  bannerCount: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '600',
  },
  bannerImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },

  // Error
  errorBox: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  errorMsg: {
    flex: 1,
    fontSize: 13,
    color: '#D32F2F',
  },
  errorLink: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },

  // Title Section
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  count: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },

  // Loading
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#999',
    fontSize: 14,
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  emptyBtn: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // List
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 90,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    marginBottom: 10,
  },

  // Card
  card: {
    width: '48.5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 130,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 16,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 11,
    color: '#999',
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 12,
    elevation: 5,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});

export default HalloweenHolidays;