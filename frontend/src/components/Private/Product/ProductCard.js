import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => onPress(product)}
    >
      {/* Imagen del producto */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      
      {/* Información del producto */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.nameProduct}
        </Text>
        <Text style={styles.productPrice}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
    maxWidth: '45%',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 80,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    alignItems: 'center',
    width: '100%',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c4f74',
  },
});

export default ProductCard;