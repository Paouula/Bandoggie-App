import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import useFetchProducts from '../../hooks/Products/useFetchProducts.js';

const { width } = Dimensions.get('window');

export default function CollarScreen({ navigation }) {
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

  const { handleGetProducts } = useFetchProducts();

  useEffect(() => {
    loadCollarsProducts();
  }, []);

  const loadCollarsProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los productos
      const allProducts = await handleGetProducts();
      
      // Filtrar productos que contengan "collar" en el nombre o categoría
      const collarsProducts = allProducts.filter(product => {
        const name = product.nameProduct?.toLowerCase() || '';
        const categoryName = product.categoryName?.toLowerCase() || '';
        return name.includes('collar') || categoryName.includes('collar');
      });
      
      setProducts(collarsProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error loading collars:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para procesar los datos del producto de la API
  const processProductData = (product) => {
    return {
      id: product._id,
      title: product.nameProduct,
      price: product.price,
      image: { uri: product.image },
      rating: 5.0,
      reviews: 15,
      description: product.description,
      colors: [
        { name: 'Color 1', color: '#F5E6D3' },
        { name: 'Color 2', color: '#FF7043' }
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      images: product.designImages ? product.designImages.map(url => ({ uri: url })) : [{ uri: product.image }],
      category: product.idCategory,
      holiday: product.idHolidayProduct
    };
  };

  const openProductDetail = (product) => {
    const processedProduct = processProductData(product);
    setSelectedProduct(processedProduct);
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
    Toast.show({
      type: 'success',
      text1: 'Éxito',
      text2: `${selectedProduct.title} agregado al carrito`
    });
  };

  const buyNow = () => {
    Toast.show({
      type: 'success',
      text1: 'Comprar',
      text2: `Procesando compra de ${selectedProduct.title}`
    });
  };

  // Vista de lista de productos
  if (currentView === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collares</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF9F43" />
            <Text style={styles.loadingText}>Cargando productos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error al cargar collares</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCollarsProducts}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay collares disponibles</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCollarsProducts}>
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

  // Vista de detalle del producto
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
            source={selectedProduct.images[selectedImageIndex]} 
            style={styles.mainImage} 
            resizeMode="cover" 
          />
        </View>

        {/* Imágenes pequeñas */}
        <View style={styles.thumbnailContainer}>
          {selectedProduct.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIndex(index)}
              style={[
                styles.thumbnailWrapper,
                selectedImageIndex === index && styles.selectedThumbnail
              ]}
            >
              <Image 
                source={image} 
                style={styles.thumbnail} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
          <Text style={styles.detailPrice}>Desde ${parseFloat(selectedProduct.price).toFixed(2)}</Text>
          
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingNumber}>{selectedProduct.rating}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= selectedProduct.rating ? "star" : "star-outline"}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.reviewsText}>({selectedProduct.reviews} evaluaciones)</Text>
          </View>

          {/* Descripción */}
          <Text style={styles.description}>{selectedProduct.description}</Text>

          {/* Diseño (Colores) */}
          <Text style={styles.sectionTitle}>Diseño</Text>
          <View style={styles.colorsContainer}>
            {selectedProduct.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.color },
                  selectedColor === index && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(index)}
              />
            ))}
          </View>

          {/* Talla */}
          <Text style={styles.sectionTitle}>Talla</Text>
          <View style={styles.sizesContainer}>
            {selectedProduct.sizes.map((size) => (
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

          {/* Guía de tallas */}
          <TouchableOpacity 
            style={styles.sizeGuide}
            onPress={() => setShowSizeGuide(true)}
          >
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.sizeGuideText}>Guía de tallas</Text>
          </TouchableOpacity>

          {/* Modal/Overlay para la guía de tallas */}
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

          {/* Nombre del perrito */}
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
    backgroundColor: '#FF9F43',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
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
    color: '#333',
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
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 5,
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
    borderColor: '#333',
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
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  reviewsText: {
    color: '#666',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
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
    flexWrap: 'wrap',
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
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityButtonTextDisabled: {
    color: '#999',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  bottomQuantityButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bottomQuantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomQuantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
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