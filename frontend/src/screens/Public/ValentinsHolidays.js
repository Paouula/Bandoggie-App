import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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

// Importar el hook personalizado
import { useProductsWithLocalFilter } from '../hooks/useProducts';

const { width } = Dimensions.get('window');

const ValentinsHolidays = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');

  // Recibir parámetros desde el HomeScreen
  const holidayName = route?.params?.holidayName || 'San Valentín';
  const holidayId = route?.params?.holidayId || null;
  const holidayColor = route?.params?.holidayColor || '#FF6B6B';

  // Usar el hook personalizado para obtener y filtrar productos
  const {
    products: filteredProducts,
    allProducts,
    loading,
    error,
    refetch,
    filterProducts,
    clearFilter,
    isFiltered,
    hasData,
    totalCount,
    filteredCount,
  } = useProductsWithLocalFilter(holidayId);

  const handleSearch = (text) => {
    setSearchText(text);
    filterProducts(text);
  };

  const handleClearSearch = () => {
    setSearchText('');
    clearFilter();
  };

  const handleProductPress = (product) => {
    console.log('Producto seleccionado:', product.nameProduct);
    navigation.navigate('ProductDetail', { 
      productId: product._id,
      product: product 
    });
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const showErrorAlert = () => {
    Alert.alert(
      'Error de conexión',
      error,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reintentar', onPress: refetch }
      ]
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons 
          name={isFiltered ? "search" : "sad-outline"} 
          size={64} 
          color="#ccc" 
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>
          {isFiltered ? 'Sin resultados' : 'No hay productos'}
        </Text>
        <Text style={styles.emptyText}>
          {isFiltered 
            ? `No se encontraron productos que coincidan con "${searchText}"`
            : `No hay productos disponibles para ${holidayName} en este momento`
          }
        </Text>
        {isFiltered && (
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={handleClearSearch}
          >
            <Text style={styles.clearFilterText}>Limpiar búsqueda</Text>
          </TouchableOpacity>
        )}
        {!isFiltered && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={refetch}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderProduct = (product) => (
    <TouchableOpacity
      key={product._id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.nameProduct}
        </Text>
        <Text style={styles.productPrice}>
          ${parseFloat(product.price || 0).toFixed(2)}
        </Text>
        {product.idCategory && (
          <Text style={styles.productCategory}>
            {product.idCategory.nameCategory}
          </Text>
        )}
        {product.idHolidayProduct && (
          <Text style={styles.productHoliday}>
            ❤️ {product.idHolidayProduct.nameHoliday}
          </Text>
        )}
      </View>
      {product.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.badgeText}>Nuevo</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#666"
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <ActivityIndicator size="small" color="#FFA500" style={styles.headerLoader} />
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={['#FFA500']}
            tintColor="#FFA500"
          />
        }
      >
        <View style={styles.bannerContainer}>
          <View style={[styles.bannerContent, { backgroundColor: holidayColor }]}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>{holidayName}</Text>
              <Text style={styles.bannerDescription}>
                Lindas y hermosas prendas para tu mascota en este San Valentín
              </Text>
              {hasData && (
                <Text style={styles.bannerStats}>
                  {isFiltered ? filteredCount : totalCount} productos disponibles
                </Text>
              )}
            </View>
            <View style={styles.bannerImageContainer}>
              <Image
                source={{ 
                  uri: 'https://images.unsplash.com/photo-1512546148165-e50d714a565a?w=200&h=200&fit=crop&crop=face'
                }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View style={styles.decorativeContainer}>
                <Text style={styles.decorativeEmoji}>🐾</Text>
                <Text style={styles.decorativeEmoji}>🐾</Text>
                <Text style={styles.decorativeEmoji}>🐾</Text>
              </View>
            </View>
          </View>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={20} color="#D32F2F" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={showErrorAlert}>
              <Text style={styles.errorAction}>Ver más</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.productsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isFiltered ? 'Resultados de búsqueda' : `Productos de ${holidayName}`}
            </Text>
            <View style={styles.statsContainer}>
              {isFiltered && (
                <Text style={styles.statsText}>
                  {filteredCount} de {totalCount}
                </Text>
              )}
            </View>
          </View>

          {loading && filteredProducts.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFA500" />
              <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
          )}
          
          {!loading && filteredProducts.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map(renderProduct)}
            </View>
          )}
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Categories')}>
          <Ionicons name="grid" size={24} color="#666" />
        </TouchableOpacity> 
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Cart')}>
          <Ionicons name="bag" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15, padding: 5 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  clearButton: { marginLeft: 5 },
  headerLoader: { marginLeft: 10 },
  bannerContainer: { margin: 20, borderRadius: 20, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  bannerContent: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  bannerTextContainer: { flex: 1, paddingRight: 15 },
  bannerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  bannerDescription: { fontSize: 14, color: '#fff', lineHeight: 20, marginBottom: 10, opacity: 0.9 },
  bannerStats: { fontSize: 12, color: '#fff', opacity: 0.8, fontWeight: '600' },
  bannerImageContainer: { position: 'relative', alignItems: 'center' },
  bannerImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  decorativeContainer: { position: 'absolute', top: -10, right: -10, flexDirection: 'row', transform: [{ rotate: '15deg' }] },
  decorativeEmoji: { fontSize: 16, marginHorizontal: 2 },
  errorBanner: { backgroundColor: '#FFEBEE', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#D32F2F' },
  errorText: { flex: 1, color: '#D32F2F', fontSize: 14, marginLeft: 10 },
  errorAction: { color: '#D32F2F', fontSize: 14, fontWeight: '600' },
  productsContainer: { paddingHorizontal: 20, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 },
  statsContainer: { alignItems: 'flex-end' },
  statsText: { fontSize: 12, color: '#666', fontWeight: '500' },
  loadingContainer: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyIcon: { marginBottom: 15 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  clearFilterButton: { backgroundColor: '#FFA500', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginBottom: 10 },
  clearFilterText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  retryButton: { backgroundColor: '#FF6B6B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  productsGrid: { flexDirection: 'column' },
  productCard: { backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, marginBottom: 15, position: 'relative' },
  productImage: { width: '100%', height: 200 },
  productInfo: { padding: 15 },
  productName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, lineHeight: 20 },
  productPrice: { fontSize: 18, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 4 },
  productCategory: { fontSize: 12, color: '#666', marginBottom: 2 },
  productHoliday: { fontSize: 11, color: '#FFA500', fontWeight: '500' },
  newBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#4CAF50', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E0E0E0', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5 },
  bottomSpacing: { height: 20 },
});

export default ValentinsHolidays;
