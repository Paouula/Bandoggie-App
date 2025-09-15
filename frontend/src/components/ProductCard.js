import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProductCard = ({ product, onPress }) => (
  <TouchableOpacity
    style={styles.productCard}
    onPress={() => onPress(product)}
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
        Desde ${product.price ? Number(product.price).toFixed(2) : '0.00'}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
});

export default ProductCard;