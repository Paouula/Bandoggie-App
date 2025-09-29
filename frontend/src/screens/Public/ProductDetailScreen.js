import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import useFetchProductsByCategory from '../hooks/Products/useFetchByCategory';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { product } = route.params || {};
  const { handleGetProductsByCategory } = useFetchProductsByCategory();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [petName, setPetName] = useState('Nombre de tu Perrito');
  const [isEditingName, setIsEditingName] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRelated, setShowRelated] = useState(true);

  useEffect(() => {
    loadRelatedProducts();
  }, [product]);

  const loadRelatedProducts = async () => {
    try {
      if (product?.idCategory) {
        const products = await handleGetProductsByCategory(product.idCategory);
        const filtered = products.filter(p => p._id !== product._id).slice(0, 2);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error('Error loading related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = () => {
    Toast.show({
      type: 'success',
      text1: 'Añadido al carrito',
      text2: `${product.nameProduct} agregado correctamente`,
    });
  };

  const buyNow = () => {
    Toast.show({
      type: 'success',
      text1: 'Comprar ahora',
      text2: `Procesando compra de ${product.nameProduct}`,
    });
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={14}
            color="#FFD700"
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  const renderColorOptions = () => {
    const colors = ['#D2B48C', '#F4A460'];
    return (
      <View style={styles.colorContainer}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === index && styles.selectedColorOption
            ]}
            onPress={() => setSelectedColor(index)}
          />
        ))}
      </View>
    );
  };

  const renderSizeOptions = () => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    return (
      <View style={styles.sizeContainer}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeOption,
              selectedSize === size && styles.selectedSizeOption
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text style={[
              styles.sizeText,
              selectedSize === size && styles.selectedSizeText
            ]}>
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image 
          source={require('../../assets/SplashScreen/bandoggie-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Imagen principal */}
        <View style={styles.mainImageContainer}>
          <Image 
            source={{ uri: product?.designImages?.[selectedImageIndex] || product?.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Miniaturas */}
        {product?.designImages && product.designImages.length > 1 && (
          <View style={styles.thumbnailContainer}>
            {product.designImages.slice(0, 3).map((image, index) => (
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
          <Text style={styles.productTitle}>{product?.nameProduct}</Text>
          <Text style={styles.productPrice}>Desde ${parseFloat(product?.price || 0).toFixed(2)}</Text>
          
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>5.0</Text>
            {renderStars()}
            <Text style={styles.reviewCount}>(15 evaluaciones)</Text>
          </View>
        </View>

        {/* Descripción */}
        {product?.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {/* Diseño */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diseño</Text>
          {renderColorOptions()}
        </View>

        {/* Talla */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Talla</Text>
          {renderSizeOptions()}
          <TouchableOpacity style={styles.sizeGuideButton}>
            <MaterialIcons name="straighten" size={16} color="#666" />
            <Text style={styles.sizeGuideText}>Guía de tallas</Text>
          </TouchableOpacity>
        </View>

        {/* Nombre personalizado */}
        <View style={styles.section}>
          <View style={styles.nameSection}>
            <Text style={styles.sectionTitle}>Nombre</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditingName(!isEditingName)}
            >
              <MaterialIcons name="edit" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          {isEditingName ? (
            <TextInput
              style={styles.nameInput}
              value={petName}
              onChangeText={setPetName}
              onBlur={() => setIsEditingName(false)}
              autoFocus
            />
          ) : (
            <Text style={styles.nameText}>{petName}</Text>
          )}
        </View>

        {/* Comentarios y reseñas */}
        <TouchableOpacity style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Comentarios y reseñas</Text>
        </TouchableOpacity>

        {/* Productos relacionados */}
        {showRelated && (
          <View style={styles.relatedSection}>
            <View style={styles.relatedHeader}>
              <Text style={styles.relatedTitle}>Productos relacionados</Text>
              <TouchableOpacity onPress={() => setShowRelated(false)}>
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <ActivityIndicator style={styles.loader} color="#FF6B6B" />
            ) : (
              <View style={styles.relatedGrid}>
                {relatedProducts.map((relatedProduct) => (
                  <TouchableOpacity 
                    key={relatedProduct._id} 
                    style={styles.relatedCard}
                    onPress={() => navigation.push('ProductDetail', { product: relatedProduct })}
                  >
                    <Image 
                      source={{ uri: relatedProduct.image }}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.relatedName} numberOfLines={2}>
                      {relatedProduct.nameProduct}
                    </Text>
                    <Text style={styles.relatedPrice}>
                      Desde ${parseFloat(relatedProduct.price || 0).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.actionContainer}>
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
            style={styles.quantityButton} 
            onPress={increaseQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  logo: {
    width: 35,
    height: 35,
  },
  content: {
    flex: 1,
  },
  mainImageContainer: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainImage: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 15,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    gap: 10,
  },
  thumbnailWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  productInfo: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  descriptionContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#333',
    borderWidth: 3,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  sizeOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  selectedSizeOption: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedSizeText: {
    color: '#FFF',
  },
  sizeGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sizeGuideText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    padding: 5,
  },
  nameText: {
    fontSize: 14,
    color: '#666',
  },
  nameInput: {
    fontSize: 14,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 5,
  },
  reviewSection: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    marginTop: 8,
    alignItems: 'center',
  },
  reviewSectionTitle: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  relatedSection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  relatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loader: {
    marginVertical: 20,
  },
  relatedGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  relatedCard: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  relatedImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  relatedPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionContainer: {
    backgroundColor: '#FFF',
    padding: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityButtonTextDisabled: {
    color: '#CCC',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  buttonContainer: {
    gap: 10,
  },
  addToCartButton: {
    backgroundColor: '#FFB84D',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});