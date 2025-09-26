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
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300/F0F0F0/999999?text=Producto';

const ProductCard = ({ product, navigation, onPress }) => {
  const handleClick = () => {
    if (onPress) {
      onPress(product);
      return;
    }

    if (navigation) {
      navigation.navigate('ProductDetail', { 
        productId: product._id,
        product: product 
      });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={handleClick}
      activeOpacity={0.8}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ 
            uri: product?.image || PLACEHOLDER_IMAGE,
            cache: 'default'
          }} 
          style={styles.productImage}
          resizeMode="cover"
          defaultSource={{ uri: PLACEHOLDER_IMAGE }}
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product?.nameProduct || 'Producto'}
        </Text>
        <Text style={styles.productPrice}>
          Desde ${parseFloat(product?.price || 0).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: (width - 50) / 2,
    marginBottom: 20,
    marginHorizontal: 2,
    borderWidth: 0.5,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  productInfo: {
    padding: 14,
    paddingTop: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 4,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default ProductCard;