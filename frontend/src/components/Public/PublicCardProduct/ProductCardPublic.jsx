import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300?text=Producto';

const ProductCard = ({ product, navigation, onPress }) => {
  const handleClick = () => {
    // Si se pasa una función onPress personalizada, usarla
    if (onPress) {
      onPress(product);
      return;
    }

    // Si hay navigation disponible, navegar a detalles del producto
    if (navigation) {
      navigation.navigate('ProductDetail', { 
        productId: product._id,
        product: product 
      });
    } else {
      console.log('Navegando a producto:', product._id);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={handleClick}
      activeOpacity={0.7}
    >
      <View style={styles.productImage}>
        <Image 
          source={{ uri: product.image || PLACEHOLDER_IMAGE }} 
          style={styles.image}
          resizeMode="cover"
          onError={(error) => {
            console.log('Error loading image:', product.image, error);
          }}
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.nameProduct}
        </Text>
        <Text style={styles.productPrice}>
          Desde ${parseFloat(product.price || 0).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: (width - 45) / 2, // Para mostrar 2 columnas con margen
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF9F43',
  },
});

export default ProductCard;