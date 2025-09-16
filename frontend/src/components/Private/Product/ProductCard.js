import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ item }) => (
  <TouchableOpacity style={styles.productCard}>
    <View style={styles.productImageContainer}>
      <Image
        source={{ uri: item.imagen }}
        style={styles.productImage}
        resizeMode="cover"
      />
    </View>
    <Text style={styles.productName}>{item.nombre}</Text>
    <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 15,
    width: '48%',
  },

  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
    textAlignVertical: 'center',
  },

  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90a4',
  },
});

export default ProductCard;
