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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FestivitiesScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [festivityProducts, setFestivityProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Recibir parámetros desde el HomeScreen (con valores por defecto)
  const festivityName = route?.params?.festivityName || 'Navidad';
  const festivityId = route?.params?.festivityId || 1;
  const festivityColor = route?.params?.festivityColor || '#FF6B6B';

  // Productos de ejemplo
  const mockProducts = [
    {
      id: 1,
      name: 'Bandana navideña con lentejuelas',
      price: 7.50,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Collar navideño con cascabeles',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Suéter navideño de renos',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop',
    },
  ];

  useEffect(() => {
    // Cargar productos cuando el componente se monta
    setFestivityProducts(mockProducts);
  }, []);

  const handleProductPress = (product) => {
    console.log('Producto seleccionado:', product.name);
    // Aquí puedes navegar a la pantalla de detalles
    // navigation.navigate('ProductDetail', { productId: product.id });
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
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de festividad */}
        <View style={styles.bannerContainer}>
          <View style={[styles.bannerContent, { backgroundColor: festivityColor }]}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>{festivityName}</Text>
              <Text style={styles.bannerDescription}>
                Lindas y hermosas prendas para que tu mascota esté muy navideña
              </Text>
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

        {/* Lista de productos */}
        <View style={styles.productsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos de {festivityName}</Text>
            <TouchableOpacity onPress={() => console.log('Ver todos')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {festivityProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
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
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    Desde ${product.price.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Espaciado para la navegación inferior */}
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
  
  // Header styles
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
  
  // Banner styles
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 15,
    opacity: 0.9,
  },
  shopButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  
  // Products section styles
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
  seeAllText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'column',
  },
  
  // Product card styles
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  
  // Bottom navigation styles
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
  
  // Utility styles
  bottomSpacing: {
    height: 20,
  },
});

export default FestivitiesScreen;