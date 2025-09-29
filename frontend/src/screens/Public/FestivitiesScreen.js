import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFetchProducts from '../../hooks/Products/useFetchProducts';
import ProductCard from '../../components/ProductCard';

const { width } = Dimensions.get('window');

// Configuración de festividades con sus IDs
const FESTIVITIES_CONFIG = {
  '68a4ce2aa2099a968645d55f': {
    name: 'Cumpleaños',
    color: '#FF69B4',
    emoji: '🎂',
    description: 'Celebra el cumpleaños de tu mascota con estilo'
  },
  '68a4c746a2099a968645d546': {
    name: 'Días Patrios',
    color: '#0047AB',
    emoji: '🎖️',
    description: 'Viste a tu mascota con orgullo patrio'
  },
  '68a4b29c8ae388e19910c1fa': {
    name: 'San Valentín',
    color: '#FF1493',
    emoji: '💕',
    description: 'Amor y ternura para tu mascota especial'
  },
  '689555222515953c7bbe9f8f': {
    name: 'Halloween',
    color: '#FF6600',
    emoji: '🎃',
    description: 'Disfraces espeluznantes para tu mascota'
  },
  '68d2df3638119eb2888be34b': {
    name: 'Navidad',
    color: '#C41E3A',
    emoji: '🎄',
    description: 'Magia navideña para tu compañero peludo'
  }
};

const FestivitiesScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [festivityProducts, setFestivityProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { handleGetProducts } = useFetchProducts();
  
  // Obtener configuración de la festividad actual
  const HolidaysId = route?.params?.HolidaysId || '68d2df3638119eb2888be34b';
  const festivityConfig = FESTIVITIES_CONFIG[HolidaysId] || {
    name: 'Festividad',
    color: '#FF6B6B',
    emoji: '🎉',
    description: 'Productos especiales para tu mascota'
  };

  useEffect(() => {
    loadFestivityProducts();
  }, [HolidaysId]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredProducts(festivityProducts);
    } else {
      const filtered = festivityProducts.filter(product =>
        product.nameProduct?.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchText, festivityProducts]);

  const loadFestivityProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await handleGetProducts();
      
      console.log('Todos los productos recibidos:', allProducts?.length || 0);
      console.log('ID de festividad a buscar:', HolidaysId);
      console.log('Nombre de festividad:', festivityConfig.name);
      
      if (allProducts && Array.isArray(allProducts)) {
        // Filtrar productos por festividad
        const filteredByFestivity = allProducts.filter(product => {
          const productHolidayId = product.idHolidayProduct?._id || product.idHolidayProduct;
          
          // Log para debugging
          if (productHolidayId) {
            console.log(`Producto: ${product.nameProduct}, Holiday ID: ${productHolidayId}`);
          }
          
          return productHolidayId === HolidaysId;
        });

        console.log(`Productos encontrados para ${festivityConfig.name}:`, filteredByFestivity.length);
        
        setFestivityProducts(filteredByFestivity);
        setFilteredProducts(filteredByFestivity);
      } else {
        console.warn('No se recibieron productos válidos');
        setFestivityProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error al cargar productos de festividad:', error);
      setFestivityProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    console.log('Producto seleccionado:', product.nameProduct);
    // Navegar a detalle del producto si tienes esa pantalla
    // navigation.navigate('ProductDetail', { product });
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const renderProductsContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={festivityConfig.color} />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{festivityConfig.emoji}</Text>
          <Text style={styles.emptyTitle}>
            {searchText ? 'Sin resultados' : 'Sin productos'}
          </Text>
          <Text style={styles.emptyDescription}>
            {searchText 
              ? `No encontramos productos que coincidan con "${searchText}"`
              : `Aún no hay productos disponibles para ${festivityConfig.name}`
            }
          </Text>
          {searchText && (
            <TouchableOpacity 
              style={[styles.clearSearchButton, { backgroundColor: festivityConfig.color }]}
              onPress={() => setSearchText('')}
            >
              <Text style={styles.clearSearchText}>Limpiar búsqueda</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onPress={handleProductPress}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header con barra de búsqueda */}
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
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de festividad */}
        <View style={styles.bannerContainer}>
          <View style={[styles.bannerContent, { backgroundColor: festivityConfig.color }]}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>
                {festivityConfig.emoji} {festivityConfig.name}
              </Text>
              <Text style={styles.bannerDescription}>
                {festivityConfig.description}
              </Text>
              {!loading && filteredProducts.length > 0 && (
                <View style={styles.productCountBadge}>
                  <Text style={styles.productCountBadgeText}>
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.bannerImageContainer}>
              <Image
                source={{ 
                  uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop'
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

        {/* Lista de productos */}
        <View style={styles.productsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Productos disponibles
            </Text>
          </View>
          
          {renderProductsContent()}
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Navegación inferior */}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  
  bannerContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    opacity: 0.95,
  },
  productCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  productCountBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  decorativeContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    flexDirection: 'row',
    transform: [{ rotate: '15deg' }],
  },
  decorativeEmoji: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  
  productsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productsGrid: {
    flexDirection: 'column',
  },
  
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  clearSearchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  
  bottomSpacing: {
    height: 20,
  },
});

export default FestivitiesScreen;