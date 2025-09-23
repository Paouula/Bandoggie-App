import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFetchProducts from '../../hooks/Products/useFetchProducts.js'; // Ajusta la ruta según tu estructura

const { width } = Dimensions.get('window');

export default function BandanasScreen({ navigation }) {
  const { 
    products, 
    loading, 
    error, 
    refetch
  } = useFetchProducts();
  
  const [currentView, setCurrentView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [petName, setPetName] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [nameFieldEnabled, setNameFieldEnabled] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Función para filtrar productos por tipo
  const filterProductsByType = (type) => {
    if (!products || !Array.isArray(products)) return [];
    return products.filter(product => 
      product.category?.toLowerCase() === type.toLowerCase() ||
      product.type?.toLowerCase() === type.toLowerCase() ||
      product.productType?.toLowerCase() === type.toLowerCase()
    );
  };

  // Filtrar productos de bandanas - con verificación adicional
  const bandanasProducts = React.useMemo(() => {
    return filterProductsByType('bandanas');
  }, [products]);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setCurrentView('detail');
  };

  const goBackToList = () => {
    setCurrentView('list');
    setSelectedProduct(null);
  };

  const increaseQuantity = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    Alert.alert('Éxito', `${selectedProduct.nameProduct} agregado al carrito`);
    console.log('Agregado al carrito:', {
      product: selectedProduct,
      size: selectedSize,
      quantity: quantity,
      petName: petName
    });
  };

  const buyNow = () => {
    Alert.alert('Comprar', `Procesando compra de ${selectedProduct.nameProduct}`);
    console.log('Comprar ahora:', {
      product: selectedProduct,
      size: selectedSize,
      quantity: quantity,
      petName: petName
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c5aa0" />
          <Text style={styles.loadingText}>Cargando bandanas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar bandanas:</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Vista de lista de productos reales
  if (currentView === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Productos</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {bandanasProducts.length === 0 ? (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No hay bandanas disponibles</Text>
            <Text style={styles.debugText}>
              Total productos: {products?.length || 0} | Bandanas: {bandanasProducts.length}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
            {bandanasProducts.map((product) => (
              <TouchableOpacity
                key={product._id}
                style={styles.productCard}
                onPress={() => openProductDetail(product)}
              >
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage} 
                  resizeMode="cover"
                />
                <Text style={styles.productTitle}>{product.nameProduct}</Text>
                <Text style={styles.productPrice}>Desde ${parseFloat(product.price).toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  // Vista de detalle del producto - manteniendo el diseño original
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackToList}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Producto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
        {/* Imagen principal del producto */}
        <View style={styles.mainImageContainer}>
          <Image 
            source={{ 
              uri: selectedProduct?.designImages?.[selectedImageIndex] || selectedProduct?.image 
            }} 
            style={styles.mainImage} 
            resizeMode="cover" 
          />
        </View>

        {/* Imágenes pequeñas */}
        {selectedProduct?.designImages && selectedProduct.designImages.length > 0 && (
          <View style={styles.thumbnailContainer}>
            {selectedProduct.designImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnailWrapper,
                  selectedImageIndex === index && styles.selectedThumbnail
                ]}
              >
                <Image 
                  source={{ uri: image }} 
                  style={styles.thumbnail} 
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.detailTitle}>{selectedProduct?.nameProduct}</Text>
          <Text style={styles.detailPrice}>Desde ${parseFloat(selectedProduct?.price || 0).toFixed(2)}</Text>
          
          {/* Rating (puedes agregar esto en tu backend más adelante) */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingNumber}>5.0</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.reviewsText}>(15 evaluaciones)</Text>
          </View>

          {/* Descripción */}
          {selectedProduct?.description && (
            <Text style={styles.description}>{selectedProduct.description}</Text>
          )}

          {/* Talla */}
          <Text style={styles.sectionTitle}>Talla</Text>
          <View style={styles.sizesContainer}>
            {['XS', 'S', 'M', 'L'].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeOption,
                  selectedSize === size && styles.selectedSize
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText
                ]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cantidad */}
          <Text style={styles.sectionTitle}>Cantidad</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]} 
              onPress={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity >= 5 && styles.quantityButtonDisabled]} 
              onPress={increaseQuantity}
              disabled={quantity >= 5}
            >
              <Text style={[styles.quantityButtonText, quantity >= 5 && styles.quantityButtonTextDisabled]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botones de acción con cantidad integrada */}
      <View style={styles.actionButtons}>
        <View style={styles.bottomQuantityContainer}>
          <TouchableOpacity 
            style={[styles.bottomQuantityButton, quantity <= 1 && styles.quantityButtonDisabled]} 
            onPress={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Text style={[styles.bottomQuantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>-</Text>
          </TouchableOpacity>
          <Text style={styles.bottomQuantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={[styles.bottomQuantityButton, quantity >= 5 && styles.quantityButtonDisabled]} 
            onPress={increaseQuantity}
            disabled={quantity >= 5}
          >
            <Text style={[styles.bottomQuantityButtonText, quantity >= 5 && styles.quantityButtonTextDisabled]}>+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartText}>Añadir al carrito</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowButton} onPress={buyNow}>
            <Text style={styles.buyNowText}>Comprar ahora</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2c5aa0',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    backgroundColor: '#2c5aa0',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cartCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  productHoliday: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5aa0',
    textAlign: 'center',
  },
  detailContainer: {
    flex: 1,
  },
  mainImageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 10,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  thumbnailWrapper: {
    borderRadius: 8,
    marginHorizontal: 5,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#2c5aa0',
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 15,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sizesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sizeOption: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedSize: {
    borderColor: '#2c5aa0',
    backgroundColor: '#f0f5ff',
  },
  sizeText: {
    fontSize: 16,
    color: '#666',
  },
  selectedSizeText: {
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#2c5aa0',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    borderColor: '#ccc',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: '#ccc',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bottomQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  bottomQuantityButton: {
    borderWidth: 1,
    borderColor: '#2c5aa0',
    borderRadius: 8,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomQuantityButtonText: {
    fontSize: 16,
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  bottomQuantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  actionButtonsContainer: {
    gap: 10,
  },
  addToCartButton: {
    backgroundColor: '#FF9F43',
    paddingVertical: 15,
    borderRadius: 25,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buyNowButton: {
    backgroundColor: '#FFB3D9',
    paddingVertical: 15,
    borderRadius: 25,
  },
  buyNowText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});