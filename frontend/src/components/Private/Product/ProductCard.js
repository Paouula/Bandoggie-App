import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product }) => {
  return (
    <TouchableOpacity style={styles.productCard}>
      {/* Parte superior: imagen + nombre + precio */}
      <View style={styles.topSection}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.mainInfo}>
          <Text style={styles.productName}>{product.nameProduct}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
        </View>
      </View>

      {/* Parte inferior: descripción y datos */}
      <View style={styles.bottomSection}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Nombre: </Text>
            {product.nameProduct}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Precio: </Text>
            {product.price}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Categoría: </Text>
            {product.idCategory?.nameCategory || 'Sin categoría'}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Festividad: </Text>
            {product.idHolidayProduct?.nameHoliday || 'Valor no disponible'}
          </Text>
        </View>

        <View style={styles.infoColumn}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90a4',
  },
  bottomSection: {
    marginTop: 10,
  },
  infoColumn: {
    marginBottom: 8,
  },
  infoRow: {
    fontSize: 13,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
});

export default ProductCard;
