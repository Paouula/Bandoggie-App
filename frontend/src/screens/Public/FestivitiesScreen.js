import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetchProducts from '../../hooks/Products/useFetchProducts';

const { width } = Dimensions.get('window');

export default function FestivitiesScreen({ navigation, route }) {
  const { handleGetProducts } = useFetchProducts();
  
  const [currentView, setCurrentView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [petName, setPetName] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [nameFieldEnabled, setNameFieldEnabled] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const festivityId = route?.params?.festivityId;
  const festivityName = route?.params?.festivityName || 'Festividad';
  const festivityColor = route?.params?.festivityColor || '#FF6B6B';

  useEffect(() => {
    loadFestivityProducts();
  }, [festivityId]);

  useEffect(() => {
    updateCartCount();
    const unsubscribe = navigation.addListener('focus', updateCartCount);
    return unsubscribe;
  }, [navigation]);

  const updateCartCount = async () => {
    try {
      const cartString = await AsyncStorage.getItem('bandoggie_cart');
      if (cartString && cartString !== 'undefined' && cartString !== 'null') {
        const cart = JSON.parse(cartString);
        const count = cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error obteniendo contador del carrito:', error);
      setCartCount(0);
    }
  };

  const loadFestivityProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allProducts = await handleGetProducts();
      const festivityProducts = allProducts.filter(product => {
        const productHolidayId = 
          product.idHolidayProduct?._id || 
          product.idHolidayProduct;
        return productHolidayId === festivityId;
      });
      
      setProducts(festivityProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error loading festivity products:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const addToCart = async () => {
    try {
      if (!selectedProduct) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No hay producto seleccionado'
        });
        return;
      }

      const cartItem = {
        _id: selectedProduct._id || `temp_${Date.now()}`,
        id: selectedProduct._id || `temp_${Date.now()}`,
        name: selectedProduct.nameProduct,
        nameProduct: selectedProduct.nameProduct,
        price: parseFloat(selectedProduct.price) || 0,
        quantity: quantity,
        subtotal: (parseFloat(selectedProduct.price) || 0) * quantity,
        talla: selectedSize,
        color: selectedColor === 0 ? 'Diseño 1' : 'Diseño 2',
        petName: nameFieldEnabled ? petName : null,
        image: selectedProduct.image,
        productInfo: {
          image: selectedProduct.image,
          designImages: selectedProduct.designImages,
          description: selectedProduct.description
        }
      };

      const cartString = await AsyncStorage.getItem('bandoggie_cart');
      let cart = [];
      
      if (cartString && cartString !== 'undefined' && cartString !== 'null') {
        cart = JSON.parse(cartString);
      }

      const existingItemIndex = cart.findIndex(item => 
        item._id === cartItem._id && 
        item.talla === cartItem.talla &&
        item.color === cartItem.color &&
        item.petName === cartItem.petName
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].subtotal = 
          cart[existingItemIndex].quantity * cart[existingItemIndex].price;
        
        Toast.show({
          type: 'success',
          text1: 'Actualizado',
          text2: `Cantidad actualizada en el carrito`
        });
      } else {
        cart.push(cartItem);
        
        Toast.show({
          type: 'success',
          text1: 'Éxito',
          text2: `${selectedProduct.nameProduct} agregado al carrito`
        });
      }

      await AsyncStorage.setItem('bandoggie_cart', JSON.stringify(cart));
      await updateCartCount();

      console.log('✅ Producto agregado al carrito:', {
        product: selectedProduct.nameProduct,
        size: selectedSize,
        quantity: quantity,
        petName: petName,
        totalItems: cart.length
      });

    } catch (error) {
      console.error('❌ Error agregando al carrito:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo agregar al carrito'
      });
    }
  };

  const buyNow = async () => {
    try {
      await addToCart();
      
      setTimeout(() => {
        navigation.navigate('Cart');
        
        Toast.show({
          type: 'info',
          text1: 'Carrito',
          text2: 'Procede con tu compra'
        });
      }, 1000);

    } catch (error) {
      console.error('❌ Error en comprar ahora:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo procesar la compra'
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={festivityColor} />
          <Text style={styles.loadingText}>Cargando productos de {festivityName}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar productos:</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFestivityProducts}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentView === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{festivityName}</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color="#333" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {products.length === 0 ? (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No hay productos disponibles para {festivityName}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadFestivityProducts}>
              <Text style={styles.retryButtonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
            {products.map((product) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackToList}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Producto</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="cart-outline" size={24} color="#333" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainImageContainer}>
          <Image 
            source={{ 
              uri: selectedProduct?.designImages?.[selectedImageIndex] || selectedProduct?.image 
            }} 
            style={styles.mainImage} 
            resizeMode="cover" 
          />
        </View>

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

        <View style={styles.productInfo}>
          <Text style={styles.detailTitle}>{selectedProduct?.nameProduct}</Text>
          <Text style={styles.detailPrice}>Desde ${parseFloat(selectedProduct?.price || 0).toFixed(2)}</Text>
          
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

          {selectedProduct?.description && (
            <Text style={styles.description}>{selectedProduct.description}</Text>
          )}

          <Text style={styles.sectionTitle}>Diseño</Text>
          <View style={styles.colorsContainer}>
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: '#F5E6D3' },
                selectedColor === 0 && styles.selectedColor
              ]}
              onPress={() => setSelectedColor(0)}
            />
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: '#FF7043' },
                selectedColor === 1 && styles.selectedColor
              ]}
              onPress={() => setSelectedColor(1)}
            />
          </View>

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

          <TouchableOpacity 
            style={styles.sizeGuide}
            onPress={() => setShowSizeGuide(true)}
          >
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.sizeGuideText}>Guía de tallas</Text>
          </TouchableOpacity>

          {showSizeGuide && (
            <View style={styles.sizeGuideOverlay}>
              <View style={styles.sizeGuideModal}>
                <View style={styles.sizeGuideHeader}>
                  <Text style={styles.sizeGuideTitle}>Guía de Tallas</Text>
                  <TouchableOpacity onPress={() => setShowSizeGuide(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <Image 
                  source={require('../../../assets/Home/GuiaTallas.png')} 
                  style={styles.sizeGuideImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          <View style={styles.nameContainer}>
            <Text style={styles.sectionTitle}>Nombre</Text>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setNameFieldEnabled(!nameFieldEnabled)}
            >
              <Ionicons 
                name={nameFieldEnabled ? "checkbox" : "square-outline"} 
                size={20} 
                color={nameFieldEnabled ? "#4CAF50" : "#666"} 
              />
            </TouchableOpacity>
          </View>
          
          {nameFieldEnabled && (
            <TextInput
              style={styles.nameInput}
              placeholder="Nombre De su Perrito"
              value={petName}
              onChangeText={setPetName}
            />
          )}

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
  cartButton: {
    position: 'relative',
    padding: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
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
    marginBottom: 20,
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
    marginTop: 10,
  },
  colorsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  sizesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSize: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  sizeText: {
    color: '#333',
    fontWeight: '600',
  },
  selectedSizeText: {
    color: '#FFF',
  },
  sizeGuide: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sizeGuideText: {
    color: '#666',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    padding: 5,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  sizeGuideOverlay: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    bottom: -100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  sizeGuideModal: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  sizeGuideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sizeGuideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sizeGuideImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
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
    });